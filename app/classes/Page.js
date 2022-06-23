import { N } from 'utils/namhai.js'
import anime from 'animejs';

export default class Page {
  constructor({
    element,
    elements,
    id
  }) {
    this.selector = element;
    this.selectorChildren = {
      ...elements
    };
    this.id = id;
  }

  create() {
    this.element = N.Select.el(this.selector);
    this.elements = {};
    // N.O(this.element, 0)

    console.log('this.selectorChildren', this.selectorChildren);

    for (const [key, entry] of Object.entries(this.selectorChildren)) {
      if (entry instanceof window.HTMLElement || entry instanceof window.NodeList || Array.isArray(entry)) {
        this.elements[key] = entry;
      } else {
        let r = N.get(entry, this.element);

        // r.length === 1 ? (r = r[0]) : r.length === 0 && (r = null)
        this.elements[key] = r
      }
    }
    console.log('this.element', this.elements);
  }

  async show() {
    console.log('this.element promise', this.elements);
    return new Promise(resolve => {
      anime({
        targets: this.element,
        opacity: 1,
        duration: 200,
        easing: 'easeInOutExpo',
        complete: resolve
      })
    })
  }

  async hide() {
    return new Promise(resolve => {
      setTimeout(() => {
        N.O(this.element, 0);
        resolve()
      }, 1000)

    })
  }
}
