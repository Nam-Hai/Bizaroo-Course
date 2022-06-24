export default class Animation {
  constructor({
    element,
  }) {
    this.element = element;
    this.firstTime = false


  }

  createObserver(option) {
    this.observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) this.animateIn()
        else this.animateOut()
      }
    }, option)

    this.observer.observe(this.element)
  }

  animateOut() {

  }

  animateIn() {

  }
}
