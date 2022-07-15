import anime from 'animejs'
import { Mesh, Plane, Program, Texture, Vec2 } from 'ogl'
import fragment from '../../shaders/plane-fragment.glsl'
import vertex from '../../shaders/plane-vertex.glsl'
import { N } from '../../utils/namhai'

export default class {
  constructor({ fromRoute, toRoute, gl, scene, sizes, screenAspectRatio, image, scale, position, rotation }) {
    // this.t = 0
    this.route = { from: fromRoute, to: toRoute }
    console.log('this.route', this.route);
    this.screenAspectRatio = screenAspectRatio
    this.scale = scale
    this.position = position
    this.rotation = rotation
    this.element = image
    console.log('IMAGE TRANSITION', this.element)
    this.sizes = sizes
    this.gl = gl
    this.geometry = new Plane(this.gl)
    this.scene = scene
    this.createTexture()
    this.createProgram()
    this.createMesh()

    this.init()
  }

  createTexture() {
    this.texture = new Texture(this.gl)

    this.image = new window.Image();
    this.image.crossOrigin = 'anonymous'
    this.image.onload = () => {
      this.texture.image = this.image
      console.log(this.texture, 'LOADED');
    }
    this.image.src = this.element.src

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

  init() {
    this.mesh.scale.x = this.scale.x
    this.mesh.scale.y = this.scale.y
    this.mesh.position.x = this.position.x
    this.mesh.position.y = this.position.y
    this.mesh.rotation.z = this.rotation.z
  }
  startTransition() {
    if (this.route.to == 'detail') {
      const target = N.get('.detail__media'),
        bounds = target.getBoundingClientRect()
      console.log(this.mesh.scale);
      const heightRatio = this.sizes.height / this.screenAspectRatio.height,
        widthRatio = this.sizes.width / this.screenAspectRatio.width


      const newScaleX = bounds.width * widthRatio,
        newScaleY = bounds.height * heightRatio,
        newX = bounds.x * widthRatio - this.sizes.width / 2 + this.mesh.scale.x / 2,
        newY = -(bounds.y * heightRatio) + this.sizes.height / 2 - this.mesh.scale.y / 2
      anime({
        targets: this.mesh.scale,
        x: [this.scale.x, newScaleX],
        duration: 700,
        easing: 'linear'
      })
      anime({
        targets: this.mesh.position,
        x: [this.position.x, newX],
        duration: 700,
        easing: 'linear'
      })
    }
  }

  hide() {
    this.program.uniforms.uAlpha.value = 0
  }
}
