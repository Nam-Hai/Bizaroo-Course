import Media from './Media'
import { N } from '../../utils/namhai'
import { Plane, Transform } from 'ogl'

export default class {
  constructor({ gl, scene, sizes, screenAspectRatio }) {
    this.screenAspectRatio = screenAspectRatio
    this.sizes = sizes
    this.scene = scene
    this.group = new Transform()
    this.gl = gl
    this.mediasElement = N.get('.home__gallery__media img')

    console.log('mediads,', this.mediasElement);

    this.createGeometry()
    this.createGalery()


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
  }

  createGeometry() {
    this.geometry = new Plane(this.gl)
  }

  createGalery() {
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
    Object.values(this.medias).map(media => media.onResize(event))
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

  update(dT) {
    // if(Math.abs(this.x.current - this.x.target) < 0.1)
    this.x.current = N.Lerp(this.x.current, this.x.target, this.x.lerp)
    this.y.current = N.Lerp(this.y.current, this.y.target, this.y.lerp)

    this.scroll.x = this.x.current
    this.scroll.y = this.y.current

    Object.values(this.medias).map(media => media.update(dT, this.scroll))
  }
}
