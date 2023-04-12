"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MutePlayer = void 0;
var World_1 = require("../../../World");
var PlayerRights_1 = require("../../rights/PlayerRights");
var GameConstants_1 = require("../../../GameConstants");
var MutePlayer = /** @class */ (function () {
    function MutePlayer() {
    }
    MutePlayer.prototype.execute = function (player, command, parts) {
        var player2 = command.substring(parts[0].length + 1);
        var plr = World_1.World.getPlayerByName(player2);
        if (!GameConstants_1.GameConstants.PLAYER_PERSISTENCE.exists(player2) && !plr) {
            player.getPacketSender().sendMessage("Player " + player2 + " does not exist.");
            return;
        }
    };
    MutePlayer.prototype.canUse = function (player) {
        var rights = player.getRights();
        return (rights == PlayerRights_1.PlayerRights.OWNER || rights == PlayerRights_1.PlayerRights.DEVELOPER);
    };
    return MutePlayer;
}());
exports.MutePlayer = MutePlayer;
//# sourceMappingURL=MutePlayer.js.map