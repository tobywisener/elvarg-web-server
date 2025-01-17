import { Task } from "../Task";

export class CountdownTask extends Task {
  onTick: () => void;
  onComplete: () => void;

  constructor(key: any, ticks: number, onComplete: () => void) {
      super(ticks, key);
      this.onComplete = onComplete;
  }

  onTicks() {
      if (this.onTick) {
          this.onTick();
      }
  }

  execute() {
      if (this.onComplete) {
          this.onComplete();
      }

      // Countdown task only runs once
      this.stop();
  }
}



