import { N } from '../../../utils/namhai'
import { Plane, Transform } from 'ogl'
import Gallery from './Gallery'

export default class {
  constructor({ gl, scene, sizes, screenAspectRatio }) {
    this.screenAspectRatio = screenAspectRatio
    this.sizes = sizes
    this.scene = scene
    this.gl = gl

    this.createGeometry()
    this.createGalleries()

    this.onResize({ sizes: this.sizes, screenAspectRatio: this.screenAspectRatio })
  }

  createGeometry() {
    this.geometry = new Plane(this.gl)
  }

  createGalleries() {
    this.gallery = new Gallery({
      element: N.get('.collections__gallery__wrapper'),
      geometry: this.geometry,
      gl: this.gl,
      scene: this.scene,
      sizes: this.sizes,
      screenAspectRatio: this.screenAspectRatio
    })
  }

  onResize(event) {
    this.sizes = event.sizes
    this.screenAspectRatio = event.screenAspectRatio

    this.gallery.onResize(event)
  }

  onPicking({ data, onClick }) {
    return this.gallery.onPicking({ data, onClick })
  }

  onTouchDown(event) {
    this.gallery.onTouchDown(event)
  }
  onTouchMove(event) {
    this.gallery.onTouchMove(event)
  }

  onTouchUp(event) {
    this.gallery.onTouchUp(event)
  }

  onWheel({ pixelX, pixelY }) {

  }

  update(dT, scroll) {
    this.gallery.update(dT, scroll.pixelY)
  }

  show() {
    this.gallery.show()
  }

  hide() {
    this.gallery.hide()
  }

  destroy() {
    this.scene.removeChild(this.gallery.group)
    this.gallery.mesh = null;
    this.gallery = null
    // this.scene.removeChild(this.group)
  }
}
