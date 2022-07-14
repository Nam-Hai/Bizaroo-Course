import Animation from "./Animation";
import anime from "animejs";
import { N } from "../utils/namhai";

export default class Title extends Animation {

  constructor({ element }) {
    super({ element })

    // this.onResize()
    // this.createObserver()
    this.animateOut()
  }

  animateIn() {
    N.O(this.element, 1)
    if (this.firstTime) return
    this.firstTime = true
    anime({
      targets: this.element,
      opacity: [0, 1],
      translateY: ['-30%', '-50%'],
      rotate: ['-90deg', '-90deg'],
      duration: 700,
      easing: 'linear'
    })
  }

  animateOut() {

  }


}
