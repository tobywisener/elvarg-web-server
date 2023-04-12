import { Stopwatch } from "../../util/Stopwatch";

export class SecondsTimer {
    private seconds: number;
    private running: boolean;
    private startTime: any;
    private endTime: any;
    private stopwhatch: Stopwatch

    constructor() {
        this.seconds = 0;
        this.running = false;
    }

    start(seconds: number) {
        this.seconds = seconds;

        //Reset and then start the stopwatch.
        this.stopwhatch.reset();
        this.stopwhatch.start();
    }

    stop(): void {
        this.seconds = 0;
        this.endTime = performance.now();
        this.running = false;
    }

    isRunning(): boolean {
        return this.running;
    }

    secondsRemaining(): number {
        if (this.seconds === 0) {
            return 0;
        }
        let remaining = this.seconds - this.secondsElapsed();
        if (remaining < 0) {
            remaining = 0;
        }
        return remaining;
    }

    finished(): boolean {
        if (this.secondsRemaining() === 0) {
            this.stop();
            return true;
        }
        return false;
    }

    secondsElapsed(): number {
        return this.endTime - this.startTime;
    }

    toString(): string {
        let builder = "";

        let secondsRemaining = this.secondsRemaining();
        let minutesRemaining = Math.floor(secondsRemaining / 60);
        secondsRemaining -= minutesRemaining * 60;

        if (minutesRemaining > 0) {
            builder += `${minutesRemaining} ${minutesRemaining > 1 ? "minutes" : "minute"} and `;
        }

        builder += `${secondsRemaining} seconds`;

        return builder;
    }

}    