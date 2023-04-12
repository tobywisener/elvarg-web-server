"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeleToPlayer = void 0;
var PlayerRights_1 = require("../../rights/PlayerRights");
var World_1 = require("../../../World");
var TeleToPlayer = /** @class */ (function () {
    function TeleToPlayer() {
    }
    TeleToPlayer.prototype.execute = function (player, command, parts) {
        var plr = World_1.World.getPlayerByName(command.substring(parts[0].length + 1));
        if (plr) {
            player.moveTo(plr.getLocation().clone());
        }
    };
    TeleToPlayer.prototype.canUse = function (player) {
        var rights = player.getRights();
        return (rights == PlayerRights_1.PlayerRights.OWNER || rights == PlayerRights_1.PlayerRights.DEVELOPER);
    };
    return TeleToPlayer;
}());
exports.TeleToPlayer = TeleToPlayer;
//# sourceMappingURL=TeleToPlayer.js.map