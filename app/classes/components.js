import { N } from 'utils/namhai.js'
import EventEmiter from 'events'
import anime from 'animejs';

export default class Components extends EventEmiter {
  constructor({
    element,
    elements,
  }) {
    super()
    this.selector = element;
    this.selectorChildren = {
      ...elements
    };

    this.create()
    this.addEventListener()
  }

  create() {
    console.log('this.selector', this.selector);
    this.element = this.selector instanceof window.HTMLElement ? this.selector : N.Select.el(this.selector);
    this.elements = {};

    for (const [key, entry] of Object.entries(this.selectorChildren)) {
      if (entry instanceof window.HTMLElement || entry instanceof window.NodeList || Array.isArray(entry)) {
        this.elements[key] = entry;
      } else {
        let r = N.get(entry, this.element);

        // r.length === 1 ? (r = r[0]) : r.length === 0 && (r = null)
        this.elements[key] = r
      }
    }
  }

  addEventListener() {

  }

  removeEventListener() {

  }

  async hide() {
    return new Promise(resolve => {
      anime({
        targets: this.element,
        opacity: 0,
        duration: 1000,
        easing: 'easeInOutExpo',
        complete: resolve
      })
    })
  }
}
