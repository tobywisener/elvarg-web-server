"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timer = void 0;
var Timer = /** @class */ (function () {
    function Timer(Key, Ticks) {
        this.Key = Key;
        this.Ticks = Ticks;
    }
    Timer.prototype.ticks = function () {
        return this.Ticks;
    };
    Timer.prototype.key = function () {
        return this.Key;
    };
    Timer.prototype.tick = function () {
        if (this.Ticks > 0) {
            this.Ticks--;
        }
    };
    return Timer;
}());
exports.Timer = Timer;
//# sourceMappingURL=Timer.js.map