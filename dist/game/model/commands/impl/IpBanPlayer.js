"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpBanPlayer = void 0;
var PlayerRights_1 = require("../../rights/PlayerRights");
var World_1 = require("../../../World");
var IpBanPlayer = /** @class */ (function () {
    function IpBanPlayer() {
    }
    IpBanPlayer.prototype.execute = function (player, command, parts) {
        var player2 = command.substring(parts[0].length + 1);
        var plr = World_1.World.getPlayerByName(player2);
        if (!plr) {
            player.getPacketSender().sendMessage("Player " + player2 + " is not online.");
            return;
        }
    };
    IpBanPlayer.prototype.canUse = function (player) {
        var rights = player.getRights();
        return (rights == PlayerRights_1.PlayerRights.OWNER || rights == PlayerRights_1.PlayerRights.DEVELOPER);
    };
    return IpBanPlayer;
}());
exports.IpBanPlayer = IpBanPlayer;
//# sourceMappingURL=IpBanPlayer.js.map