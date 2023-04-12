"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterfaceCommand = void 0;
var PlayerRights_1 = require("../../../model/rights/PlayerRights");
var InterfaceCommand = /** @class */ (function () {
    function InterfaceCommand() {
    }
    InterfaceCommand.prototype.execute = function (player, command, parts) {
        player.getPacketSender().sendInterface(parseInt(parts[1]));
    };
    InterfaceCommand.prototype.canUse = function (player) {
        return (player.getRights() == PlayerRights_1.PlayerRights.OWNER || player.getRights() == PlayerRights_1.PlayerRights.DEVELOPER);
    };
    return InterfaceCommand;
}());
exports.InterfaceCommand = InterfaceCommand;
//# sourceMappingURL=InterfaceCommand.js.map