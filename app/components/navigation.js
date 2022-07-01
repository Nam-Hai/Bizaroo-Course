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
        'collections': 1,
        'about': 0
      },
      hide: {
        'collections': 0,
        'about': 1
      }
    }

    this.onChange(template)
  }


  onChange(template) {
    console.log('template', template, this.elements.items);
    this.element.style.color = template == 'about' ? COLOR_BRIGHT_GREY : COLOR_QUARTER_WHITE;
    this.elements.items[this.navMap.hide[template]].style.visibility = 'hidden'
    this.elements.items[this.navMap.show[template]].style.visibility = 'visible'
  }
}
