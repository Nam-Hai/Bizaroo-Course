import About from 'pages/About/about';
import Home from 'pages/Home/home.js';
import Collections from 'pages/Collections/collections';
import Detail from 'pages/Detail/detail.js';
import N from 'utils/namhai.js'

class App {
  constructor() {
    this.createContent()
    this.createPages()
  }

  createContent() {
    this.content = document.querySelector('main')
    this.template = this.content.getAttribute('data-template')
    console.log('template', this.template);
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

  addLinkListener() {
    const links = N.get(a)
    links.map(link => {
      link.onclick = e => {
        N.PD(e);
        console.log(e);
      }
    })
  }
}

new App()
