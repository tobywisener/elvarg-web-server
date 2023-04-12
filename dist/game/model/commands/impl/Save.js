"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Save = void 0;
var PlayerRights_1 = require("../../../model/rights/PlayerRights");
var GameConstants_1 = require("../../../GameConstants");
var Save = /** @class */ (function () {
    function Save() {
    }
    Save.prototype.execute = function (player, command, parts) {
        GameConstants_1.GameConstants.PLAYER_PERSISTENCE.save(player);
        player.getPacketSender().sendMessage("Saved player.");
    };
    Save.prototype.canUse = function (player) {
        return (player.getRights() == PlayerRights_1.PlayerRights.DEVELOPER || player.getRights() == PlayerRights_1.PlayerRights.OWNER);
    };
    return Save;
}());
exports.Save = Save;
//# sourceMappingURL=Save.js.map