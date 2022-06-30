import Animation from "./Animation";
import anime from "animejs";
import { N } from "../utils/namhai";

export default class Galery extends Animation {

  constructor({ element }) {
    super({ element })

    this.dX = 0
    this.animateOn = false
    // this.onResize()
    // this.createObserver()
    // this.animateOut()
  }

  animateIn() {
    this.element.style.visiblilty = 'unset'
    N.O(this.element, 1)
    this.animateOn = true
  }

  animateOut() {
    this.element.style.visiblilty = 'hidden'
    N.O(this.element, 0)
    this.animateOn = false
  }

  tick(detla) {
    if (!this.animateOn) return
    this.dX += transX * detla
    N.T(this.element, this.dX, 0, 'px')
  }

}

const transX = 1
