import { N } from '../utils/namhai';
import EventEmiter from 'events'


export default class ImgLoad extends EventEmiter {
  constructor({ elements }) {
    super()
    this.elements = elements
    this.preloadLenght = this.elements.length
    this.count = 0

    console.log('LOADER', this.count, this.preloadLenght, this.elements);
    this.createLoader()
  }

  createLoader() {
    for (let el of this.elements) {
      console.log('createLoader');
      el.onload = () => (this.onAssetLoad(), el.classList.add('loaded'));
      el.src = el.getAttribute('data-src')
    }
  }

  onAssetLoad() {
    this.count++;
    if (this.count == this.preloadLenght) {
      console.log('completed');
      this.emit('completed')
    }
  }
}
