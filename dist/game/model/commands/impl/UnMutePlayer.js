"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnMutePlayer = void 0;
var PlayerRights_1 = require("../../rights/PlayerRights");
var World_1 = require("../../../World");
var GameConstants_1 = require("../../../GameConstants");
var PlayerPunishment_1 = require("../../../../util/PlayerPunishment");
var UnMutePlayer = /** @class */ (function () {
    function UnMutePlayer() {
    }
    UnMutePlayer.prototype.execute = function (player, command, parts) {
        var player2 = command.substring(parts[0].length + 1);
        var plr = World_1.World.getPlayerByName(player2);
        if (!GameConstants_1.GameConstants.PLAYER_PERSISTENCE.exists(player2) && !plr) {
            player.getPacketSender().sendMessage("Player ".concat(player2, " does not exist."));
            return;
        }
        if (!PlayerPunishment_1.PlayerPunishment.muted(player2)) {
            player.getPacketSender().sendMessage("Player ".concat(player2, " does not have an active mute."));
            return;
        }
    };
    UnMutePlayer.prototype.canUse = function (player) {
        var rights = player.getRights();
        return (rights == PlayerRights_1.PlayerRights.OWNER || rights == PlayerRights_1.PlayerRights.DEVELOPER);
    };
    return UnMutePlayer;
}());
exports.UnMutePlayer = UnMutePlayer;
//# sourceMappingURL=UnMutePlayer.js.map