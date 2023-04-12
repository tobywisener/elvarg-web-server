"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecondsTimer = void 0;
var SecondsTimer = /** @class */ (function () {
    function SecondsTimer() {
        this.seconds = 0;
        this.running = false;
    }
    SecondsTimer.prototype.start = function (seconds) {
        this.seconds = seconds;
        //Reset and then start the stopwatch.
        this.stopwhatch.reset();
        this.stopwhatch.start();
    };
    SecondsTimer.prototype.stop = function () {
        this.seconds = 0;
        this.endTime = performance.now();
        this.running = false;
    };
    SecondsTimer.prototype.isRunning = function () {
        return this.running;
    };
    SecondsTimer.prototype.secondsRemaining = function () {
        if (this.seconds === 0) {
            return 0;
        }
        var remaining = this.seconds - this.secondsElapsed();
        if (remaining < 0) {
            remaining = 0;
        }
        return remaining;
    };
    SecondsTimer.prototype.finished = function () {
        if (this.secondsRemaining() === 0) {
            this.stop();
            return true;
        }
        return false;
    };
    SecondsTimer.prototype.secondsElapsed = function () {
        return this.endTime - this.startTime;
    };
    SecondsTimer.prototype.toString = function () {
        var builder = "";
        var secondsRemaining = this.secondsRemaining();
        var minutesRemaining = Math.floor(secondsRemaining / 60);
        secondsRemaining -= minutesRemaining * 60;
        if (minutesRemaining > 0) {
            builder += "".concat(minutesRemaining, " ").concat(minutesRemaining > 1 ? "minutes" : "minute", " and ");
        }
        builder += "".concat(secondsRemaining, " seconds");
        return builder;
    };
    return SecondsTimer;
}());
exports.SecondsTimer = SecondsTimer;
//# sourceMappingURL=SecondsTimer.js.map