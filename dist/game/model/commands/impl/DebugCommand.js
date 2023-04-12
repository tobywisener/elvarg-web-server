"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugCommand = void 0;
var PlayerRights_1 = require("../../../model/rights/PlayerRights");
var RegionManager_1 = require("../../../collision/RegionManager");
var DebugCommand = /** @class */ (function () {
    function DebugCommand() {
    }
    DebugCommand.prototype.execute = function (player, command, parts) {
        console.log(RegionManager_1.RegionManager.wallsExist(player.getLocation().clone(), player.getPrivateArea()));
    };
    DebugCommand.prototype.canUse = function (player) {
        return (player.getRights() == PlayerRights_1.PlayerRights.DEVELOPER);
    };
    return DebugCommand;
}());
exports.DebugCommand = DebugCommand;
//# sourceMappingURL=DebugCommand.js.map