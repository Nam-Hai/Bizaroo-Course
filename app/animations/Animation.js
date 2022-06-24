export default class Animation {
  constructor({
    element,
  }) {
    this.element = element;
    // this.selectorChildren = {
    //   ...elements
    // };

    this.createObserver()

    // this.animateOut()
  }

  createObserver() {
    this.observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) this.animateIn()
        else this.animateOut()
      }
    })

    this.observer.observe(this.element)
  }

  animateOut() {

  }

  animateIn() {

  }
}
