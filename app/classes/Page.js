import { N, normalizeWheel } from 'utils/namhai.js'
import anime from 'animejs';
import Title from 'animations/Title'

export default class Page {
  constructor({
    element,
    elements,
    id
  }) {
    this.selector = element;
    this.selectorChildren = {
      ...elements,
      animationTitles: '[data-animation="title"]'
    };
    this.id = id;

  }

  create() {
    this.element = N.Select.el(this.selector);
    this.elements = {};
    this.scroll = {
      currentY: 0,
      targetY: 0,
      lastY: 0,
      limit: 0
    }
    for (const [key, entry] of Object.entries(this.selectorChildren)) {
      if (entry instanceof window.HTMLElement || entry instanceof window.NodeList || Array.isArray(entry)) {
        this.elements[key] = entry;
      } else {
        let r = N.get(entry, this.element);

        // r.length === 1 ? (r = r[0]) : r.length === 0 && (r = null)
        this.elements[key] = r
      }
    }
    this.createAnimations()
  }

  createAnimations() {
    console.log('animationTitle', this.animationTitles);
    this.animationTitles = Object.entries(this.elements.animationTitles).map(element => {
      return new Title({ element })
    })
    console.log('animationTitle', this.animationTitles);
  }

  onResize() {
    console.log('page onresize');
    if (!this.elements || !this.elements.wrapper) return
    this.scroll.limit = this.elements.wrapper.clientHeight - window.innerHeight
  }

  async show() {
    return new Promise(resolve => {
      console.log('SHOWWW');
      anime.timeline({
        duration: 200,
        easing: 'easeInOutExpo',
      }).add({
        opacity: [0, 1],
        targets: this.element
      }).finished.then(() => {
        this.addEventListener();
        resolve()
      })
    })
  }

  async hide() {
    return new Promise(resolve => {
      setTimeout(() => {
        N.O(this.element, 0);
        this.removeEventListener()
        resolve()
      }, 1000)

    })
  }

  onMouseWheel(event) {
    const deltaY = event.deltaY;
    const pixelY = normalizeWheel(event)

    this.scroll.targetY += deltaY
    this.scroll.targetY = N.Clamp(this.scroll.targetY, 0, this.scroll.limit)
  }

  update(deltaT) {
    this.scroll.currentY = N.Lerp(this.scroll.currentY, this.scroll.targetY, 0.05 * deltaT)
    Math.abs(this.scroll.currentY - this.scroll.targetY) < 0.8 && (this.scroll.currentY = this.scroll.targetY)
    if (this.elements.wrapper) N.T(this.elements.wrapper, 0, -this.scroll.currentY, 'px')
  }

  addEventListener() {
    window.addEventListener('mousewheel', this.onMouseWheel.bind(this))
  }
  removeEventListener() {
    window.removeEventListener('mousewheel', this.onMouseWheel.bind(this))
  }
}
