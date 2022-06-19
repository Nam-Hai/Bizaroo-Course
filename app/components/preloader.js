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
    console.log('tjois.element double span', this.elements.titleSpans);
    this.elements.titleSpans = [...this.elements.titleSpans].map(element => element = doubleSpan(element))

    console.log('tjois.element double span', this.elements.titleSpans);
    N.O(this.elements.title, 1)
    anime({
      targets: this.elements.titleSpans,
      translateY: ['100%', '0%'],
      easing: 'easeInOutExpo',
      duration: 700,
      delay: anime.stagger(200)
    })

    this.imageCount = 0
    console.log('components;', this.element, N.get(this.selector), this.elements);

    this.createLoader()
  }

  createLoader() {
    this.animationCompleted = false
    setTimeout(() => {
      this.animationCompleted = true
      if (this.imageCount == this.elements.images.length) {
        this.emit('completed')
      }
    }, 1200)
    for (let el of this.elements.images) {

      el.onload = () => this.onAssetsLoaded()
      el.src = el.getAttribute('data-src')

    }
  }

  onAssetsLoaded() {
    this.imageCount++
    this.elements.number.innerHTML = `${N.Round(this.imageCount / this.elements.images.length * 100, 1)}%`
    console.log(this.imageCount);
    if (this.imageCount == this.elements.images.length) {
      if (this.animationCompleted) this.emit('completed')
    }
  }



  destroy() {
    this.element.parentNode.removeChild(this.element)
  }
}
