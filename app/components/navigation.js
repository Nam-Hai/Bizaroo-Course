import Components from "../classes/components";
import { COLOR_BRIGHT_GREY, COLOR_QUARTER_WHITE } from "../utils/color";

export default class Navigation extends Components {
  constructor({ template }) {
    super({
      element: '.navigation',
      elements: {
        links: '.navigation__list__link',
        items: '.navigation__list__item'
      }
    })

    this.navMap = {
      show: {
        'home': 0,
        'collections': 1,
        'detail': 1,
        'about': 0
      },
      hide: {
        'home': 1,
        'collections': 0,
        'detail': 0,
        'about': 1
      }
    }

    this.onChange(template)
  }


  onChange(template) {
    this.element.style.color = template == 'about' ? COLOR_BRIGHT_GREY : COLOR_QUARTER_WHITE;
    this.elements.items[this.navMap.hide[template]].style.visibility = 'hidden'
    this.elements.items[this.navMap.show[template]].style.visibility = 'visible'
  }
}
