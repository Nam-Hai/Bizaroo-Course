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

    console.log('mediads,', this.mediasElement);

    this.createGeometry()
    this.createGallery()


    this.group.setParent(scene)

    this.x = {
      current: 0,
      target: 0,
      lerp: 0.1
    }
    this.y = {
      current: 0,
      target: 0,
      lerp: 0.1
    }

    this.scrollCurrent = {
      x: 0,
      y: 0
    }
    this.scroll = {
      x: 0,
      y: 0
    }

    this.onResize({ sizes: this.sizes, screenAspectRatio: this.screenAspectRatio })

    console.log(this.galleryDimension.width, this.galleryBounds);
  }

  createGeometry() {
    this.geometry = new Plane(this.gl)
  }

  createGallery() {
    this.medias = Object.entries(this.mediasElement).map(([index, element]) =>
      new Media({
        element,
        geometry: this.geometry,
        gl: this.gl,
        index,
        scene: this.scene,
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
      const x = media.mesh.position.x + media.mesh.scale.x / 2;
      const y = media.mesh.position.y + media.mesh.scale.y / 2;
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
      media.onResize({ ...event, galleryDimension: this.galleryDimension })
    })
    console.log(this.galleryDimension.width);
  }

  onTouchDown({ x, y }) {
    this.scrollCurrent.x = this.scroll.x
    this.scrollCurrent.y = this.scroll.y
  }
  onTouchMove({ x, y }) {
    const xDistance = x.end - x.start,
      yDistance = y.end - y.start
    this.x.target = this.scrollCurrent.x + xDistance
    this.y.target = this.scrollCurrent.y + yDistance
  }
  onTouchUp({ x, y }) {

  }

  onWheel({ pixelX, pixelY }) {
    this.x.target += pixelX;
    this.y.target += pixelY;
  }

  update(dT) {
    this.x.current = N.Lerp(this.x.current, this.x.target, this.x.lerp)
    this.y.current = N.Lerp(this.y.current, this.y.target, this.y.lerp)
    if (Math.abs(this.x.current - this.x.target) < 0.01) {
      this.x.current = this.x.target
    }
    if (Math.abs(this.y.current - this.y.target) < 0.01) {
      this.y.current = this.y.target
    }

    this.x.direction = this.scroll.x > this.x.current ? 'right' : this.scroll.x < this.x.current ? 'left' : null;
    this.y.direction = this.scroll.y < this.y.current ? 'up' : this.scroll.y > this.y.current ? 'down' : null;

    // console.log('direction', this.x.direction);
    this.scroll.x = this.x.current
    this.scroll.y = this.y.current

    for (let media of Object.values(this.medias)) {

      // console.log('object', media.mesh.position.x, this.sizes.width);
      const x = media.mesh.position.x + media.mesh.scale.x / 2;
      const y = media.mesh.position.y + media.mesh.scale.y / 2;
      if (this.x.direction == 'right' && x < -this.sizes.width / 2) {
        media.extra.xCounter++;
        media.mesh.rotation.z = N.Rand.range(-galeryRotationBound, galeryRotationBound)
      } else if (this.x.direction == 'left' && x - media.mesh.scale.x > this.sizes.width / 2) {
        media.extra.xCounter--;
        media.mesh.rotation.z = N.Rand.range(-galeryRotationBound, galeryRotationBound)
      }
      if (this.y.direction == 'up' && y < -this.sizes.height / 2) {
        media.extra.yCounter--;
        media.mesh.rotation.z = N.Rand.range(-galeryRotationBound, galeryRotationBound)
      } else if (this.y.direction == 'down' && y - media.mesh.scale.y > this.sizes.height / 2) {
        media.extra.yCounter++;
        media.mesh.rotation.z = N.Rand.range(-galeryRotationBound, galeryRotationBound)
      }
      media.update(dT, this.scroll)
    }
  }
}
