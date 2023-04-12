"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Claim = void 0;
var Claim = /** @class */ (function () {
    function Claim() {
    }
    Claim.prototype.execute = function (player, command, parts) {
        player.getPacketSender().sendMessage("To claim purchased items, please talk to the Financial Advisor at home.");
    };
    Claim.prototype.canUse = function (player) {
        return true;
    };
    return Claim;
}());
exports.Claim = Claim;
//# sourceMappingURL=Claim.js.map