import { N } from "../utils/namhai"

class Scroll {
  constructor() {
    this.slideInversion = false
    this.xMode = 'x'
    this.yMode = 'y'
    this.touchDown = false
    this.x = {
      current: 0,
      target: 0,
      lerp: 0.1,
      touch: {
        start: 0,
        distance: 0,
        end: 0,
      }
    }
    this.y = {
      current: 0,
      target: 0,
      lerp: 0.1,
      touch: {
        start: 0,
        distance: 0,
        end: 0,
      }
    }

    this.direction = {
      xAxis: null,
      yAxis: null
    }

    this.limit = {
      xAxis: 0,
      yAxis: 0
    }
  }

  resetScroll() {
    this.x = {
      current: 0,
      target: 0,
      limit: 0,
      lerp: 0.1,
      touch: {
        currentOnStart: 0,
        start: 0,
        distance: 0,
        end: 0,
      }
    }
    this.y = {
      current: 0,
      target: 0,
      limit: 0,
      lerp: 0.1,
      touch: {
        currentOnStart: 0,
        start: 0,
        distance: 0,
        end: 0,
      }
    }
    this.limit = {
      yAxis: 0,
      xAxis: 0
    }
  }

  setLimit(value) {
    this.limit.yAxis = value ? value : 0
  }


  onTouchDown(event) {
    this.touchDown = true
    this.x.touch.start = event.touches ? event.touches[0].clientX : event.clientX
    this.y.touch.start = event.touches ? event.touches[0].clientY : event.clientY
    this.x.touch.end = event.touches ? event.touches[0].clientX : event.clientX
    this.y.touch.end = event.touches ? event.touches[0].clientY : event.clientY
    this.x.touch.currentOnStart = this[this.xMode].current
    this.y.touch.currentOnStart = this[this.yMode].current
  }

  onTouchMove(event) {
    if (!this.touchDown) return
    this.x.touch.end = event.touches ? event.touches[0].clientX : event.clientX
    this.y.touch.end = event.touches ? event.touches[0].clientY : event.clientY
    const xDistance = (this.x.touch.end - this.x.touch.start) * (this.slideInversion ? -1 : 1),
      yDistance = (this.y.touch.end - this.y.touch.start) * (this.slideInversion ? -1 : 1)

    this[this.xMode].target = this.x.touch.currentOnStart + xDistance
    this[this.yMode].target = this.y.touch.currentOnStart + yDistance
    if (this.limit.yAxis) {
      this[this.yMode].target = N.Clamp(this[this.yMode].target, 0, this.limit.yAxis)
      this[this.xMode].target = N.Clamp(this[this.xMode].target, 0, this.limit.yAxis)
    }
  }

  onTouchUp(event) {
    this.touchDown = false
    this.x.touch.end = event.touches ? event.touches[0].clientX : event.clientX
    this.y.touch.end = event.touches ? event.touches[0].clientY : event.clientY
  }

  onWheel(normalizeWheelValue) {
    this.x.target += normalizeWheelValue.pixelX;
    this.y.target += normalizeWheelValue.pixelY;

    this.y.target = N.Clamp(this.y.target, 0, this.limit.yAxis)
  }

  slideMode(axisInvertion = false, slideInversion = false) {
    // axisInvertion : l'axe des slide est inverser avec le scroll (scroll horizontal mais avec scroll.pixelY)
    this.xMode = axisInvertion ? 'y' : 'x'
    this.yMode = axisInvertion ? 'x' : 'y'

    // le sens dans lequel slide
    this.slideInversion = slideInversion
  }

  update(dt) {
    this.direction.xAxis = this.x.target < this.x.current ? 'right' : this.x.target > this.x.current ? 'left' : null;
    this.direction.yAxis = this.y.target > this.y.current ? 'up' : this.y.target < this.y.current ? 'down' : null;

    this.x.current = N.Lerp(this.x.current, this.x.target, this.x.lerp)
    this.y.current = N.Lerp(this.y.current, this.y.target, this.y.lerp)
    if (Math.abs(this.x.current - this.x.target) < 0.01) {
      this.x.current = this.x.target
    }
    if (Math.abs(this.y.current - this.y.target) < 0.01) {
      this.y.current = this.y.target
    }
  }
}

export const ScrollManager = new Scroll()
