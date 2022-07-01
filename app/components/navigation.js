import Components from "../classes/components";

export default class Navigation extends Components {
  constructor({ template }) {
    super({
      element: '.navigation',
      elements: {
        links: '.navigation__list__link',
        items: '.navigation__list__item'
      }
    })

    this.onChange(template)
  }


  onChange(template) {
    console.log('template', template);
  }
}
