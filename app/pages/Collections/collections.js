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
    const bounds = N.get('.collections__gallery__wrapper').getBoundingClientRect()
    const childBounds = N.Select.el('.collections__gallery__media').getBoundingClientRect()
    this.scrollLimit = bounds.width - childBounds.width
  }
}
