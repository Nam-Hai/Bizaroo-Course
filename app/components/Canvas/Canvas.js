import { Camera, Renderer, Transform } from 'ogl';
import About from './About/AboutCanvas';
import Home from './Home/HomeCanvas';
import Collections from './Collections/CollectionCanvas'
import Transition from './Transition'

export default class Canvas {
  constructor({ route, scroll }) {
    this.scroll = scroll
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

    this.addEventListener()
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

  async onTransition(route) {
    if (this.transition && this.transition.mesh) {
      this.scene.removeChild(this.transition.mesh)
    }
    this.transition = null
    this.isFromCollectionsToDetail = this.route == 'collections' && route == 'detail'
    this.isFromDetailToCollections = this.route == 'detail' && route == 'collections'
    // if (this.isFromCollectionsToDetail || this.isFromDetailToCollections) {
    if (this.isFromCollectionsToDetail) {
      this.transition = new Transition({ fromRoute: this[this.route], toRoute: route, gl: this.gl, scene: this.scene, sizes: this.sizes, screenAspectRatio: this.screenAspectRatio, image: this.pickedFound.image, scale: this.pickedFound.scale, position: this.pickedFound.position, rotation: this.pickedFound.rotation, opacity: this.pickedFound.opacity })
      await this.transition.initMesh()
    }
    return !!this.isFromCollectionsToDetail
  }

  onChange(route) {
    this.clickLaunched = false
    this.pickedFound = false

    // destroy canvas before assign this.route, and creating new canvas
    if (this[this.route] && this[this.route].destroy) {
      this[this.route].destroy()
      this[this.route] = null
    }

    this.gl.canvas.style.zIndex = route === 'collections' ? 1 : -1
    this.route = route
    this.pickedFound = false
    if (this.mapRouteObject.hasOwnProperty(route)) {
      const createNewObject = this.mapRouteObject[route].bind(this)
      createNewObject()
    }
  }

  onPicking() {
    let data = new Uint8Array(4);
    this.gl.readPixels(
      this.pixelX,            // x
      this.pixelY,            // y
      1,
      1,
      this.gl.RGBA,           // format
      this.gl.UNSIGNED_BYTE,  // type
      data);             // typed array to hold result
    if (this[this.route] && this[this.route].onPicking && !this.clickLaunched) {
      this.pickedFound = this[this.route].onPicking({ data: data })
    }
    if (this.clickTrigger && !!this.pickedFound) {
      this.scroll.blockScroll()
      this.clickLaunched = true
      this.pickedFound.link.click()
    }
    this.clickTrigger = false
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

  onMouseDown(e) {
    this.clickAttempt = true
  }

  onMouseMove(e) {
    this.pixelX = e.x * this.gl.canvas.width / this.gl.canvas.clientWidth;
    this.pixelY = this.gl.canvas.height - e.y * this.gl.canvas.height / this.gl.canvas.clientHeight - 1;
    this.clickAttempt = false
  }

  onMouseUp(e) {
    this.pixelX = e.x * this.gl.canvas.width / this.gl.canvas.clientWidth;
    this.pixelY = this.gl.canvas.height - e.y * this.gl.canvas.height / this.gl.canvas.clientHeight - 1;

    this.clickTrigger = this.clickAttempt
    this.clickAttempt = false
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

    // buffer rendering on collections page for picking
    if (this.route == 'collections') {
      this.renderer.render({
        camera: this.camera,
        scene: this.scene,
      })

      // if (this.clickTrigger) {
      this.onPicking()
      // }
    }

    this.renderer.render({
      camera: this.camera,
      scene: this.scene,
    })
  }

  addEventListener() {

    // this.gl.canvas.addEventListener('mousedown', this.onCLick.bind(this))

  }
  show() {
    if (this[this.route] && this[this.route].show) this[this.route].show()
  }

  hide() {
    if (this[this.route] && this[this.route].hide) this[this.route].hide()
  }
}
