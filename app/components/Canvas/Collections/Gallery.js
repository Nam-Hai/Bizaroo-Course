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
    console.log('gallery created');
    this.element = element;
    this.geometry = geometry;
    this.gl = gl;
    this.scene = scene;
    this.group = new Transform()
    this.group.setParent(scene)
    this.sizes = sizes;
    this.screenAspectRatio = screenAspectRatio
    this.scroll = 0
    this.onSlide = false

    this.touch = {
      start: 0,
      end: 0,
      currentOnStart: 0
    }
    this.slide = {
      current: 0,
      target: 0,
      last: 0,
      lerp: 0.1
    }

    this.galleryDimension = {
      width: 0,
      height: 0
    }
    this.createMedias()
  }

  createMedias() {
    const mediasElement = N.get('.collections__gallery__media img', this.element)
    this.medias = Object.entries(mediasElement).map(([index, element]) =>
      new Media({
        element,
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

  onTouchDown(event) {
    this.onSlide = true
    const clickX = event.touches ? event.touches[0].clientX : event.clientX
    this.touch.start = clickX
    this.touch.end = clickX
    this.touch.currentOnStart = this.slide.current
  }
  onTouchMove(event) {
    if (!this.onSlide) return
    const clickX = event.touches ? event.touches[0].clientX : event.clientX
    this.touch.end = clickX
    const xDistance = this.touch.end - this.touch.start
    this.slide.target = N.Clamp(this.touch.currentOnStart + xDistance + this.scroll, 0, this.galleryBounds.width)
  }
  onTouchUp(event) {
    this.onSlide = false
  }

  update(dT, scroll) {
    this.scroll = scroll
    this.slide.current = N.Lerp(this.slide.current, this.slide.target, 0.1)
    for (let media of Object.values(this.medias)) {
      media.update(dT, scroll, this.slide.current)
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
