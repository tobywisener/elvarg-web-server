"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnIpMutePlayer = void 0;
var PlayerRights_1 = require("../../rights/PlayerRights");
var World_1 = require("../../../World");
var CombatFactory_1 = require("../../../content/combat/CombatFactory");
var UnIpMutePlayer = /** @class */ (function () {
    function UnIpMutePlayer() {
    }
    UnIpMutePlayer.prototype.execute = function (player, command, parts) {
        var player2 = command.substring(parts[0].length + 1);
        var plr = World_1.World.getPlayerByName(player2);
        if (!plr) {
            player.getPacketSender().sendMessage("Player ".concat(player2, " is not online."));
            return;
        }
        if (CombatFactory_1.CombatFactory.inCombat(plr)) {
            player.getPacketSender().sendMessage("Player ".concat(player2, " is in combat!"));
            return;
        }
    };
    UnIpMutePlayer.prototype.canUse = function (player) {
        var rights = player.getRights();
        return (rights == PlayerRights_1.PlayerRights.OWNER || rights == PlayerRights_1.PlayerRights.DEVELOPER);
    };
    return UnIpMutePlayer;
}());
exports.UnIpMutePlayer = UnIpMutePlayer;
//# sourceMappingURL=UnIpMutePlayer.js.map