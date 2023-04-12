"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PlayerRights_1 = require("../../rights/PlayerRights");
var World_1 = require("../../../World");
var TeleToMe = /** @class */ (function () {
    function TeleToMe() {
    }
    TeleToMe.prototype.execute = function (player, command, parts) {
        var plr = World_1.World.getPlayerByName(command.substring(parts[0].length + 1));
        if (plr) {
            plr.moveTo(player.getLocation());
        }
    };
    TeleToMe.prototype.canUse = function (player) {
        var rights = player.getRights();
        return (rights == PlayerRights_1.PlayerRights.OWNER || rights == PlayerRights_1.PlayerRights.DEVELOPER);
    };
    return TeleToMe;
}());
//# sourceMappingURL=TeleToMe.js.map