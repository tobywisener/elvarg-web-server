"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Down = void 0;
var PlayerRights_1 = require("../../../model/rights/PlayerRights");
var Down = /** @class */ (function () {
    function Down() {
    }
    Down.prototype.execute = function (player, command, parts) {
        var newLocation = player.getLocation().clone().setZ(player.getLocation().getZ() - 1);
        if (newLocation.getZ() < 0) {
            newLocation.setZ(0);
            player.getPacketSender().sendMessage("You cannot move to a negative plane!");
        }
        player.moveTo(newLocation);
    };
    Down.prototype.canUse = function (player) {
        return (player.getRights() == PlayerRights_1.PlayerRights.OWNER || player.getRights() == PlayerRights_1.PlayerRights.DEVELOPER);
    };
    return Down;
}());
exports.Down = Down;
//# sourceMappingURL=Down.js.map