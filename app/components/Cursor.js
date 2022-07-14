import Components from "../classes/components";
import { N } from "../utils/namhai";

export default class Cursor extends Components {
  constructor({ element, lerp }) {
    super({
      element: element,
    })

    this.lerp = lerp
    this.pos = {
      x: 0,
      y: 0
    }

  }


  onChange(template) {
  }

  update(dt, { position }) {

    if (Math.abs(this.pos.x - position.x) < 1) this.pos.x = position.x
    else this.pos.x = N.Lerp(this.pos.x, position.x, 0.1)
    if (Math.abs(this.pos.y - position.y) < 1) this.pos.y = position.y
    else this.pos.y = N.Lerp(this.pos.y, position.y, 0.1)
    N.T(this.element, this.pos.x, this.pos.y, 'px')

  }
}
