import Page from "classes/Page";
import { N } from "../../utils/namhai";

export default class Home extends Page {
  constructor() {
    super({
      id: "home",
      element: '.home',
      elements: {
        navigation: N.Select.el('.navigation'),
        link: '.home__link'
      }
    })
  }

  create() {
    super.create();

    this.elements.link.addEventListener('click', (e) => {
      // N.PD(e)
      // this.hide()
    })
  }

}
