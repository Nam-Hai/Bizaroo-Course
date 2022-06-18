import About from 'pages/About/about';
import Home from 'pages/Home/home.js';
import Collections from 'pages/Collections/collections';
import Detail from 'pages/Detail/detail.js';
import Preloader from 'components/preloader'
import { N } from 'utils/namhai.js'

class App {
  constructor() {
    this.createPreloader()
    this.createContent()
    this.createPages()

    this.addLinkListener(N.get('header'))
  }

  createPreloader() {
    this.preloader = new Preloader()
    this.preloader.once('completed', this.onPreloaded)
  }

  onPreloaded() {
    console.log('preloaderd');
  }

  createContent() {
    this.content = N.Select.el('main')
    this.template = this.content.getAttribute('data-template')
    console.log('template', this.template, this.content);
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

  addLinkListener(context) {
    let links = N.get('a', context)
    console.log('contentlinks', links);
    if (!links) return
    if (!(links instanceof window.NodeList)) links = [links]
    console.log('links', links);
    for (const link of links) {
      console.log(link);
      link.addEventListener('click', (e) => {
        const href = link.href
        N.PD(e)
        this.onChange(href, link)
      })
    }
  }

  async onChange(url, button) {

    N.pe(button, 'none')
    const request = await window.fetch(url)

    if (request.ok) {
      await this.page.hide()
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
      await this.page.show()


    } else {
      console.error('error fetch not found');
    }
    N.pe(button, 'auto')
  }
}

new App()
