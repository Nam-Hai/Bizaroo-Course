import anime from "animejs";
import Components from "../classes/components";
import { N } from '../utils/namhai'
import { doubleSpan, split } from '../utils/text'
export default class Preloader extends Components {
  constructor() {
    super({
      element: '.preloader',
      elements: {
        title: '.preloader__text',
        number: '.preloader__number',
        images: N.get('img')
      }
    })

    this.elements.titleSpans = split({
      element: this.elements.title,
      expression: '<br>'
    })
    this.elements.titleSpans = [...this.elements.titleSpans].map(element => element = doubleSpan(element))

    N.O(this.elements.title, 1)
    anime({
      targets: this.elements.titleSpans,
      translateY: ['100%', '0%'],
      easing: 'easeInOutExpo',
      duration: 600,
      delay: anime.stagger(200)
    })

    this.imageCount = 0


    this.createLoader()
  }

  createLoader() {
    this.animationCompleted = false
    setTimeout(() => {
      this.animationCompleted = true
      if (this.imageCount == this.elements.images.length) {
        this.emit('completed')
      }
    }, 1000)
    for (let el of this.elements.images) {

      el.onload = () => (this.onAssetsLoaded(), el.classList.add('loaded'))
      el.src = el.getAttribute('data-src')

    }
  }

  onAssetsLoaded() {
    this.imageCount++
    this.elements.number.innerHTML = `${N.Round(this.imageCount / this.elements.images.length * 100, 1)}%`
    if (this.imageCount == this.elements.images.length) {
      if (this.animationCompleted) this.emit('completed')
    }
  }


  async hide() {
    this.elements.titleSpans.push(N.get('.preloader__number'))
    return new Promise(resolve => {
      anime({
        targets: this.elements.titleSpans,
        translateY: '-115%',
        easing: 'easeInOutExpo',
        duration: 700,
        delay: anime.stagger(200),
      })
      anime({
        targets: this.element,
        translateY: '-100%',
        easing: 'easeInOutExpo',
        delay: 900,
        duration: 800,
        complete: resolve
      })
    })
  }

  destroy() {
    this.element.parentNode.removeChild(this.element)
  }
}
