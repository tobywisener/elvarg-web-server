"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BarrageCommand = void 0;
var PlayerRights_1 = require("../../../model/rights/PlayerRights");
var BarrageCommand = /** @class */ (function () {
    function BarrageCommand() {
    }
    BarrageCommand.prototype.execute = function (player, command, parts) {
    };
    BarrageCommand.prototype.canUse = function (player) {
        var rights = player.getRights();
        return (rights == PlayerRights_1.PlayerRights.OWNER || rights == PlayerRights_1.PlayerRights.DEVELOPER);
    };
    return BarrageCommand;
}());
exports.BarrageCommand = BarrageCommand;
//# sourceMappingURL=BarrageCommand.js.map