import Animation from "./Animation";
import anime from "animejs";
import { N } from "../utils/namhai";

export default class Title extends Animation {

  constructor({ element }) {
    super({ element })

    // this.onResize()
    this.createObserver()
    this.animateOut()
  }

  animateIn() {
    this.element.style.visiblilty = 'unset'
    N.O(this.element, 1)

    if (this.firstTime) return
    this.firstTime = true
    anime({
      targets: this.element,
      opacity: [0, 1],
      duration: 700,
      easing: 'easeInExpo'
    })
  }

  animateOut() {
    this.element.style.visiblilty = 'hidden'
    N.O(this.element, 0)
  }


}
