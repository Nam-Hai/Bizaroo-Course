import Animation from "./Animation";
import anime from "animejs";

export default class Title extends Animation {

  constructor({ element, elements }) {
    super({ element, elements })
    this.createObserver()
    this.animateOut()
  }

  animateIn() {
    this.element.style.visiblilty = 'unset'

    if (this.firstTime) return
    this.firstTime = true
    anime({
      targets: this.element,
      opacity: [0, 1],
      duration: 700,
      delay: 120,
      easing: 'easeInExpo'
    })
  }

  animateOut() {
    this.element.style.visiblilty = 'hidden'
  }
}
