"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Players = void 0;
var DonatorRights_1 = require("../../rights/DonatorRights");
var Players = /** @class */ (function () {
    function Players() {
    }
    Players.prototype.execute = function (player, command, parts) {
        player.setDonatorRights(DonatorRights_1.DonatorRights.REGULAR_DONATOR);
        player.getPacketSender().sendRights();
    };
    Players.prototype.canUse = function (player) {
        return true;
    };
    return Players;
}());
exports.Players = Players;
//# sourceMappingURL=Players.js.map