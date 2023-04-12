"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimerRepository = void 0;
var Timer_1 = require("../timers/Timer");
var TimerRepository = /** @class */ (function () {
    function TimerRepository() {
        this.timer = new Map();
    }
    TimerRepository.prototype.has = function (key) {
        var timer = this.timer.get(key);
        return timer !== null && timer.ticks() > 0;
    };
    TimerRepository.prototype.register = function (timer) {
        this.timer.set(timer.key(), timer);
    };
    TimerRepository.prototype.registerTimerKey = function (key) {
        this.timers().set(key, new Timer_1.Timer(key, key.getTicks()));
    };
    TimerRepository.prototype.left = function (key) {
        var timer = this.timer.get(key);
        return timer.ticks();
    };
    TimerRepository.prototype.willEndIn = function (key, ticks) {
        var timer = this.timer.get(key);
        if (timer === null) {
            return true;
        }
        return timer.ticks() <= ticks;
    };
    TimerRepository.prototype.getTicks = function (key) {
        var timer = this.timer.get(key);
        if (timer === null) {
            return 0;
        }
        return timer.ticks();
    };
    TimerRepository.prototype.registers = function (key, ticks) {
        this.timer.set(key, new Timer_1.Timer(key, ticks));
    };
    TimerRepository.prototype.extendOrRegister = function (key, ticks) {
        this.timer.set(key, this.timer.get(key) === null || this.timer.get(key).ticks() < ticks ? new Timer_1.Timer(key, ticks) : this.timer.get(key));
    };
    TimerRepository.prototype.addOrSet = function (key, ticks) {
        this.timer.set(key, this.timer.get(key) ? new Timer_1.Timer(key, this.timer.get(key).ticks() + ticks) : new Timer_1.Timer(key, ticks));
    };
    TimerRepository.prototype.cancel = function (name) {
        this.timer.delete(name);
    };
    TimerRepository.prototype.process = function () {
        if (this.timer.size > 0) {
            this.timer.forEach(function (timer) {
                timer.tick();
            });
        }
    };
    TimerRepository.prototype.timers = function () {
        return this.timer;
    };
    return TimerRepository;
}());
exports.TimerRepository = TimerRepository;
//# sourceMappingURL=TimerRepository.js.map