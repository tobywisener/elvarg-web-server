"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PositionDebug = void 0;
var PlayerRights_1 = require("../../../model/rights/PlayerRights");
var PositionDebug = /** @class */ (function () {
    function PositionDebug() {
    }
    PositionDebug.prototype.execute = function (player, command, parts) {
        player.getPacketSender().sendMessage(player.getLocation().toString());
    };
    PositionDebug.prototype.canUse = function (player) {
        var rights = player.getRights();
        return (rights == PlayerRights_1.PlayerRights.OWNER || rights == PlayerRights_1.PlayerRights.DEVELOPER);
    };
    return PositionDebug;
}());
exports.PositionDebug = PositionDebug;
//# sourceMappingURL=PositionDebug.js.map