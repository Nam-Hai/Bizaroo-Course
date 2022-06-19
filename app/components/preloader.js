import Components from "../classes/components";
import { N } from '../utils/namhai'

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



    this.imageCount = 0
    console.log('components;', this.element, N.get(this.selector), this.elements);

    this.createLoader()
  }

  createLoader() {
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
      this.emit('completed')
    }
  }



  destroy() {
    this.element.parentNode.removeChild(this.element)
  }
}
