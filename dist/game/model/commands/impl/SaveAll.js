"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var World_1 = require("../../../World");
var PlayerRights_1 = require("../../rights/PlayerRights");
var SaveAll = /** @class */ (function () {
    function SaveAll() {
    }
    SaveAll.prototype.execute = function (player, command, parts) {
        World_1.World.savePlayers();
        player.getPacketSender().sendMessage("Saved all players.");
    };
    SaveAll.prototype.canUse = function (player) {
        return (player.getRights() == PlayerRights_1.PlayerRights.DEVELOPER || player.getRights() == PlayerRights_1.PlayerRights.OWNER || player.getRights() == PlayerRights_1.PlayerRights.ADMINISTRATOR);
    };
    return SaveAll;
}());
//# sourceMappingURL=SaveAll.js.map