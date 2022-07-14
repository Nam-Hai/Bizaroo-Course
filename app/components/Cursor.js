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

    this.activeHover = false
    this.active = false

  }

  updateState(isPicked, isHovered) {
    if (isHovered !== undefined) {
      this.activeHover = isHovered
    }
    console.log(this.activeHover, this.active);
    if ((this.activeHover || isPicked) === this.active) return
    this.active = (isPicked || this.activeHover)
    if (this.active) {
      document.body.style.cursor = 'pointer'
      this.element.classList.add('cursor-active')
    }
    else {
      this.element.classList.remove('cursor-active')
      document.body.style.cursor = 'auto'
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
