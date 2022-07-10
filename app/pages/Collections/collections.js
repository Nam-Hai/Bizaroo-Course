import Page from "classes/Page";
import { N } from "../../utils/namhai";
import TitleCollectionsScroll from '../../animations/TitleCollectionsScroll'

export default class Collections extends Page {
  constructor() {
    super({
      id: "collections",
      element: ".collections",
      elements: {
        updatables: {
          collectionsTitles: '.collections__titles'
        }
      }
    });
  }

  createAnimations() {
    this.animations.updatables = []
    if (this.elements.updatables.collectionsTitles instanceof window.HTMLElement) this.elements.updatables.collectionsTitles = [this.elements.updatables.collectionsTitles]

    this.animations.updatables.push(...Object.values(this.elements.updatables.collectionsTitles).map((element) => {
      return new TitleCollectionsScroll({ element, scrollLimit: this.scrollLimit })
    }))

    let animationsConcat = []
    for (const animation of Object.values(this.animations)) {
      animationsConcat = animationsConcat.concat(Object.values(animation))
    }
    this.animationsConcat = animationsConcat
  }

  onResize() {
    const bounds = N.get('.collections__gallery__wrapper').getBoundingClientRect()
    const childBounds = N.Select.el('.collections__gallery__media').getBoundingClientRect()
    this.scrollLimit = bounds.width - childBounds.width


    for (const animation of this.animationsConcat) {
      animation.onResize(this.scrollLimit)
    }
  }
}
