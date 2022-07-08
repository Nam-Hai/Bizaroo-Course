import { Transform } from "ogl";
import { N } from "../../../utils/namhai";
import Media from "./Media";

export default class {
  constructor({
    element,
    geometry,
    index,
    gl,
    scene,
    sizes,
    screenAspectRatio
  }) {
    this.element = element;
    this.geometry = geometry;
    this.index = index;
    this.gl = gl;
    this.scene = scene;
    this.group = new Transform()
    this.group.setParent(scene)
    this.sizes = sizes;
    this.screenAspectRatio = screenAspectRatio
    this.touchMoveOn = false
    this.scroll = {
      pixelY: 0,
      pixelX: 0
    }

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
    const mediasElement = N.get('.about__gallery__media img', this.element)
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
    this.galleryBounds.y = this.galleryBounds.top + this.scroll.pixelY
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

  onTouchDown(x, y) {
    // console.log(y, this.galleryBounds.y, this.scroll.pixelY);
    this.touchMoveOn = y + this.scroll.pixelY > this.galleryBounds.y && y + this.scroll.pixelY < this.galleryBounds.y + this.galleryBounds.height
    return this.touchMoveOn
  }
  onTouchMove(x) {
  }
  onTouchUp(x) {
    this.touchMoveOn = false
  }

  update(dT, scroll) {
    this.scroll = {
      pixelX: scroll.pixelX,
      pixelY: scroll.pixelY
    }
    this.slide.current = N.Lerp(this.slide.current, this.slide.target, 0.1)
    for (let media of Object.values(this.medias)) {
      // const x = media.mesh.position.x + media.mesh.scale.x / 2;
      // if (scroll.direction.xAxis == 'right' && x < -this.sizes.width / 2) {
      //   media.extra.xCounter++;
      //   media.mesh.rotation.z = N.Rand.range(-galeryRotationBound, galeryRotationBound)
      // } else if (scroll.direction.xAxis == 'left' && x - media.mesh.scale.x > this.sizes.width / 2) {
      //   media.extra.xCounter--;
      //   media.mesh.rotation.z = N.Rand.range(-galeryRotationBound, galeryRotationBound)
      // }
      media.update(dT, scroll, this.slide.current)
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
