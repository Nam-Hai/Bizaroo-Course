import vertex from '../../../shaders/plane-vertex.glsl'
import fragment from '../../../shaders/plane-fragment-Collections.glsl'

import pickingVertex from '../../../shaders/fameBuffer-vertex.glsl'
import pickingFragment from '../../../shaders/frameBuffer-fragment.glsl'

import { Mat4, Mesh, Program, Texture, Vec2 } from 'ogl'
import { N } from '../../../utils/namhai'
import anime from 'animejs';

const opacityCollectionMediaPassive = 0.4
export default class {
  constructor({ element, gl, geometry, scene, index, sizes, screenAspectRatio, link }) {
    // this.t = 0
    this.screenAspectRatio = screenAspectRatio
    this.sizes = sizes
    this.gl = gl
    this.geometry = geometry
    this.element = element
    this.link = link
    this.scene = scene
    this.index = index
    this.infinitOffset = 0;
    this.isShow = false
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
    this.scroll = 0
    this.createTexture()
    this.createProgram()
    this.createBufferProgram()
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
        uAlpha: {
          value: 0
        },
        tMap: {
          value: this.texture
        }
      }
    })
  }

  createBufferProgram() {
    this.pickingProgram = new Program(this.gl, {
      vertex: pickingVertex,
      fragment: pickingFragment,
      uniforms: {
        u_id: {
          value: [1.0, 1.2, 1, 1],
        },
        u_matrix: {
          value: new Mat4().identity(),
        },
        a_position: {
          value: [0, 0, 0, 0]
        }
      }
    })
  }

  createMesh() {
    this.mesh = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.pickingProgram
    })

    const normalizedId = N.map(this.mesh.id, 0, 255, 0, 1)
    this.pickingProgram.uniforms.u_id.value = [normalizedId, 1, 0, 1]

    this.mesh.setParent(this.scene)
  }

  getBounds() {
    this.bounds = this.element.getBoundingClientRect();
    this.bounds.x = this.bounds.x
    this.updateScale()
    this.mesh.position.x = this.updateX({ x: this.pos.pixelX })
    // this.mesh.position.y = this.updateY({ y: this.pos.pixelY })
    this.createCosWave()
  }

  updateScale() {
    // la nouvelle taille l'image

    this.width = this.bounds.width / this.screenAspectRatio.width
    this.height = this.bounds.height / this.screenAspectRatio.height

    this.mesh.scale.x = this.sizes.width * this.width
    this.mesh.scale.y = this.sizes.height * this.height
  }

  updateX({ dT, scroll = 0 }) {
    this.pos.pixelX = scroll
    this.pos.x = this.pos.pixelX * this.sizes.width / this.screenAspectRatio.width
    let x = -this.sizes.width / 2 + this.mesh.scale.x / 2
    x += ((this.bounds.x + this.pos.pixelX) / this.screenAspectRatio.width) * this.sizes.width
    return x
  }

  updateY({ dT, scroll = 0 }) {

  }

  createCosWave() {
    this.mesh.position.y = Math.cos(this.mesh.position.x * 0.6) * 0.4
    this.mesh.rotation.z = -Math.sin(this.mesh.position.x * 0.6) * 0.2
  }
  update(dT, scroll) {
    this.mesh.program = this.pickingProgram
    this.mesh.onAfterRender(() => this.mesh.program = this.program)
    this.scroll = -scroll
    const x = this.updateX({ dT, scroll: this.scroll })
    // const y = this.updateY({ dT, scroll: this.scroll })

    this.mesh.position.x = x;
    if (!this.isShow) return
    if (x < 0.5 && x > -0.5 && !this.inView) {
      this.inView = true
      anime({
        targets: this.program.uniforms.uAlpha,
        value: [opacityCollectionMediaPassive, 1],
        duration: 500,
        easing: 'linear'
      })
    } else if ((x > 0.5 || x < -0.5) && this.inView) {
      this.inView = false
      anime({
        targets: this.program.uniforms.uAlpha,
        value: opacityCollectionMediaPassive,
        duration: 500,
        easing: 'linear'
      })

    }


    // this.mesh.position.y = y
  }


  onResize({ sizes, screenAspectRatio, galleryDimension }) {
    this.screenAspectRatio = screenAspectRatio
    this.sizes = sizes
    this.extra.width = galleryDimension.width
    this.extra.height = galleryDimension.height
    this.getBounds()
  }

  onPicking({ data, onClick }) {
    if (this.mesh.id !== data[0] || data[1] !== 255) return
    if (onClick) this.link.click()
    return { image: this.image, scale: { x: this.mesh.scale.x, y: this.mesh.scale.y }, position: { x: this.mesh.position.x, y: this.mesh.position.y }, rotation: { z: this.mesh.rotation.z } }
  }

  show() {
    anime({
      targets: this.program.uniforms.uAlpha,
      value: [0, opacityCollectionMediaPassive],
      duration: 700,
      easing: 'linear'
    }).finished.then(() => this.isShow = true)
  }

  hide() {
    // this.program.uniforms.uAlpha = 1
    anime({
      targets: this.program.uniforms.uAlpha,
      value: [opacityCollectionMediaPassive, 0],
      duration: 700,
      easing: 'linear'
    })
  }
}
