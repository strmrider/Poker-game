import { EventEmitter } from "@angular/core";

export class Timer {
  private _time: number = 0;
  private _timerEvent = new EventEmitter();
  private run: boolean = false;

  constructor() {}

  get time() {
    return this._time;
  }

  get timeUpEmitter() {
    return this._timerEvent;
  }

  start(initialTime: number) {
    this._time = initialTime;
    this.run = true;
    this.timer();
  }

  private timer() {
    if (this._time > 0 && this.run) {
      this._time -= 1;
      setTimeout(
        function() {
          this.timer();
        }.bind(this),
        1000
      );
    } else {
      this._timerEvent.emit();
    }
  }

  stop() {
    this.run = false;
  }
}
