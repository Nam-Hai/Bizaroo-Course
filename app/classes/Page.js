import { N } from '../utils/namhai.js'
import anime from 'animejs';
import Title from 'animations/Title'
import Title_Translate from '../animations/titleTranslate';
import SideTextAnimation from '../animations/SideTextAnimation';
import { ColorsManager } from './Colors';
import AsyncLoad from './AsyncLoad';
import ImgLoad from './ImgLoad';
import ScrollParallax from '../animations/ScrollParallax.js';

export default class Page {
  constructor({
    element,
    elements,
    id
  }) {
    this.selector = element;
    this.selectorChildren = {
      ...elements,
      title: {
        animationTitles: '[data-animation="title"]',
        animationTitlesTranslate: '[data-animation="title-translate"]'
      },
      preloaders: '[data-src]'
    };

    this.id = id;
    this.animations = {}

    this.scrollOn = false
  }

  create() {
    this.element = N.Select.el(this.selector);
    this.elements = {};
    this.elements = this.querySelectRec(this.selectorChildren)

    // this.createAnimations()

    // AsyncLoad
    // this.createPreloader()
  }

  querySelectRec(selectorObject) {
    let elements = {}
    for (const [key, entry] of Object.entries(selectorObject)) {
      if (entry instanceof window.HTMLElement || entry instanceof window.NodeList || Array.isArray(entry)) {
        elements[key] = entry;
      } else {
        let r;
        if (Object.prototype.toString.call(entry) === '[object Object]') r = this.querySelectRec(entry)
        else r = N.get(entry, this.element);
        elements[key] = r
      }
    }
    return elements
  }

  async createPreloader() {
    this.preloaders = Object.values(this.elements.preloaders).map(element => {
      return new AsyncLoad({ element })
    })
  }

  async createLoader() {
    if (this.elements.preloaders instanceof HTMLElement) this.elements.preloaders = [this.elements.preloaders]
    return new Promise(resolve => {
      this.imgLoader = new ImgLoad({ elements: this.elements.preloaders })
      this.imgLoader.once('completed', resolve)
    })
  }

  // attention a ne pas call createAnimation plusieur fois sur la meme page
  createAnimations() {
    const titles = this.elements.title
    this.animations = {}
    if (titles.animationTitles) {
      this.animations.animationTitles = Object.entries(titles.animationTitles).map(([key, element]) => {
        return new Title({ element })
      })
    }
    if (titles.animationTitlesTranslate) {
      this.animations.animationTitlesTranslate = Object.entries(titles.animationTitlesTranslate).map(([key, element]) => {
        return new Title_Translate({ element })
      })
    }
    if (this.elements.updatables) {
      this.animations.updatables = []

      if (this.elements.updatables.leftText instanceof window.HTMLElement) this.elements.updatables.leftText = [this.elements.updatables.leftText]
      this.animations.updatables.push(...Object.values(this.elements.updatables.leftText).map((element) => {
        return new SideTextAnimation({ element, side: 'left' })
      }))

      if (this.elements.updatables.rightText instanceof window.HTMLElement) this.elements.updatables.rightText = [this.elements.updatables.rightText]
      this.animations.updatables.push(...Object.values(this.elements.updatables.rightText).map((element) => {
        return new SideTextAnimation({ element, side: 'right' })
      }))

      if (this.elements.updatables.parallax instanceof window.HTMLElement) this.elements.updatables.parallax = [this.element.updatables.parallax]
      this.animations.updatables.push(...Object.values(this.elements.updatables.parallax).map((element) => {
        return new ScrollParallax({ element })
      }))
    }

    let animationsConcat = []
    for (const animation of Object.values(this.animations)) {
      animationsConcat = animationsConcat.concat(Object.values(animation))
    }
    this.animationsConcat = animationsConcat
  }

  createAnimationObserver() {
    if (!this.animationsConcat) return
    for (const animation of this.animationsConcat) {
      animation.createObserver(animation.observerOption)
    }
  }

  async show() {
    return new Promise(resolve => {
      ColorsManager.change({
        backgroundColor: this.element.getAttribute('data-background'),
        color: this.element.getAttribute('data-color')
      })
      anime.timeline({

      }).add({
        opacity: [0, 1],
        duration: 700,
        easing: 'linear',
        targets: this.element
      }).finished.then(() => {
        this.addEventListener();
        resolve()
      })
    })
  }

  afterTransition() {

  }

  async hide() {
    return new Promise(resolve => {
      anime({
        targets: this.element,
        opacity: [1, 0],
        duration: 700,
        easing: 'linear'
      })
      setTimeout(() => {
        this.destroy()
        resolve()
      }, 1000)

    })
  }

  onResize() {
    if (this.animationsConcat.length) {
      for (const animation of this.animationsConcat) {
        animation.onResize()
      }
    }

    if (!this.elements || !this.elements.wrapper) return
    this.scrollLimit = this.elements.wrapper.clientHeight - window.innerHeight
  }

  onWheel({ pixelY }) {
  }

  update(deltaT, scrollY) {
    if (this.animations.updatables) {
      for (const updatable of this.animations.updatables) {
        updatable.tick({ dt: deltaT, scrollY })
      }
    }

    if (this.elements.wrapper) N.T(this.elements.wrapper, 0, -scrollY, 'px')
  }

  addEventListener() {
    this.scrollOn = true
    // window.addEventListener('wheel', this.onWheel.bind(this))
  }
  removeEventListener() {
    window.removeEventListener('wheel', this.onWheel.bind(this))
  }

  destroy() {
    this.removeEventListener()
  }
}
