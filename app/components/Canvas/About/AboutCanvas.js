import { N } from '../../../utils/namhai'
import { Plane, Transform } from 'ogl'
import Gallery from './Gallery'

export default class {
  constructor({ gl, scene, sizes, screenAspectRatio }) {
    this.screenAspectRatio = screenAspectRatio
    this.sizes = sizes
    this.scene = scene
    // this.group = new Transform()
    this.gl = gl
    this.galleries = N.get('.about__gallery')

    this.createGeometry()
    this.createGalleries()

    // this.group.setParent(scene)

    this.onResize({ sizes: this.sizes, screenAspectRatio: this.screenAspectRatio })
  }

  createGeometry() {
    this.geometry = new Plane(this.gl)
  }

  createGalleries() {
    this.galleriesElements = N.get('.about__gallery')
    this.galleries = Object.entries(this.galleriesElements).map(([index, element]) =>
      new Gallery({
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
    this.sizes = event.sizes
    this.screenAspectRatio = event.screenAspectRatio

    for (const gallery of this.galleries) {
      gallery.onResize(event)
    }
  }

  onTouchDown(event) {
    for (const gallery of this.galleries) {
      const clickX = event.touches ? event.touches[0].clientX : event.clientX,
        clickY = event.touches ? event.touches[0].clientY : event.clientY,
        moveOn = gallery.onTouchDown(clickX, clickY)
      if (moveOn) {
        gallery.touch.start = clickX
        gallery.touch.end = clickX
        gallery.touch.currentOnStart = gallery.slide.current
      }
    }
  }
  onTouchMove(event) {
    for (const gallery of this.galleries) {
      const clickX = event.touches ? event.touches[0].clientX : event.clientX,
        clickY = event.touches ? event.touches[0].clientY : event.clientY
      gallery.onTouchMove(clickX, clickY)
      if (gallery.touchMoveOn) {
        gallery.touch.end = clickX
        const xDistance = gallery.touch.end - gallery.touch.start
        gallery.slide.target = gallery.touch.currentOnStart + xDistance
      }
    }
  }

  onTouchUp(event) {
    for (const gallery of this.galleries) {
      gallery.onTouchUp(event)
    }
  }
  onWheel({ pixelX, pixelY }) {

  }

  update(dT, scroll) {
    const scrollWebGL = {
      x: this.sizes.width * scroll.pixelX / this.screenAspectRatio.width,
      y: this.sizes.height * scroll.pixelY / this.screenAspectRatio.height
    }
    this.scene.position.y = scrollWebGL.y
    for (const gallery of this.galleries) {
      gallery.update(dT, scroll)
    }
  }

  destroy() {
    for (let gallery of this.galleries) {
      this.scene.removeChild(gallery.group)
      gallery.mesh = null;
      gallery = null
    }
    this.galleries = null
    // this.scene.removeChild(this.group)
  }
}
