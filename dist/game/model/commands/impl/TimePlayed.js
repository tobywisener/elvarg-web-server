"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimePlayed = void 0;
var Misc_1 = require("../../../../util/Misc");
var TimePlayed = /** @class */ (function () {
    function TimePlayed() {
    }
    TimePlayed.prototype.execute = function (player, command, parts) {
        player.forceChat("I've been playing for ".concat(Misc_1.Misc.getFormattedPlayTime(player), "."));
    };
    TimePlayed.prototype.canUse = function (player) {
        return true;
    };
    return TimePlayed;
}());
exports.TimePlayed = TimePlayed;
//# sourceMappingURL=TimePlayed.js.map