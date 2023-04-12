"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stopwatch = void 0;
var Stopwatch = /** @class */ (function () {
    function Stopwatch() {
        this.time = Date.now();
        this.time = 0;
    }
    Stopwatch.prototype.start = function (startAt) {
        this.time = Date.now() - startAt;
    };
    Stopwatch.prototype.reset = function (i) {
        this.time = i ? i : Date.now();
        return this;
    };
    Stopwatch.prototype.Hasreset = function () {
        this.time = Date.now();
    };
    Stopwatch.prototype.elapsed = function () {
        return Date.now() - this.time;
    };
    Stopwatch.prototype.elapsedTime = function (time) {
        return this.elapsed() >= time;
    };
    Stopwatch.prototype.hasElapsed = function (time) {
        return this.elapsed() >= time;
    };
    Stopwatch.prototype.getTime = function () {
        return this.time;
    };
    return Stopwatch;
}());
exports.Stopwatch = Stopwatch;
//# sourceMappingURL=Stopwatch.js.map