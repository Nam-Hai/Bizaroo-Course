import Animation from "./Animation";
import { doubleSpan, split } from '../utils/text'
import anime from "animejs";
import { N } from "../utils/namhai";


export default class Title_Translate extends Animation {
  constructor({ element }) {
    super({ element })

    this.titleSpans = []
    this.titleSpans = split({
      element: this.element,
      expression: '<br>'
    })

    this.titleSpans = [...this.titleSpans].map(element => element = doubleSpan(element))

    N.O(this.element, 1)
    this.createObserver({
      rootMargin: "-30px 0px"
    })
    this.animateOut()
  }


  animateIn() {
    for (const el of this.titleSpans) {
      el.style.visiblilty = 'unset'
    }
    if (this.firstTime) return
    this.firstTime = true
    anime({
      targets: this.titleSpans,
      translateY: ['100%', '0%'],
      easing: 'easeInOutExpo',
      duration: 600,
      delay: anime.stagger(200)
    })
  }

  animateOut() {
    for (const el of this.titleSpans) {
      el.style.visiblilty = 'hidden'
    }
  }
}
