

import vertex from '../../shaders/plane-vertex.glsl'
import fragment from '../../shaders/plane-fragment.glsl'
import { Mesh, Program, Texture } from 'ogl'

export default class {
  constructor({ element, gl, geometry, scene, index, sizes, screenAspectRatio }) {
    this.screenAspectRatio = screenAspectRatio
    this.sizes = sizes
    this.gl = gl
    this.geometry = geometry
    this.element = element
    this.scene = scene
    this.index = index


    this.createTexture()
    this.createProgram()
    this.createMesh()

    this.getBounds()
  }

  createTexture() {
    this.texture = new Texture(this.gl)

    this.image = new window.Image();
    this.image.crossOrigin = 'anonymous'
    this.image.src = this.element.getAttribute('data-src')
    this.image.onload = () => {
      this.texture.image = this.image
    }

  }

  createProgram() {
    this.program = new Program(this.gl, {
      fragment,
      vertex,
      uniforms: {
        tMap: {
          value: this.texture
        }
      }
    })
  }

  createMesh() {
    this.mesh = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    })

    this.mesh.setParent(this.scene)

  }

  getBounds() {
    this.bounds = this.element.getBoundingClientRect();

    this.updateScale()
    this.updateX()
    this.updateY()
  }

  updateScale() {
    // la nouvelle taille l'image
    this.width = this.bounds.width / this.screenAspectRatio.width
    this.height = this.bounds.height / this.screenAspectRatio.height

    this.mesh.scale.x = this.sizes.width * this.width
    this.mesh.scale.y = this.sizes.height * this.height

    // put images at "(0,0)" le centre de chaque image
    // this.mesh.position.x = -this.sizes.width / 2
    // this.mesh.position.y = this.sizes.height / 2

    // put images at "(0,0)" la postion "(0,0)" de chaque image
    // this.mesh.position.x += this.mesh.scale.x / 2
    // this.mesh.position.y -= this.mesh.scale.y / 2

  }

  updateX(dT, x = 0) {
    // (0,0) of the screen
    this.mesh.position.x = -this.sizes.width / 2 + this.mesh.scale.x / 2
    // the actual x value + conversion pixel en [-1, 1]
    this.mesh.position.x += ((this.bounds.left + x) / this.screenAspectRatio.width) * this.sizes.width

  }

  updateY(dT, y = 0) {
    this.mesh.position.y = this.sizes.height / 2 - this.mesh.scale.y / 2


    this.mesh.position.y -= ((this.bounds.top + y) / this.screenAspectRatio.height) * this.sizes.height

  }

  update(dT, scroll) {
    if (!this.bounds) return
    this.updateX(dT, scroll.x)
    this.updateY(dT, scroll.y)
  }

  onResize({ sizes, screenAspectRatio }) {
    this.screenAspectRatio = screenAspectRatio
    this.sizes = sizes
    this.getBounds()
  }
}
