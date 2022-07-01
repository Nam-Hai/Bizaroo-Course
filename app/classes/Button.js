import anime from "animejs";
import Components from "./components";
import { N } from "../utils/namhai";


export default class Button extends Components {
  constructor({ element }) {
    super({ element })

    this.path = N.get('path:last-child', this.element)
    this.pathLength = this.path.getTotalLength()

    this.timeline = anime.timeline({
      easing: 'linear',
    })
    this.timeline.add({
      targets: this.path,
      strokeDashoffset: [anime.setDashoffset, 0],
      duration: 700,
    })

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
    this.timeline.play()
  }

  onMouseLeave() {
    console.log('leave');
    this.timeline.reverse()
  }
}
