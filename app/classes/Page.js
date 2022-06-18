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

    console.log('this.selectorChildren', this.selectorChildren);

    for (const [key, entry] of Object.entries(this.selectorChildren)) {
      if (entry instanceof window.HTMLElement || entry instanceof window.NodeList || Array.isArray(entry)) {
        this.elements[key] = entry;
      } else {
        this.elements[key] = N.get(entry, this.element);

        if (this.elements[key].length === 1) {
          this.elements[key] = this.elements[key][0];
        } else if (this.elements[key].length === 0) {
          this.elements[key] = null;
        }
      }
    }
    console.log('this.element', this.elements);
  }

  show() {
    anime({
      targets: this.element,
      opacity: [0, 1],
      delay: 500
    })
  }

  hide() {
    anime({
      targets: this.element,
      opacity: 0
    })
  }
}
