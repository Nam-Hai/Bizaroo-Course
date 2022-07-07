import Animation from "./Animation";
import anime from "animejs";
import { N } from "../utils/namhai";

const parallaxParentSpeed = -25
const parallaxChildSpeed = -70
export default class ScrollParallax extends Animation {

  constructor({ element }) {
    super({ element })
    this.bounds = this.element.getBoundingClientRect()
    this.childImage = N.get('img', this.element)
    // this.onResize()
    // this.createObserver()
  }

  animateIn() {
    N.O(this.element, 1)
  }

  animateOut() {

  }

  tick({ dt, scrollY }) {
    const offset = N.map(window.innerHeight + scrollY, this.bounds.top, this.bounds.bottom + window.innerHeight, 0, 1)
    N.T(this.element, 0, offset * parallaxParentSpeed, 'px')
    const scale = 1.1 - offset * 0.03
    this.childImage.style.transform = 'scale(' + scale + ') translateY(' + offset * parallaxChildSpeed + 'px)'
  }
}
