"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Up = void 0;
var PlayerRights_1 = require("../../rights/PlayerRights");
var Up = /** @class */ (function () {
    function Up() {
    }
    Up.prototype.execute = function (player, command, parts) {
        var newLocation = player.getLocation().clone().setZ(player.getLocation().getZ() + 1);
        player.moveTo(newLocation);
    };
    Up.prototype.canUse = function (player) {
        return (player.getRights() == PlayerRights_1.PlayerRights.OWNER || player.getRights() == PlayerRights_1.PlayerRights.DEVELOPER);
    };
    return Up;
}());
exports.Up = Up;
//# sourceMappingURL=Up.js.map