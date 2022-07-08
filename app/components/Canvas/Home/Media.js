import vertex from '../../../shaders/plane-vertex.glsl'
import fragment from '../../../shaders/plane-fragment.glsl'
import { Mesh, Program, Texture, Vec2 } from 'ogl'
import { N } from '../../../utils/namhai'
import { galeryRotationBound } from '../../../utils/constant';

export default class {
  constructor({ element, gl, geometry, scene, index, sizes, screenAspectRatio }) {
    this.screenAspectRatio = screenAspectRatio
    this.sizes = sizes
    this.gl = gl
    this.geometry = geometry
    this.element = element
    this.scene = scene
    this.index = index
    this.extra = {
      width: 0,
      height: 0,
      xCounter: 0,
      yCounter: 0
    }
    this.position = {
      x: 0,
      y: 0
    }
    this.pos = {
      x: 0,
      y: 0
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
        uResolution: resolution,
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

    this.mesh.rotation.z = N.Rand.range(-galeryRotationBound, galeryRotationBound)
  }

  getBounds() {
    this.bounds = this.element.getBoundingClientRect();
    this.updateScale()
    this.updateX({ x: this.pos.x })
    this.updateY({ y: this.pos.y })
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

  updateX({ dT, x = 0 }) {
    // (0,0) of the screen
    this.position.x = -this.sizes.width / 2 + this.mesh.scale.x / 2
    // the actual x value + conversion pixel en [-1, 1]
    this.position.x += ((this.bounds.left + x) / this.screenAspectRatio.width) * this.sizes.width + this.extra.xCounter * this.extra.width

    this.pos.x = x
  }

  updateY({ dT, y = 0 }) {
    this.position.y = this.sizes.height / 2 - this.mesh.scale.y / 2


    this.position.y -= ((this.bounds.top + y) / this.screenAspectRatio.height) * this.sizes.height + this.extra.yCounter * this.extra.height

    this.pos.y = y
  }

  // pas ouf l'effet car les images sont des plan et donc les bord ne colle pas le "globe"
  updateGlob() {
    // console.log('x', this.mesh.position.x);
    const R = this.depth
    // const newHeight = R * (Math.PI / 3) * this.screenAspectRatio.height / this.screenAspectRatio.width
    const newHeight = Math.PI / 4,
      newWidth = newHeight * this.screenAspectRatio.width / this.screenAspectRatio.height
    const newX = N.map(this.position.x, - this.sizes.width / 2, this.sizes.width / 2, -newWidth / 2, newWidth / 2)
    const newY = N.map(this.position.y, - this.sizes.height / 2, this.sizes.height / 2, -newHeight / 2, newHeight / 2)
    this.position.x = R * Math.sin(newX)
    this.position.y = R * Math.sin(newY)
    this.mesh.rotation.y = - newX
    this.mesh.rotation.x = newY
    this.mesh.position.z = R - R * (Math.cos(newY) / 2 + Math.cos(newX) / 2)
  }

  update(dT, scroll) {
    if (!this.bounds) return
    this.updateX({ dT, x: scroll.pixelX })
    this.updateY({ dT, y: scroll.pixelY })
    // this.updateGlob()
    this.mesh.position.x = this.position.x
    this.mesh.position.y = this.position.y
  }

  onResize({ sizes, screenAspectRatio, galleryDimension, depth }) {
    this.depth = depth
    this.screenAspectRatio = screenAspectRatio
    this.sizes = sizes
    this.extra.width = galleryDimension.width
    this.extra.height = galleryDimension.height
    this.getBounds()
  }
}
