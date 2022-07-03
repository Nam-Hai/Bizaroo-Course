import { Camera, Renderer, Transform, Box, Program, Mesh } from 'ogl';
import About from './About/AboutCanvas';

import Home from './Home/HomeCanvas'



export default class Canvas {
  constructor({ route }) {
    this.route = route
    this.mapRouteObject = {
      home: this.createHome,
      about: this.createAbout
    };
    this.createRenderer()
    this.createCamera()
    this.createScene()

    this.onResize()

    this.onChange(route)

    this.x = {
      start: 0,
      distance: 0,
      end: 0
    }
    this.y = {
      start: 0,
      distance: 0,
      end: 0
    }

    this.screenAspectRatio = {
      width: window.innerWidth,
      height: window.innerHeight
    }
  }

  createRenderer() {
    this.renderer = new Renderer({
      alpha: true,
      // antialias: true
    })

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

  createAbout() {
    this.about = new About({})
  }

  onChange(route) {
    this.route = route
    if (this.home) this.home.destroy()
    if (this.about) this.about.destroy()
    this.home = null
    this.about = null

    if (this.mapRouteObject.hasOwnProperty(route)) {
      const createNewObject = this.mapRouteObject[route].bind(this)
      createNewObject()
    }
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

  onTouchDown(event) {
    this.isDown = true
    this.x.start = event.touches ? event.touches[0].clientX : event.clientX
    this.y.start = event.touches ? event.touches[0].clientY : event.clientY
    this.x.end = event.touches ? event.touches[0].clientX : event.clientX
    this.y.end = event.touches ? event.touches[0].clientY : event.clientY

    if (this.home) this.home.onTouchDown({ x: this.x, y: this.y })
  }

  onTouchMove(event) {
    if (!this.isDown) return
    this.x.end = event.touches ? event.touches[0].clientX : event.clientX
    this.y.end = event.touches ? event.touches[0].clientY : event.clientY

    // this.x.distance = this.x.end - this.x.start
    // this.y.distance = this.y.end - this.y.start

    if (this.home) this.home.onTouchMove({ x: this.x, y: this.y })
  }

  onTouchUp(event) {
    this.isDown = false
    this.x.end = event.touches ? event.touches[0].clientX : event.clientX
    this.y.end = event.touches ? event.touches[0].clientY : event.clientY

    if (this.home) this.home.onTouchUp({ x: this.x, y: this.y })
  }

  onWheel(event) {
    if (this.home) {
      this.home.onWheel(event)
    }
  }

  update(dT) {
    // this.mesh.rotation.x += 0.7 * dT
    // this.mesh.rotation.y += 1.9 * dT

    if (this.home) this.home.update(dT)

    this.renderer.render({
      camera: this.camera,
      scene: this.scene,
    })
  }
}
