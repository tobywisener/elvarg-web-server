"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LockExperience = void 0;
var LockExperience = /** @class */ (function () {
    function LockExperience() {
    }
    LockExperience.prototype.execute = function (player, command, parts) {
        player.setExperienceLocked(!player.experienceLocked);
        player.getPacketSender().sendMessage("Lock: ".concat(player.experienceLocked));
    };
    LockExperience.prototype.canUse = function (player) {
        return true;
    };
    return LockExperience;
}());
exports.LockExperience = LockExperience;
//# sourceMappingURL=LockExperience.js.map