import Page from "classes/Page";
import Galery from "../../animations/galery";
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
          galery: '.about__gallery__wrapper',
          leftText: '[data-animation="text--left"]'
        }
      },

    })
  }
}
