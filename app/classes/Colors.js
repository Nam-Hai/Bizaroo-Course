import anime from "animejs"

class Colors {
  constructor() {

  }

  change({
    backgroundColor,
    color
  }) {
    anime({
      targets: document.documentElement,
      color,
      backgroundColor,
      duration: 1500,
      easing: 'linear'
    })
  }
}

export const ColorsManager = new Colors()
