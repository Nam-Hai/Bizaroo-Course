import { Camera, Renderer, Transform, Box, Program, Mesh } from 'ogl';

import Home from './HomeCanvas'

export default class Canvas {
  constructor() {
    this.createRenderer()
    this.createCamera()
    this.createScene()

    this.onResize()
    this.createHome()

    this.screenAspectRatio = {
      width: window.innerWidth,
      height: window.innerHeight
    }
  }

  createRenderer() {
    this.renderer = new Renderer()

    this.gl = this.renderer.gl

    document.body.appendChild(this.gl.canvas)
  }

  createCamera() {
    this.camera = new Camera(this.gl)
    this.camera.position.z = 5;

  }

  createScene() {
    this.scene = new Transform();
  }

  createHome() {
    this.home = new Home({
      gl: this.gl,
      scene: this.scene,
      sizes: this.sizes,
      screenAspectRatio: this.screenAspectRatio
    })
  }

  onResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight)

    this.screenAspectRatio = {
      width: window.innerWidth,
      height: window.innerHeight
    }
    this.camera.perspective({
      aspect: this.screenAspectRatio.width / this.screenAspectRatio.height
    })

    const fov = this.camera.fov * (Math.PI / 180);

    // trigonometri pour avoir la hauteur de ce qui est visible a z de distance
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z
    const width = height * this.camera.aspect

    this.sizes = {
      height,
      width
    }

    if (this.home && this.home.onResize) this.home.onResize({ sizes: this.sizes, screenAspectRatio: this.screenAspectRatio })
  }

  update(dT) {
    // this.mesh.rotation.x += 0.7 * dT
    // this.mesh.rotation.y += 1.9 * dT

    this.renderer.render({
      camera: this.camera,
      scene: this.scene
    })
  }
}
