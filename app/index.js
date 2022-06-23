import About from 'pages/About/about';
import Home from 'pages/Home/home.js';
import Collections from 'pages/Collections/collections';
import Detail from 'pages/Detail/detail.js';
import Preloader from 'components/preloader'
import { N } from 'utils/namhai.js'

class App {
  constructor() {
    this.createPreloader()

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
    this.page.show()
  }

  // recuppere tout les link de la page les prevent default et leur donne onChange,
  // c.a.d comportement SPA JSON fetch
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
      window.history.pushState(this.template, '', url)


    } else {
      console.error('error fetch not found');

      // faire une 404
    }
    await this.page.show()
    N.pe(button, 'auto')
  }
}

new App()
