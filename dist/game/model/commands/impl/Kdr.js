"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kdr = void 0;
var Kdr = /** @class */ (function () {
    function Kdr() {
    }
    Kdr.prototype.execute = function (player, command, parts) {
        player.forceChat("I currently have " + player.getKillDeathRatio() + " kdr!");
    };
    Kdr.prototype.canUse = function (player) {
        return true;
    };
    return Kdr;
}());
exports.Kdr = Kdr;
//# sourceMappingURL=Kdr.js.map