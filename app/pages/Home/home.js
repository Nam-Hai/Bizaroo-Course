import Page from "classes/Page";
import Button from "../../classes/Button";
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

    this.link = new Button({
      element: this.elements.link
    })
  }

  destroy() {
    super.destroy()
    this.link.removeEventListener()
  }

}
