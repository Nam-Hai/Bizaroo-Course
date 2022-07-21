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
        media: '.detail__media',
        svg: '.svg path'
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

  async afterTransition() {
    await new Promise(s => {
      anime({
        targets: this.elements.media,
        opacity: [0, 1],
        duration: 700,
        easing: 'linear',
        complete: () => s()
      })
    })
  }

  svgAnimation() {
    anime({
      targets: this.elements.svg,
      d: [{
        value: [
          'M 0 0 L 0 -6 C 3 -6 4 -6 9 -6 C 14 -6 15 -6 18 -6 L 18 0',
          'M 0 0 L 0  0 C 3  0 4 -6 9 -6 C 14 -6 15  0 18  0 L 18 0'
        ]
      }],
      duration: 700,
      easing: 'linear'
    })
  }
}
