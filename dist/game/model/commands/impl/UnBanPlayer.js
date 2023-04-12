"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnBanPlayer = void 0;
var PlayerRights_1 = require("../../rights/PlayerRights");
var PlayerPunishment_1 = require("../../../../util/PlayerPunishment");
var GameConstants_1 = require("../../../GameConstants");
var UnBanPlayer = /** @class */ (function () {
    function UnBanPlayer() {
    }
    UnBanPlayer.prototype.execute = function (player, command, parts) {
        var player2 = command.substring(parts[0].length + 1);
        if (!GameConstants_1.GameConstants.PLAYER_PERSISTENCE.exists(player2)) {
            player.getPacketSender().sendMessage("Player ".concat(player2, " is not online."));
            return;
        }
        if (!PlayerPunishment_1.PlayerPunishment.banned(player2)) {
            player.getPacketSender().sendMessage("Player ".concat(player2, " is not banned!"));
            return;
        }
    };
    UnBanPlayer.prototype.canUse = function (player) {
        var rights = player.getRights();
        return (rights == PlayerRights_1.PlayerRights.OWNER || rights == PlayerRights_1.PlayerRights.DEVELOPER);
    };
    return UnBanPlayer;
}());
exports.UnBanPlayer = UnBanPlayer;
//# sourceMappingURL=UnBanPlayer.js.map