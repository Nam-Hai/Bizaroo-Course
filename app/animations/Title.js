import Animation from "./Animation";
import anime from "animejs";

export default class Title extends Animation {

  constructor() {

  }

  animateIn() {
    this.element.style.visiblilty = 'unset'
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
