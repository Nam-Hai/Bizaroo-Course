import anime from "animejs";
import { N } from "../utils/namhai";

export default class TransitionSVG {
  constructor() {
    this.element = N.get('.transition-SVG')
    this.path = N.get('path', this.element)

    console.log(this.path);
    this.path.d = 'm 9 0 c -5 0 -6 0 -9 0 l 0 0 c 3 0 4 0 9 0 c 5 0 6 0 9 0 l 0 0 c -3 0 -4 0 -9 0'

    this.transitionAllowed = false
  }

  async onTransition(route) {
    if (route == 'detail') return
    this.transitionAllowed = true
    return new Promise(s => this.startTransition().then(_ => s()))
  }

  async startTransition() {
    return new Promise(s => {
      let tl = anime.timeline({
        targets: this.path,
        duration: 300,
        easing: 'easeInOutQuart',
      })
      tl.add({

        d: [{
          value: ['m 9 0 c -5 0 -6 0 -9 0 l 0 0 c 3 0 4 0 9 0 c 5 0 6 0 9 0 l 0 0 c -3 0 -4 0 -9 0', 'm 9 0 c -5 0 -6 0 -9 0 l 0 0 c 3 0 4 -6 9 -6 c 5 0 6 6 9 6 l 0 0 c -3 0 -4 0 -9 0']
        }]
      }).add({

        d: [{
          value: ['m 9 0 c -5 0 -6 0 -9 0 l 0 0 c 3 0 4 -6 9 -6 c 5 0 6 6 9 6 l 0 0 c -3 0 -4 0 -9 0', 'm 9 0 c -5 0 -6 0 -9 0 l 0 -6 c 3 0 4 0 9 0 c 5 0 6 0 9 0 l 0 6 c -3 0 -4 0 -9 0']
        }]
      }).finished.then(() => { s() })
    })

  }

  async endTransition() {
    if (!this.transitionAllowed) return
    return new Promise(s => {
      let tl = anime.timeline({
        targets: this.path,
        duration: 300,
        easing: 'easeInOutQuart'
      })
      tl.add({
        d: [{
          value: ['m 9 0 c -5 0 -6 0 -9 0 l 0 -6 c 3 0 4 0 9 0 c 5 0 6 0 9 0 l 0 6 c -3 0 -4 0 -9 0', 'm 9 -6 c -5 0 -6 6 -9 6 l 0 -6 c 3 0 4 0 9 0 c 5 0 6 0 9 0 l 0 6 c -3 0 -4 -6 -9 -6']
        }]
      }).add({
        d: [{
          value: ['m 9 -6 c -5 0 -6 6 -9 6 l 0 -6 c 3 0 4 0 9 0 c 5 0 6 0 9 0 l 0 6 c -3 0 -4 -6 -9 -6', 'm 9 -6 c -5 0 -6 0 -9 0 l 0 0 c 3 0 4 0 9 0 c 5 0 6 0 9 0 l 0 0 c -3 0 -4 0 -9 0']
        }]
      })

      tl.finished.then(() => s())
    })
  }

}

