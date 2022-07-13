import { Camera, Renderer, Transform, Box, Program, Mesh, RenderTarget } from 'ogl';
import About from './About/AboutCanvas';
import Home from './Home/HomeCanvas';
import Collections from './Collections/CollectionCanvas'
import { N } from '../../utils/namhai'
import pickingVertex from '../../shaders/fameBuffer-vertex.glsl'
import pickingFragment from '../../shaders/frameBuffer-fragment.glsl'

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
    // this.renderBuffer = new RenderTarget(this.gl)
    // this.renderBuffer.setSize(window.innerWidth, window.innerHeight)
    // this.pickingProgram = new Program(this.gl,
    // {
    //   vertex: pickingVertex,
    //   fragment: pickingFragment,
    // })

    this.collections = new Collections({
      gl: this.gl,
      scene: this.scene,
      sizes: this.sizes,
      screenAspectRatio: this.screenAspectRatio
    })

  }

  onChange(route) {
    this.renderBuffer = null
    // destroy canvas before assign this.route, and creating new canvas
    if (this[this.route] && this[this.route].destroy) {
      this[this.route].destroy()
      this[this.route] = null
    }

    this.gl.canvas.style.zIndex = route === 'collections' ? 1 : 0
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

    if (this.clickTrigger) {
      let data = new Uint8Array(4);
      this.gl.readPixels(
        this.pixelX,            // x
        this.pixelY,            // y
        1,
        1,
        this.gl.RGBA,           // format
        this.gl.UNSIGNED_BYTE,  // type
        data);             // typed array to hold result
      const id = data[0] + (data[1] << 8) + (data[2] << 16) + (data[3] << 2)
      console.log(id, data);
      this.clickTrigger = false
    }

    this.renderer.render({
      camera: this.camera,
      scene: this.scene,
    })
  }

  onCLick(e) {
    this.pixelX = e.x * this.gl.canvas.width / this.gl.canvas.clientWidth;
    this.pixelY = this.gl.canvas.height - e.y * this.gl.canvas.height / this.gl.canvas.clientHeight - 1;

    this.clickTrigger = true
  }

  addEventListener() {
    this.gl.canvas.addEventListener('mousemove', (e) => {
      this.pixelX = e.clientX * this.gl.canvas.width / this.gl.canvas.clientWidth;
      this.pixelY = this.gl.canvas.height - e.clientY * this.gl.canvas.height / this.gl.canvas.clientHeight - 1;
    });

    this.gl.canvas.addEventListener('click', this.onCLick.bind(this))
  }
  show() {
    if (this[this.route] && this[this.route].show) this[this.route].show()
  }

  hide() {
    if (this[this.route] && this[this.route].hide) this[this.route].hide()
  }
}
