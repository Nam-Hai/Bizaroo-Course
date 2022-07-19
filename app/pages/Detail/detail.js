import anime from "animejs";
import Page from "classes/Page";
import Button from "../../classes/Button";
import { N } from "../../utils/namhai";

export default class Detail extends Page {
  constructor() {
    super({
      id: "detail",
      element: ".detail",
      elements: {
        button: '.detail__button',
        media: '.detail__media'
      }
    })
  }

  create() {
    super.create();

    this.link = new Button({
      element: this.elements.button
    })
  }

  destroy() {
    super.destroy()
    this.link.removeEventListener()
  }
  show() {
    super.show()
  }

  afterTransition() {
    anime({
      targets: this.elements.media,
      opacity: [0, 1],
      duration: 700,
      easing: 'linear'
    })
  }
}
