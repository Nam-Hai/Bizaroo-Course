import { N } from "../utils/namhai"

class Scroll {
  constructor() {
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
  }

  resetScroll() {
    this.x = {
      current: 0,
      target: 0,
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
      lerp: 0.1,
      touch: {
        currentOnStart: 0,
        start: 0,
        distance: 0,
        end: 0,
      }
    }
  }

  onTouchDown(event) {
    this.touchDown = true
    this.x.touch.start = event.touches ? event.touches[0].clientX : event.clientX
    this.y.touch.start = event.touches ? event.touches[0].clientY : event.clientY
    this.x.touch.end = event.touches ? event.touches[0].clientX : event.clientX
    this.y.touch.end = event.touches ? event.touches[0].clientY : event.clientY
    this.x.touch.currentOnStart = this.x.current
    this.y.touch.currentOnStart = this.y.current
  }

  onTouchMove(event) {
    if (!this.touchDown) return
    this.x.touch.end = event.touches ? event.touches[0].clientX : event.clientX
    this.y.touch.end = event.touches ? event.touches[0].clientY : event.clientY
    const xDistance = this.x.touch.end - this.x.touch.start,
      yDistance = this.y.touch.end - this.y.touch.start
    this.x.target = this.x.touch.currentOnStart + xDistance
    this.y.target = this.y.touch.currentOnStart + yDistance
  }

  onTouchUp(event) {
    this.touchDown = false
    this.x.touch.end = event.touches ? event.touches[0].clientX : event.clientX
    this.y.touch.end = event.touches ? event.touches[0].clientY : event.clientY
  }

  onWheel(normalizeWheelValue) {
    this.x.target += normalizeWheelValue.pixelX;
    this.y.target += normalizeWheelValue.pixelY;
  }

  update(dt) {
    this.direction.xAxis = this.x.target < this.x.current ? 'right' : this.x.target > this.x.current ? 'left' : null;
    this.direction.yAxis = this.y.target > this.y.current ? 'up' : this.y.target < this.y.current ? 'down' : null;
    // console.log('direction', this.direction.xAxis, this.direction.yAxis);

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
