"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AreaDebug = void 0;
var PlayerRights_1 = require("../../rights/PlayerRights");
var AreaDebug = /** @class */ (function () {
    function AreaDebug() {
    }
    AreaDebug.prototype.execute = function (player, command, parts) {
        if (player.getArea() != null) {
            player.getPacketSender().sendMessage("");
            player.getPacketSender().sendMessage("Area: " + player.getArea().constructor.name);
            // player.getPacketSender().sendMessage("Players in this area: " +
            // player.getArea().players.size() +", npcs in this area:
            // "+player.getArea().npcs.size());
        }
        else {
            player.getPacketSender().sendMessage("No area found for your coordinates.");
        }
    };
    AreaDebug.prototype.canUse = function (player) {
        var rights = player.getRights();
        return (rights == PlayerRights_1.PlayerRights.OWNER || rights == PlayerRights_1.PlayerRights.DEVELOPER);
    };
    return AreaDebug;
}());
exports.AreaDebug = AreaDebug;
//# sourceMappingURL=AreaDebug.js.map