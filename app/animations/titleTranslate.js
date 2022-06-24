import Animation from "./Animation";
import { doubleSpan, split } from '../utils/text'
import anime from "animejs";


export default class Title_Translate extends Animation {
  constructor({ element }) {
    super({ element })

    this.titleSpans = []
    this.titleSpans = split({
      element: this.element,
      expression: '<br>'
    })

    console.log('titlespan', this.titleSpans);
    this.titleSpans = [...this.titleSpans].map(element => element = doubleSpan(element))

    this.animateOut()
  }


  animateIn() {
    for (const el of this.titleSpans) {
      el.style.visiblilty = 'unset'
    }

    console.log('this.tuitlespans animein', this.titleSpans);
    anime({
      targets: this.titleSpans,
      translateY: ['100%', '0%'],
      easing: 'easeInOutExpo',
      duration: 1500,
      delay: anime.stagger(200)
    })
  }

  animateOut() {
    for (const el of this.titleSpans) {
      el.style.visiblilty = 'hidden'
    }
  }
}
