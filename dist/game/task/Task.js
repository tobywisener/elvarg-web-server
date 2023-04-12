"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
var Task = exports.Task = /** @class */ (function () {
    function Task(delay, arg2, arg3) {
        this.running = false;
    }
    Task.prototype.bind = function (key) {
        this.key = key;
    };
    Task.prototype.isImmediate = function () {
        return this.immediate;
    };
    Task.prototype.isRunning = function () {
        return this.running;
    };
    Task.prototype.isStopped = function () {
        return !this.running;
    };
    Task.prototype.tick = function () {
        if (this.running && (this.countdown == 0 || --this.countdown == 0)) {
            this.execute();
            this.countdown = this.delay;
        }
        this.onTick();
        return this.running;
    };
    Task.prototype.onTick = function () { };
    Task.prototype.getDelay = function () {
        return this.delay;
    };
    Task.prototype.getRemainingTicks = function () {
        return this.countdown;
    };
    Task.prototype.setDelay = function (delay) {
        if (delay > 0)
            this.delay = delay;
    };
    Task.prototype.setRunning = function (running) {
        this.running = running;
    };
    Task.prototype.stop = function () {
        this.running = false;
    };
    Task.DEFAULT_KEY = new Object();
    return Task;
}());
//# sourceMappingURL=Task.js.map