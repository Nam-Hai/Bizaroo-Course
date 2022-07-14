import { N } from '../utils/namhai';
import EventEmiter from 'events'


export default class ImgLoad extends EventEmiter {
  constructor({ elements }) {
    super()
    this.elements = elements
    this.preloadLenght = this.elements.length
    this.count = 0

    this.createLoader()
  }

  createLoader() {
    if (this.elements instanceof HTMLElement) this.elements = [this.elements]
    for (let el of this.elements) {
      el.onload = () => (this.onAssetLoad(), el.classList.add('loaded'));
      el.src = el.getAttribute('data-src')
    }
  }

  onAssetLoad() {
    this.count++;
    if (this.count == this.preloadLenght) {
      this.emit('completed')
    }
  }
}
