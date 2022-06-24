export default class Animation {
  constructor({
    element,
    elements,
  }) {
    this.selector = element;
    this.selectorChildren = {
      ...elements
    };

    this.create()

    this.createObserver()

    this.animateOut()
  }

  create() {
    !(this.selector instanceof window.HTMLElement) ? this.element = N.Select.el(this.selector) : this.element = this.selector

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

  createObserver() {
    this.observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) this.animateIn()
        else this.animateOut()
      }
    })

    console.log('this.observer', this.observer);

    this.observer.observe(this.element)
  }

  animateOut() {

  }

  animateIn() {

  }
}
