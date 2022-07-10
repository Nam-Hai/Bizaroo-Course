import Page from "classes/Page";
import { N } from "../../utils/namhai";
import TitleCollectionsScroll from '../../animations/TitleCollectionsScroll'

export default class Collections extends Page {
  constructor() {
    super({
      id: "collections",
      element: ".collections",
      elements: {
        articles: '.collections__article',
        medias: '.collections__gallery__media',
        updatables: {
          collectionsTitles: '.collections__titles'
        }
      }
    });

  }

  create() {
    super.create()
    this.mapMediasArticles()
  }
  mapMediasArticles() {
    this.mediaArticleMap = Object.values(this.elements.medias).map(media => media.getAttribute('data-index'))
    this.articleMediaMapLength = Object.keys(this.elements.articles).map((articleIndex) => {
      return Object.entries(this.mediaArticleMap).filter(([mapIndex, mapArticle]) => articleIndex == mapArticle).length
    })
  }

  createAnimations() {
    this.animations.updatables = []
    if (this.elements.updatables.collectionsTitles instanceof window.HTMLElement) this.elements.updatables.collectionsTitles = [this.elements.updatables.collectionsTitles]

    this.animations.updatables.push(...Object.values(this.elements.updatables.collectionsTitles).map((element) => {
      return new TitleCollectionsScroll({ element, scrollLimit: this.scrollLimit, articleMediaMap: this.articleMediaMapLength })
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

  onCollectionChange(index) {
    this.index = index
    this.selectedCollection = +this.mediaArticleMap[this.index]
    // this.selectedCollection = this.elements.medias[this.index].getAttribute('data-index')
    Object.entries(this.elements.articles).forEach(([index, article]) => {
      index === this.selectedCollection ? article.classList.add('collections__article-active') : article.classList.remove('collections__article-active')
    })

    this.animations.updatables.forEach(updatable => updatable.onCollectionChange(this.selectedCollection))
  }

  update(deltaT, scrollY) {
    for (const updatable of this.animations.updatables) {
      updatable.tick({ dt: deltaT, scrollY })
    }

    const index = Math.floor(this.elements.medias.length * scrollY / this.scrollLimit)

    if (this.index != index) {
      this.onCollectionChange(index)
    }
  }
}
