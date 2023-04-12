"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PNPCCommand = void 0;
var PlayerRights_1 = require("../../../model/rights/PlayerRights");
var PNPCCommand = /** @class */ (function () {
    function PNPCCommand() {
    }
    PNPCCommand.prototype.execute = function (player, command, parts) {
        player.setNpcTransformationId(parseInt(parts[1]));
    };
    PNPCCommand.prototype.canUse = function (player) {
        return player.getRights() === PlayerRights_1.PlayerRights.OWNER || player.getRights() === PlayerRights_1.PlayerRights.DEVELOPER;
    };
    return PNPCCommand;
}());
exports.PNPCCommand = PNPCCommand;
//# sourceMappingURL=PNPCCommand.js.map