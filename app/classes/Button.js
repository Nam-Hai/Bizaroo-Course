import anime from "animejs";
import Components from "./components";
import { N } from "../utils/namhai";


export default class Button extends Components {
  constructor({ element }) {
    super({ element })

    this.path = N.get('path:last-child', this.element)
    this.pathLength = this.path.getTotalLength()

    this.timeline = anime.timeline({
      easing: 'easeInExpo',
      direction: 'normal',
      autoplay: false
    })
    this.timeline.add({
      targets: this.path,
      strokeDashoffset: [0, anime.setDashoffset],
      duration: 700,
    })

    this.path.style.strokeDashoffset = anime.setDashoffset(this.path)
    this.first = false
  }

  addEventListener() {
    this.element.addEventListener('mouseenter', this.onMouseEnter.bind(this))
    this.element.addEventListener('mouseleave', this.onMouseLeave.bind(this))
  }
  removeEventListener() {
    this.element.removeEventListener('mouseenter', this.onMouseEnter.bind(this))
    this.element.removeEventListener('mouseleave', this.onMouseLeave.bind(this))
  }


  onMouseEnter() {
    console.log('enter');
    if (!this.first) {
      this.timeline.play()
      this.timeline.reverse()
      this.timeline.restart()
      this.first = true
      return
    }
    this.timeline.reverse()
    this.timeline.play()
  }

  onMouseLeave() {
    console.log('leave');
    this.timeline.reverse()
    this.timeline.restart()
  }
}
