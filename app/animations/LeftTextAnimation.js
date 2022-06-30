import Animation from "./Animation";
import anime from "animejs";
import { N } from "../utils/namhai";

export default class LeftTextAnimation extends Animation {

  constructor({ element }) {
    super({ element })

    this.dX = 0
    this.animateOn = false
    this.t = 0

    this.animationDuration = 1.25
    this.observerOption = {
      rootMargin: "-35px 0px"
    }
    // N.O(this.element, 0)
    // this.onResize()
    // this.createObserver()
    this.animateOut()
  }

  animateIn() {
    this.element.style.visiblilty = 'unset'
    this.animateOn = true
  }

  animateOut() {
    this.element.style.visiblilty = 'hidden'
    N.O(this.element, 0)
  }

  tick(detla) {
    if (!this.animateOn || this.t > this.animationDuration) return
    this.t += detla
    // console.log('t', this.t, detla);
    this.dX = N.Lerp(-100, 0, N.Ease.io5(this.t / this.animationDuration))
    if (this.t < 1) N.O(this.element, N.Lerp(0, 1, N.Ease.linear(this.t / 0.75)))
    N.T(this.element, this.dX, 0, 'px')
  }

}

const transX = 100
