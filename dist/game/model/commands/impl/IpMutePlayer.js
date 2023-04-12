"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpMutePlayer = void 0;
var World_1 = require("../../../World");
var PlayerRights_1 = require("../../rights/PlayerRights");
var IpMutePlayer = /** @class */ (function () {
    function IpMutePlayer() {
    }
    IpMutePlayer.prototype.execute = function (player, command, parts) {
        var player2 = World_1.World.getPlayerByName(command.substring(parts[0].length + 1));
        if (!player2) {
            player.getPacketSender().sendMessage("Player " + player2 + " is not online.");
            return;
        }
    };
    IpMutePlayer.prototype.canUse = function (player) {
        return (player.getRights() == PlayerRights_1.PlayerRights.OWNER || player.getRights() == PlayerRights_1.PlayerRights.DEVELOPER);
    };
    return IpMutePlayer;
}());
exports.IpMutePlayer = IpMutePlayer;
//# sourceMappingURL=IpMutePlayer.js.map