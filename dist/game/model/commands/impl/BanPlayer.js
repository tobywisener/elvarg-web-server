"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BanPlayer = void 0;
var PlayerRights_1 = require("../../../model/rights/PlayerRights");
var GameConstants_1 = require("../../../GameConstants");
var World_1 = require("../../../World");
var PlayerPunishment_1 = require("../../../../util/PlayerPunishment");
var BanPlayer = /** @class */ (function () {
    function BanPlayer() {
    }
    BanPlayer.prototype.execute = function (player, command, parts) {
        var player2 = command.substring(parts[0].length + 1);
        var plr = World_1.World.getPlayerByName(player2);
        if (!GameConstants_1.GameConstants.PLAYER_PERSISTENCE.exists(player2) && !plr) {
            player.getPacketSender().sendMessage("Player ".concat(player2, " is not a valid online player."));
            return;
        }
        if (PlayerPunishment_1.PlayerPunishment.banned(player2)) {
            player.getPacketSender().sendMessage("Player ".concat(player2, " already has an active ban."));
            if (plr) {
                plr.requestLogout();
            }
            return;
        }
    };
    BanPlayer.prototype.canUse = function (player) {
        var rights = player.getRights();
        return (rights == PlayerRights_1.PlayerRights.OWNER || rights == PlayerRights_1.PlayerRights.DEVELOPER);
    };
    return BanPlayer;
}());
exports.BanPlayer = BanPlayer;
//# sourceMappingURL=BanPlayer.js.map