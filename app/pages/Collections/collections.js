import Page from "classes/Page";
import { N } from "../../utils/namhai";

export default class Collections extends Page {
  constructor() {
    super({
      id: "collections",
      element: ".collections",
    });
  }

  onResize() {
    super.onResize()
    // this.scrollLimit = this.elements.wrapper.clientHeight - window.innerHeight
    const bounds = N.get('.collections__gallery__wrapper').getBoundingClientRect()
    this.scrollLimit = bounds.width
  }
}
