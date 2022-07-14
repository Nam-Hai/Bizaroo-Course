import Animation from "./Animation";
import anime from "animejs";
import { N } from "../utils/namhai";

const translationStart = 50,
  translationEnd = -40
export default class TitleCollectionsScroll extends Animation {

  constructor({ element, scrollLimit, articleMediaMap }) {
    super({ element })
    this.scrollLimit = scrollLimit
    this.collectionsArticleLength = articleMediaMap.length
    this.articleMediaMap = [0]
    Object.entries(articleMediaMap).forEach(([index, length]) => {
      this.articleMediaMap.push(this.articleMediaMap[index] + length)
    })
    this.animateOut()
  }

  animateIn() {
    // anime({
    //   targets: this.element,
    //   opacity: [0, 1],
    //   duration: 700,
    //   easing: 'linear'
    // })
  }

  animateOut() {
  }

  onCollectionChange(index) {
    this.selectedCollection = index
  }

  tick({ dt, scrollY }) {
    // scroll entre 50 et -40% pour pouvoir translate comme il faut
    const i = this.selectedCollection
    const mapedLength = N.map(scrollY / this.scrollLimit, this.articleMediaMap[i] / this.articleMediaMap[this.collectionsArticleLength], this.articleMediaMap[i + 1] / this.articleMediaMap[this.collectionsArticleLength], i / this.collectionsArticleLength, (i + 1) / this.collectionsArticleLength)
    const mapedScroll = N.map(mapedLength, 0, 1, translationStart, translationEnd)

    this.element.style.transform = `rotate(-90deg) translate3d( ${mapedScroll}%,-50%, 0)`
  }

  onResize(scrollLimit) {
    this.scrollLimit = scrollLimit
  }
}
