import Media from './Media'
import { N } from '../../../utils/namhai'
import { Plane, Transform } from 'ogl'
import { galeryRotationBound } from '../../../utils/constant';

export default class {
  constructor({ gl, scene, sizes, screenAspectRatio }) {
    this.screenAspectRatio = screenAspectRatio
    this.sizes = sizes
    this.scene = scene
    this.group = new Transform()
    this.gl = gl

    this.galleryElement = N.get('.home__gallery')
    this.mediasElement = N.get('.home__gallery__media img', this.galleryElement)

    this.galleryDimension = {
      width: 0,
      height: 0
    }

    this.createGeometry()
    this.createGallery()


    this.group.setParent(scene)

    this.onResize({ sizes: this.sizes, screenAspectRatio: this.screenAspectRatio })

  }

  createGeometry() {
    this.geometry = new Plane(this.gl, {
      heightSegments: 20,
      widthSegments: 20
    })
  }

  createGallery() {
    this.medias = Object.entries(this.mediasElement).map(([index, element]) =>
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

    this.galleryBounds = this.galleryElement.getBoundingClientRect()

    this.sizes = event.sizes
    this.screenAspectRatio = event.screenAspectRatio
    if (this.galleryBounds) {
      this.galleryDimension.width = (this.galleryBounds.width / this.screenAspectRatio.width) * this.sizes.width
      this.galleryDimension.height = (this.galleryBounds.height / this.screenAspectRatio.height) * this.sizes.height
    }

    Object.values(this.medias).map(media => {
      const x = media.position.x + media.mesh.scale.x / 2;
      const y = media.position.y + media.mesh.scale.y / 2;
      if (x < -this.sizes.width / 2) {
        media.extra.xCounter++;
      } else if (x - media.mesh.scale.x > this.sizes.width / 2) {
        media.extra.xCounter--;
      }
      if (y < -this.sizes.height / 2) {
        media.extra.yCounter--;
      } else if (y - media.mesh.scale.y > this.sizes.height / 2) {
        media.extra.yCounter++;
      }
      media.onResize({ ...event, galleryDimension: this.galleryDimension, depth: event.depth })
    })
  }

  onTouchDown({ x, y }) {
  }
  onTouchMove({ x, y }) {
  }
  onTouchUp({ x, y }) {

  }

  onWheel({ pixelX, pixelY }) {
  }

  update(dT, scroll) {

    for (let media of Object.values(this.medias)) {

      const x = media.position.x + media.mesh.scale.x / 2;
      const y = media.position.y + media.mesh.scale.y / 2;
      if (scroll.direction.xAxis == 'right' && x < -this.sizes.width / 2) {
        media.extra.xCounter++;
        media.mesh.rotation.z = N.Rand.range(-galeryRotationBound, galeryRotationBound)
      } else if (scroll.direction.xAxis == 'left' && x - media.mesh.scale.x > this.sizes.width / 2) {
        media.extra.xCounter--;
        media.mesh.rotation.z = N.Rand.range(-galeryRotationBound, galeryRotationBound)
      }
      if (scroll.direction.yAxis == 'up' && y < -this.sizes.height / 2) {
        media.extra.yCounter--;
        media.mesh.rotation.z = N.Rand.range(-galeryRotationBound, galeryRotationBound)
      } else if (scroll.direction.yAxis == 'down' && y - media.mesh.scale.y > this.sizes.height / 2) {
        media.extra.yCounter++;
        media.mesh.rotation.z = N.Rand.range(-galeryRotationBound, galeryRotationBound)
      }
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
    for (let media of Object.values(this.medias)) {
      this.group.removeChild(media.mesh)
      media.mesh = null;
      media = null
    }
    this.medias = null
    this.scene.removeChild(this.group)
  }
}
