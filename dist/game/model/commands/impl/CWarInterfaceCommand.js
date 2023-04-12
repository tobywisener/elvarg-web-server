"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CWarInterfaceCommand = void 0;
var PlayerRights_1 = require("../../../model/rights/PlayerRights");
var CWarInterfaceCommand = /** @class */ (function () {
    function CWarInterfaceCommand() {
    }
    CWarInterfaceCommand.prototype.execute = function (player, command, parts) {
        try {
            player.getPacketSender().sendInterface(11169);
            var x = parseInt(parts[1]);
            var y = parseInt(parts[2]);
            player.getPacketSender().sendInterfaceComponentMoval(x, y, 11332);
            player.getPacketSender().sendMessage("Sending RedX to X=".concat(x, ", Y=").concat(y));
        }
        catch (e) {
            console.log(e);
        }
    };
    CWarInterfaceCommand.prototype.canUse = function (player) {
        return player.getRights() == PlayerRights_1.PlayerRights.DEVELOPER;
    };
    return CWarInterfaceCommand;
}());
exports.CWarInterfaceCommand = CWarInterfaceCommand;
//# sourceMappingURL=CWarInterfaceCommand.js.map