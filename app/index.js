import About from 'pages/About/about';
import Home from 'pages/Home/home.js';
import Collections from 'pages/Collections/collections';
import Detail from 'pages/Detail/detail.js';
import Preloader from 'components/preloader'
import { N } from 'utils/namhai.js'

class App {
  constructor() {
    this.createPreloader()

    this.timeStamp;
    this.update()
  }

  createPreloader() {
    this.preloader = new Preloader()
    console.log('preloader');

    this.preloader.once('completed', this.onPreloaded.bind(this))
  }

  async onPreloaded() {
    this.createContent();

    this.createPages()

    this.addLinkListener(N.get('header'))
    this.addLinkListener(this.content)
    this.addEventListener()

    await this.preloader.hide()
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
    this.onResize()
    this.page.show()
  }

  onResize() {
    if (this.page && this.page.onResize) this.page.onResize()
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
        this.onChange(href, link)
      })
    }
  }

  async onChange(url, button) {

    await this.page.hide()
    N.pe(button, 'none')
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

      this.page = this.pages[this.template]
      this.page.create()
      this.addLinkListener(this.content)
      this.onResize()
      window.history.pushState(this.template, '', url)


    } else {
      console.error('error fetch not found');

      // faire une 404
    }
    await this.page.show()
    N.pe(button, 'auto')
  }

  addEventListener() {
    window.addEventListener('resize', this.onResize.bind(this))
  }


  update(t) {
    if (!this.timeStamp) this.timeStamp = t
    const deltaT = (t - this.timeStamp) / (1000 / 60)
    this.timeStamp = t
    if (this.page && this.page.update) {
      this.page.update(deltaT)
    }
    window.requestAnimationFrame(this.update.bind(this))
  }
}

new App()
