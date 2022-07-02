import About from 'pages/About/about';
import Home from 'pages/Home/home.js';
import Collections from 'pages/Collections/collections';
import Detail from 'pages/Detail/detail.js';
import Preloader from 'components/preloader';
import Clock from 'classes/Clock.js';
import { N } from 'utils/namhai.js'
import Navigation from './components/navigation';
import Canvas from './components/Canvas/Canvas';

class App {
  constructor() {
    this.createPreloader()


    this.clock = new Clock()
    this.update()
  }

  createNavigation() {
    this.navigation = new Navigation(
      { template: this.template }
    )
  }

  createPreloader() {
    this.preloader = new Preloader()
    this.preloader.once('completed', this.onPreloaded.bind(this))
  }

  createCanvas() {
    this.canvas = new Canvas()

  }

  async onPreloaded() {
    this.createContent();
    this.createCanvas()
    this.createNavigation()
    this.createPages()

    this.addLinkListener(N.get('header'))
    this.addLinkListener(this.content)
    this.addEventListener()

    await this.preloader.hide()
    this.page.createAnimationObserver()

    this.preloader.destroy()
    // garbage collection
    this.preloader = null
  }

  createContent() {
    this.content = N.Select.el('main')
    this.template = this.content.getAttribute('data-template')
  }


  async createPages() {
    this.pages = {
      'home': new Home(),
      'collections': new Collections(),
      'detail': new Detail(),
      'about': new About(),
    }
    this.page = this.pages[this.template]

    this.page.create()
    this.onResize()

    await this.page.show()
  }

  onResize() {
    if (this.page && this.page.onResize) this.page.onResize()
    if (this.canvas && this.canvas.onResize) this.canvas.onResize()
  }

  // recuppere tout les link de la page les prevent default et leur donne onChange,
  // c.a.d comportement SPA JSON fetch + pointer-event none pendant l'animation sur tout les liens
  addLinkListener(context) {
    let links = N.get('a', context)
    if (!links) return
    if (!(links instanceof window.NodeList)) links = [links]
    for (const link of links) {
      link.addEventListener('click', (e) => {
        const href = link.href
        N.PD(e)
        this.onChange({ url: href, button: link })
      })
    }
  }

  async onChange({ url, button, push = true }) {

    await this.page.hide()
    if (button) N.pe(button, 'none')
    const request = await window.fetch(url)

    if (request.ok) {
      const html = await request['text']()


      // SPA IMPLEMENTATION
      const div = N.Cr('div')
      div.innerHTML = html
      const divContent = N.get('main', div)

      this.template = divContent.getAttribute('data-template')
      this.content.setAttribute('data-template', this.template)
      this.content.innerHTML = divContent.innerHTML


      this.navigation.onChange(this.template)
      this.page = this.pages[this.template]
      this.page.create()
      this.page.createAnimationObserver()

      await this.page.createLoader()

      this.addLinkListener(this.content)
      this.onResize()
      if (push) window.history.pushState(this.template, 'Floema - ' + this.template, url)


    } else {
      console.error('error fetch not found');

      // faire une 404
    }
    await this.page.show()
    if (button) N.pe(button, 'auto')
  }

  onPopState() {
    this.onChange({
      url: window.location.pathname,
      push: false,
    })
  }

  addEventListener() {
    window.addEventListener('popstate', this.onPopState.bind(this))
    window.addEventListener('resize', this.onResize.bind(this))
  }


  update() {
    const deltaT = this.clock.getDelta()

    if (this.canvas && this.canvas.update) {
      this.canvas.update(deltaT)
    }

    if (this.page && this.page.update) {
      this.page.update(deltaT)
    }
    window.requestAnimationFrame(this.update.bind(this))
  }
}

new App()
