"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExitClient = void 0;
var CombatFactory_1 = require("../../../content/combat/CombatFactory");
var PlayerRights_1 = require("../../rights/PlayerRights");
var World_1 = require("../../../World");
var ExitClient = /** @class */ (function () {
    function ExitClient() {
    }
    ExitClient.prototype.execute = function (player, command, parts) {
        var player2 = command.substring(parts[0].length + 1);
        var plr = World_1.World.getPlayerByName(player2);
        if (!plr) {
            player.getPacketSender().sendMessage("Player " + player2 + " is not online.");
            return;
        }
        if (CombatFactory_1.CombatFactory.inCombat(plr)) {
            player.getPacketSender().sendMessage("Player " + player2 + " is in combat!");
            return;
        }
        plr.getPacketSender().sendExit();
        player.getPacketSender().sendMessage("Closed other player's client.");
    };
    ExitClient.prototype.canUse = function (player) {
        var rights = player.getRights();
        return (rights == PlayerRights_1.PlayerRights.OWNER || rights == PlayerRights_1.PlayerRights.DEVELOPER);
    };
    return ExitClient;
}());
exports.ExitClient = ExitClient;
//# sourceMappingURL=ExitClient.js.map