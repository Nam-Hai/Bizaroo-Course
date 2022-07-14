import { Transform } from "ogl";
import { N } from "../../../utils/namhai";
import Media from "./Media";

export default class {
  constructor({
    element,
    geometry,
    gl,
    scene,
    sizes,
    screenAspectRatio
  }) {
    this.element = element;
    this.geometry = geometry;
    this.gl = gl;
    this.scene = scene;
    this.group = new Transform()
    this.group.setParent(scene)
    this.sizes = sizes;
    this.screenAspectRatio = screenAspectRatio
    this.scroll = 0

    this.touch = {
      start: 0,
      end: 0,
      currentOnStart: 0
    }

    this.galleryDimension = {
      width: 0,
      height: 0
    }
    this.createMedias()
  }

  createMedias() {
    const linkElement = N.get('.collection__gallery__link', this.element)
    this.medias = Object.entries(linkElement).map(([index, link]) =>
      new Media({
        element: N.get('img', link),
        link,
        geometry: this.geometry,
        gl: this.gl,
        index,
        scene: this.group,
        sizes: this.sizes,
        screenAspectRatio: this.screenAspectRatio
      })
    )
  }


  onResize(event) {
    this.galleryBounds = this.element.getBoundingClientRect()
    this.galleryBounds.y = this.galleryBounds.x + this.scroll
    this.sizes = event.sizes
    this.screenAspectRatio = event.screenAspectRatio
    if (this.galleryBounds) {
      this.galleryDimension.width = (this.galleryBounds.width / this.screenAspectRatio.width) * this.sizes.width
      this.galleryDimension.height = (this.galleryBounds.height / this.screenAspectRatio.height) * this.sizes.height
    }

    for (const media of this.medias) {


      media.onResize({ ...event, galleryDimension: this.galleryDimension })
    }
  }

  onPicking({ data, onClick }) {
    for (const media of this.medias) {
      if (media.onPicking({ data, onClick }) == true) return true
    }
    return false
  }

  onTouchDown(event) {
  }
  onTouchMove(event) {
  }

  onTouchUp(event) {
  }

  update(dT, scroll) {
    this.scroll = scroll
    for (let media of Object.values(this.medias)) {
      media.update(dT, scroll)
    }
  }

  show() {
    for (const media of this.medias) {
      media.show()
    }
  }

  hide() {
    for (const media of this.medias) {
      media.hide()
    }
  }

  destroy() {
    for (const media of this.medias) {
      this.scene.removeChild(media.mesh)
      media.mesh = null;
      media = null
    }
    this.medias = null
  }
}
