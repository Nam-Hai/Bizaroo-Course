import Page from "classes/Page";
import { N } from "../../utils/namhai";

export default class About extends Page {
  constructor() {
    super({
      id: "about",
      element: ".about",
      elements: {
        wrapper: '.about__wrapper',
        navigation: N.Select.el(".navigation"),
        title: '.about__title',
        updatables: {
          leftText: '[data-animation="text--left"]',
          rightText: '[data-animation="text--right"]'
        }
      },

    })
  }
}
