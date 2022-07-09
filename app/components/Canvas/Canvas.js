import { Camera, Renderer, Transform, Box, Program, Mesh } from 'ogl';
import About from './About/AboutCanvas';
import Home from './Home/HomeCanvas';
import Collections from './Collections/CollectionCanvas'
import { N } from '../../utils/namhai'


export default class Canvas {
  constructor({ route }) {
    this.route = route
    this.mapRouteObject = {
      home: this.createHome,
      about: this.createAbout,
      collections: this.createCollections
    };
    this.screenAspectRatio = {
      width: window.innerWidth,
      height: window.innerHeight
    }

    this.createRenderer()
    this.createCamera()
    this.createScene()

    this.onResize()
    this.onChange(route)

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
    this.about = new About({
      gl: this.gl,
      scene: this.scene,
      sizes: this.sizes,
      screenAspectRatio: this.screenAspectRatio
    })
  }

  createCollections() {
    this.collections = new Collections({
      gl: this.gl,
      scene: this.scene,
      sizes: this.sizes,
      screenAspectRatio: this.screenAspectRatio
    })
  }

  onChange(route) {
    // destroy canvas before assign this.route, and creating new canvas
    if (this[this.route] && this[this.route].destroy) {
      this[this.route].destroy()
      this[this.route] = null
    }

    this.route = route
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

    // taille du plan dans l'espace 3D
    this.sizes = {
      height,
      width
    }

    if (this[this.route] && this[this.route].onResize) this[this.route].onResize({ sizes: this.sizes, screenAspectRatio: this.screenAspectRatio, depth: this.camera.position.z })
  }

  onTouchDown(event) {
    if (this[this.route] && this[this.route].onTouchDown) this[this.route].onTouchDown(event)
  }

  onTouchMove(event) {
    if (this[this.route] && this[this.route].onTouchMove) this[this.route].onTouchMove(event)
  }

  onTouchUp(event) {
    if (this[this.route] && this[this.route].onTouchUp) this[this.route].onTouchUp(event)
  }

  onWheel({ pixelX, pixelY }) {
  }

  update(dT, scroll) {
    // this.mesh.rotation.x += 0.7 * dT
    // this.mesh.rotation.y += 1.9 * dT

    if (this[this.route]) this[this.route].update(dT, scroll)

    this.renderer.render({
      camera: this.camera,
      scene: this.scene,
    })
  }

  show() {
    if (this[this.route] && this[this.route].show) this[this.route].show()
  }

  hide() {
    if (this[this.route] && this[this.route].hide) this[this.route].hide()
  }
}
