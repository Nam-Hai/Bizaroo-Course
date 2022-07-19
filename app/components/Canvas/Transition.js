import anime from 'animejs'
import { Mesh, Plane, Program, Texture, Vec2 } from 'ogl'
import fragment from '../../shaders/plane-fragment.glsl'
import vertex from '../../shaders/plane-vertex.glsl'
import { N } from '../../utils/namhai'

export default class {
  constructor({ fromRoute, toRoute, gl, scene, sizes, screenAspectRatio, image, scale, position, rotation, opacity }) {
    this.opacity = opacity
    console.log('opcaity', this.opacity);
    this.route = { from: fromRoute, to: toRoute }
    this.screenAspectRatio = screenAspectRatio
    this.scale = scale
    this.position = position
    this.rotation = rotation
    this.element = image
    this.sizes = sizes
    this.gl = gl
    this.geometry = new Plane(this.gl)
    this.scene = scene
  }

  async initMesh() {
    await this.createTexture()
    this.createProgram()
    this.createMesh()

    this.init()
  }

  async createTexture() {
    await new Promise(s => {
      this.texture = new Texture(this.gl)
      this.image = new window.Image();
      this.image.crossOrigin = 'anonymous'
      this.image.onload = () => {
        this.texture.image = this.image
        s()
      }
      this.image.src = this.element.src
    })
    //

  }

  createProgram() {
    this.program = new Program(this.gl, {
      depthFunc: this.gl.ALWAYS,
      // transparent: true,
      fragment,
      vertex,
      uniforms: {
        tMap: {
          value: this.texture
        },
        uAlpha: {
          value: this.opacity
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

  init() {
    this.mesh.scale.x = this.scale.x
    this.mesh.scale.y = this.scale.y
    this.mesh.position.x = this.position.x
    this.mesh.position.y = this.position.y
    this.mesh.rotation.z = this.rotation.z
    if (this.opacity === 1) {
      console.log('object');
      this.program.uniforms.uAlpha.value = 1
      return
    }
    anime({
      targets: this.program.uniforms.uAlpha,
      value: [this.opacity, 1],
      duration: 700,
      easing: 'linear'
    })
    // this.program.uniforms.uAlpha.value = 1
    console.log('TRANSITION EMIT');
  }
  startTransition() {
    if (this.route.to == 'detail') {
      const target = N.get('.detail__media img'),
        bounds = target.getBoundingClientRect()
      const heightRatio = this.sizes.height / this.screenAspectRatio.height,
        widthRatio = this.sizes.width / this.screenAspectRatio.width


      const newScaleX = bounds.width * widthRatio,
        newScaleY = bounds.height * heightRatio,
        newX = (bounds.x + (bounds.width / 2)) * widthRatio - (this.sizes.width / 2),
        newY = -(bounds.y + bounds.height / 2) * heightRatio + (this.sizes.height / 2),
        newRot = 0


      let pos = {
        scaleX: this.mesh.scale.x,
        scaleY: this.mesh.scale.y,
        x: this.mesh.position.x,
        y: this.mesh.position.y,
        rotZ: this.mesh.rotation.z
      }
      anime({
        targets: pos,
        scaleX: [pos.scaleX, newScaleX],
        scaleY: [pos.scaleY, newScaleY],
        x: [pos.x, newX],
        y: [pos.y, newY],
        rotZ: [pos.rotZ, newRot],
        duration: 1200,
        easing: 'easeInOutQuart',
        update: () => {
          this.mesh.position.x = pos.x
          this.mesh.position.y = pos.y
          this.mesh.scale.x = pos.scaleX
          this.mesh.scale.y = pos.scaleY
          this.mesh.rotation.z = pos.rotZ
        }
      })
    }
  }

  hide() {
    this.program.uniforms.uAlpha.value = 0
  }
}
