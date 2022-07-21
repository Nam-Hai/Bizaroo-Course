export default class Clock {
  constructor(autoStart = true) {
    this.autoStart = autoStart;

    this.startTime = 0;
    this.oldTime = 0;

    this.elaspedTime = 0;

    this.running = false;
    if (this.autoStart && !this.running) this.start()
  }

  start() {
    this.startTime = performance.now();

    this.oldTime = this.startTime;
    this.elaspedTime = 0;
    this.running = true;
  }

  stop() {

    this.getElaspedTime();
    this.running = false;
    this.autoStart = false;
  }

  getElaspedTime() {
    this.getDelta();
    return this.elaspedTime;
  }

  getDelta() {
    let diff = 0;
    if (this.running) {
      const newTime = performance.now();
      diff = (newTime - this.oldTime) / 1000;
      this.oldTime = newTime;
      this.elaspedTime += diff
    }
    return diff
  }
}
