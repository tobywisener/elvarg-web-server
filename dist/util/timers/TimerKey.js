"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimerKey = void 0;
var Misc_1 = require("../Misc");
var TimerKey = exports.TimerKey = /** @class */ (function () {
    function TimerKey(ticks) {
        this.ticks = ticks;
    }
    TimerKey.prototype.getTicks = function () {
        return this.ticks;
    };
    TimerKey.FOOD = new TimerKey();
    TimerKey.KARAMBWAN = new TimerKey();
    TimerKey.POTION = new TimerKey();
    TimerKey.COMBAT_ATTACK = new TimerKey();
    TimerKey.FREEZE = new TimerKey();
    TimerKey.FREEZE_IMMUNITY = new TimerKey();
    TimerKey.STUN = new TimerKey();
    TimerKey.ATTACK_IMMUNITY = new TimerKey();
    TimerKey.CASTLEWARS_TAKE_ITEM = new TimerKey();
    TimerKey.STEPPING_OUT = new TimerKey();
    TimerKey.BOT_WAIT_FOR_PLAYERS = new TimerKey(Misc_1.Misc.getTicks(180 /* 3 minutes */));
    return TimerKey;
}());
//# sourceMappingURL=TimerKey.js.map