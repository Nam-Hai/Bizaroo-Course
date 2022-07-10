import Animation from "./Animation";
import anime from "animejs";
import { N } from "../utils/namhai";

export default class TitleCollectionsScroll extends Animation {

  constructor({ element, scrollLimit }) {
    super({ element })
    this.scrollLimit = scrollLimit
    // this.onResize()
    // this.createObserver()
    this.animateOut()
  }

  animateIn() {
  }

  animateOut() {
  }

  tick({ dt, scrollY }) {
    const mapedScroll = N.map(scrollY / this.scrollLimit, 0, 1, 50, -40)
    this.element.style.transform = `rotate(-90deg) translate3d( ${mapedScroll}%,-50%, 0)`
  }

  onResize(scrollLimit) {
    this.scrollLimit = scrollLimit
  }
}
