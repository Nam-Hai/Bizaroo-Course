import Components from "./components";

export default class AsyncLoad extends Components {
  constructor({ element }) {
    super({
      element,
      elements: {}
    })

    this.createObserver()
  }

  createObserver(option) {
    this.observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          if (!this.element.src) {
            this.element.src = this.element.getAttribute('data-src')
            this.element.classList.add('loaded')
          }
        }
      }
    }, option)

    this.observer.observe(this.element)
  }
}
