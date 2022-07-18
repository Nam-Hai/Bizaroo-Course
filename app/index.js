import About from 'pages/About/about';
import Home from 'pages/Home/home.js';
import Collections from 'pages/Collections/collections';
import Detail from 'pages/Detail/detail.js';
import Preloader from 'components/preloader';
import Clock from 'classes/Clock.js';
import { N, normalizeWheel } from 'utils/namhai.js'
import Navigation from './components/navigation';
import Canvas from './components/Canvas/Canvas';
import { ScrollManager } from './classes/Scroll'
import Cursor from './components/Cursor';

class App {
  constructor() {
    this.createPreloader()

    this.resizeThrottle = false
    this.resizeDelay = 50
    this.clock = new Clock()
    this.scroll = ScrollManager
    this.mousePosition = {
      x: 0,
      y: 0
    }
    this.velocity = {
      x: 0,
      y: 0
    }
  }

  createNavigation() {
    this.navigation = new Navigation(
      { template: this.template }
    )
  }

  createCursor() {
    this.cursor = new Cursor({ element: '.cursor' })
  }

  createPreloader() {
    this.preloader = new Preloader()
    this.preloader.once('completed', this.onPreloaded.bind(this))
  }

  createCanvas() {
    this.canvas = new Canvas({ route: this.template, scroll: this.scroll })

  }

  async onPreloaded() {
    this.createContent();
    this.createCanvas()
    this.createNavigation()
    this.createPages()
    this.createCursor()
    this.update()

    this.addLinkListener(N.get('header'))
    this.addLinkListener(this.content)
    this.addEventListener()

    await this.preloader.hide()
    this.page.createAnimationObserver()
    this.canvas.show()

    this.preloader.destroy()
    // garbage collection
    this.preloader = null
  }

  createContent() {
    this.content = N.Select.el('main')
    this.template = this.content.getAttribute('data-template')
  }


  createPages() {
    this.pages = {
      'home': new Home(),
      'collections': new Collections(),
      'detail': new Detail(),
      'about': new About(),
    }
    this.page = this.pages[this.template]

    this.page.create()
    this.page.createAnimations()
    this.onResize()
    this.page.show()
    this.scroll.slideMode(this.template == 'collections', this.template == 'collections')

  }


  // recuppere tout les link de la page les prevent default et leur donne onChange,
  // c.a.d comportement SPA JSON fetch + pointer-event none pendant l'animation sur tout les liens
  addLinkListener(context) {
    let links = N.get('a', context)
    if (!links) return
    if (!(links instanceof window.NodeList)) links = [links]
    for (const link of links) {
      link.addEventListener('mouseenter', (e) => {
        this.cursor.updateState(false, true)
      })
      link.addEventListener('mouseleave', _ => {
        this.cursor.updateState(false, false)
      })
      link.addEventListener('click', (e) => {
        const href = link.href
        N.PD(e)
        this.onChange({ url: href, button: link })
      })
    }
  }

  onResize() {
    if (this.page && this.page.onResize) {
      this.page.onResize()
      if (this.template != 'home') this.scroll.setLimit(this.page.scrollLimit)
    }
    if (this.canvas && this.canvas.onResize) this.canvas.onResize()
  }

  async onChange({ url, button, push = true }) {

    if (button) N.pe(button, 'none')
    const request = await window.fetch(url)

    if (request.ok) {
      const html = await request['text']()
      // SPA IMPLEMENTATION
      const div = N.Cr('div')
      div.innerHTML = html
      const divContent = N.get('main', div)
      this.template = divContent.getAttribute('data-template')


      this.canvas.onTransition(this.template)
      this.canvas.hide()
      await this.page.hide()


      this.content.setAttribute('data-template', this.template)
      this.content.innerHTML = divContent.innerHTML


      this.navigation.onChange(this.template)
      this.page = this.pages[this.template]
      this.page.create()
      this.page.createAnimations()
      this.page.createAnimationObserver()
      this.scroll.resetScroll()
      this.scroll.slideMode(this.template == 'collections', this.template == 'collections')
      this.canvas.onChange(this.template)
      if (this.canvas.transition) this.canvas.transition.startTransition()

      await this.page.createLoader()
      this.addLinkListener(this.content)
      if (push) window.history.pushState(this.template, 'Floema - ' + this.template, url)


    } else {
      console.error('error fetch not found');

      // faire une 404
    }
    await this.page.show()
    this.onResize()
    this.canvas.show()
    this.cursor.updateState(false, false)
    if (button) N.pe(button, 'auto')
  }

  onMouseDown(event) {

    if (this.template == 'collections') this.canvas.onMouseDown(event)
    this.onTouchDown(event)
  }
  onMouseMove(event) {
    this.onTouchMove(event)
    this.cursorCoord(event)
  }
  onMouseUp(event) {

    if (this.template == 'collections') this.canvas.onMouseUp(event)
    this.onTouchUp(event)
  }
  cursorCoord(event) {
    this.mousePosition = {
      x: event.x * this.canvas.gl.canvas.width / this.canvas.gl.canvas.clientWidth,
      y: event.y * this.canvas.gl.canvas.height / this.canvas.gl.canvas.clientHeight
    }

    if (this.template == 'collections') this.canvas.onMouseMove(event)
    this.cursor.updateState(!!this.canvas.pickedFound, undefined)
  }
  onTouchDown(event) {
    if (this.canvas && this.canvas.onTouchDown) this.canvas.onTouchDown(event)
    if (this.template == 'about') return
    this.scroll.onTouchDown(event)
  }

  onTouchMove(event) {
    if (this.canvas && this.canvas.onTouchMove) this.canvas.onTouchMove(event)
    if (this.template == 'about') return
    this.scroll.onTouchMove(event)
  }

  onTouchUp(event) {
    if (this.canvas && this.canvas.onTouchUp) this.canvas.onTouchUp(event)
    if (this.template == 'about') return
    this.scroll.onTouchUp(event)
  }


  onPopState() {
    this.onChange({
      url: window.location.pathname,
      push: false,
    })
  }

  onWheel(event) {
    const normalizeWheelValue = normalizeWheel(event)

    this.scroll.onWheel(normalizeWheelValue)

    // if (this.page && this.page.onWheel) this.page.onWheel({ pixelY: this.scroll.y.current })

  }

  addEventListener() {
    window.addEventListener('wheel', this.onWheel.bind(this))

    window.addEventListener('mousedown', this.onMouseDown.bind(this))
    window.addEventListener('mousemove', this.onMouseMove.bind(this))
    window.addEventListener('mouseup', this.onMouseUp.bind(this))

    window.addEventListener('touchstart', this.onTouchDown.bind(this))
    window.addEventListener('touchmove', this.onTouchMove.bind(this))
    window.addEventListener('touchend', this.onTouchUp.bind(this))

    window.addEventListener('popstate', this.onPopState.bind(this))
    window.addEventListener('resize', () => {
      if (!this.resizeThrottle) {
        this.resizeThrottle = true
        this.onResize.bind(this)()
        setTimeout(() => {
          // this.resizeThrottle.bind(this);
          this.resizeThrottle = false
        }, this.resizeDelay)
      }
    })
  }


  update() {
    const deltaT = this.clock.getDelta()

    this.scroll.update(deltaT)
    this.cursor.update(deltaT, { position: this.mousePosition })

    if (this.canvas && this.canvas.update) {
      let xVelo, yVelo;
      if (this.template === 'home') {
        xVelo = N.map(Math.abs(this.scroll.x.target - this.scroll.x.current), 0, 300, 0, 2)
        yVelo = N.map(Math.abs(this.scroll.y.target - this.scroll.y.current), 0, 300, 0, 2)
        this.velocity.x = N.Lerp(this.velocity.x, xVelo, 0.1)
        this.velocity.y = N.Lerp(this.velocity.y, yVelo, 0.1)
      }
      this.canvas.update(deltaT, { pixelX: this.scroll.x.current, pixelY: this.scroll.y.current, direction: this.scroll.direction, velocity: xVelo !== undefined ? this.velocity : undefined })
    }

    if (this.page && this.page.update) {
      this.page.update(deltaT, this.scroll.y.current)
    }
    window.requestAnimationFrame(this.update.bind(this))
  }
}

new App()
