import Animation from "./Animation";
import { calculate, doubleSpan, lineSpaning, split } from '../utils/text'
import anime from "animejs";
import { N } from "../utils/namhai";


export default class Title_Translate extends Animation {
  constructor({ element }) {
    super({ element })
    this.elementTemplate = this.element.cloneNode(true)

    this.titleSpans = []
    this.titleLines = []
    this.observerOption = {
      rootMargin: "0px 0px -30px 0px"
    }


    this.initSize()
    this.animateOut()
  }



  animateIn() {
    N.O(this.element, 1)
    if (this.firstTime) return
    this.firstTime = true
    anime({
      targets: this.titleLines,
      translateY: ['100%', '0%'],
      easing: 'easeInOutExpo',
      duration: 600,
      delay: anime.stagger(200)
    })
  }

  animateOut() {

  }


  initSize() {
    this.element.innerHTML = this.elementTemplate.cloneNode(true).innerHTML
    this.titleLines = []
    this.titleSpans = split({ element: this.element })
    let nodeLines = calculate(this.titleSpans)
    nodeLines = nodeLines.map(line => lineSpaning(line))
    this.element.innerHTML = ''
    for (const line of nodeLines) {
      this.element.appendChild(line)
      this.titleLines.push(N.get('span', line))
    }
  }


  // ici dans le CSS la font size scale avec vw donc de toute facon les titres vont toujours garder la meme taille relative. Eventuellement besoin en version mobile lors d'un changement
  onResize() {
    // this.element.innerHTML = this.elementTemplate.cloneNode(true).innerHTML
    // this.titleLines = []
    // this.titleSpans = split({ element: this.element })
    // let nodeLines = calculate(this.titleSpans)
    // nodeLines = nodeLines.map(line => lineSpaning(line))
    // this.element.innerHTML = ''
    // for (const line of nodeLines) {
    //   this.element.appendChild(line)
    //   this.titleLines.push(N.get('span', line))
    // }
  }
}
