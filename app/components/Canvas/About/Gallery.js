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

    this.scroll = {
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
    console.log('galleryBounds', this.galleryBounds);
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

  onTouchDown(x) {
    this.scroll.current = x
  }
  onTouchMove(x) {
    const distance = x.end - x.start;
    this.scroll.target = this.scroll.current + distance
  }
  onTouchUp(x) {

  }

  update(dT, scroll) {
    // console.log('gallery', scroll);

    for (let media of Object.values(this.medias)) {
      // const x = media.mesh.position.x + media.mesh.scale.x / 2;
      // if (scroll.direction.xAxis == 'right' && x < -this.sizes.width / 2) {
      //   media.extra.xCounter++;
      //   media.mesh.rotation.z = N.Rand.range(-galeryRotationBound, galeryRotationBound)
      // } else if (scroll.direction.xAxis == 'left' && x - media.mesh.scale.x > this.sizes.width / 2) {
      //   media.extra.xCounter--;
      //   media.mesh.rotation.z = N.Rand.range(-galeryRotationBound, galeryRotationBound)
      // }
      media.update(dT, scroll)
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
