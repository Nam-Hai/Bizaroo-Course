import { Mesh, Plane, Program, Texture, Vec2 } from 'ogl'
import fragment from '../../shaders/plane-fragment.glsl'
import vertex from '../../shaders/plane-vertex.glsl'

export default class {
  constructor({ fromRoute, toRoute, gl, scene, sizes, screenAspectRatio, image, scale, position, rotation }) {
    // this.t = 0
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
    this.createTexture()
    this.createProgram()
    this.createMesh()

    // this.getBounds()
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

    console.log('create Mesh', this.mesh);
  }

  init() {
    this.mesh.scale.x = this.scale.x
    this.mesh.scale.y = this.scale.y
    this.mesh.position.x = this.position.x
    this.mesh.position.y = this.position.y
    this.mesh.rotation.z = this.rotation.z
  }

  updateScale() {
    // la nouvelle taille l'image

    this.width = this.bounds.width / this.screenAspectRatio.width
    this.height = this.bounds.height / this.screenAspectRatio.height

    this.mesh.scale.x = this.sizes.width * this.width
    this.mesh.scale.y = this.sizes.height * this.height
  }
}
