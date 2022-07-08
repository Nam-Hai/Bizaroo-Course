import vertex from '../../../shaders/plane-vertex.glsl'
import fragment from '../../../shaders/plane-fragment-About.glsl'
import { Mesh, Program, Texture, Vec2 } from 'ogl'
import { N } from '../../../utils/namhai'
import { galeryRotationBound } from '../../../utils/constant';
import anime from 'animejs';

const infinitOffsetSpeed = 2
// const infinitOffsetSpeed = 15

export default class {
  constructor({ element, gl, geometry, scene, index, sizes, screenAspectRatio }) {
    this.screenAspectRatio = screenAspectRatio
    this.sizes = sizes
    this.gl = gl
    this.geometry = geometry
    this.element = element
    this.scene = scene
    this.index = index
    this.infinitOffset = 0;
    this.extra = {
      width: 0,
      height: 0,
      xCounter: 0,
      yCounter: 0
    }
    this.pos = {
      pixelX: 0,
      pixelY: 0,
      x: 0,
      y: 0,
    }
    this.scroll = {
      pixelX: 0,
      pixelY: 0
    }
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
    const resolution = { value: new Vec2() }
    resolution.value.set(this.gl.canvas.width, this.gl.canvas.height)
    this.program = new Program(this.gl, {
      fragment,
      vertex,
      uniforms: {
        uAlpha: {
          value: 0
        },
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
    this.bounds.y = this.bounds.y + this.scroll.pixelY
    this.updateScale()
    this.updateX({ x: this.pos.pixelX })
    this.updateY({ y: this.pos.pixelY })
  }

  updateScale() {
    // la nouvelle taille l'image

    this.width = this.bounds.width / this.screenAspectRatio.width
    this.height = this.bounds.height / this.screenAspectRatio.height

    this.mesh.scale.x = this.sizes.width * this.width
    this.mesh.scale.y = this.sizes.height * this.height
  }

  updateX({ dT, scrollX = 0 }) {
    this.pos.pixelX = scrollX * 0.6 + this.infinitOffset
    this.pos.x = this.pos.pixelX * this.sizes.width / this.screenAspectRatio.width
    // (0,0) of the screen
    let x = -this.sizes.width / 2 + this.mesh.scale.x / 2
    // the actual x value + conversion pixel en [-1, 1]
    x += ((this.bounds.x + this.pos.pixelX) / this.screenAspectRatio.width) * this.sizes.width + this.extra.xCounter * this.extra.width
    return x
  }

  updateY({ dT, scrollY = 0 }) {
    let y = this.sizes.height / 2 - this.mesh.scale.y / 2
    y -= ((this.bounds.y + this.pos.pixelY) / this.screenAspectRatio.height) * this.sizes.height + this.extra.yCounter * this.extra.height
    return y
  }

  updateRotation(theta) {
    return theta - Math.PI / 2
  }
  lineToCircle(x) {
    const theta = x * Math.PI / this.extra.width
    return - theta + Math.PI / 2
  }

  update(dT, scroll, slide) {
    if (!this.bounds) return
    this.infinitOffset += infinitOffsetSpeed
    this.scroll = scroll
    const x = this.updateX({ dT, scrollX: scroll.pixelY + slide }),
      y = this.updateY({})
    const theta = this.lineToCircle(x)
    const R = this.extra.width / Math.PI
    this.offesting(x)
    this.mesh.position.x = R * Math.cos(theta)
    this.mesh.position.y = y + R * Math.sin(theta) - R
    this.mesh.rotation.z = this.updateRotation(theta)
  }

  offesting(x) {
    if (x > this.extra.width / 2) {
      this.extra.xCounter--
    } else if (x < -this.extra.width / 2) {
      this.extra.xCounter++
    }
  }

  onResize({ sizes, screenAspectRatio, galleryDimension }) {
    this.screenAspectRatio = screenAspectRatio
    this.sizes = sizes
    this.extra.width = galleryDimension.width
    this.extra.height = galleryDimension.height
    this.getBounds()
  }

  show() {
    anime({
      targets: this.program.uniforms.uAlpha,
      value: [0, 1],
      duration: 700,
      easing: 'linear'
    })
  }

  hide() {
    // this.program.uniforms.uAlpha = 1
    anime({
      targets: this.program.uniforms.uAlpha,
      value: [1, 0],
      duration: 700,
      easing: 'linear'
    })
  }
}
