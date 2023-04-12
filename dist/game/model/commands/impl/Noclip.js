"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Noclip = void 0;
var PlayerRights_1 = require("../../../model/rights/PlayerRights");
var Noclip = /** @class */ (function () {
    function Noclip() {
    }
    Noclip.prototype.execute = function (player, command, parts) {
        player.getPacketSender().sendEnableNoclip();
        player.getPacketSender().sendConsoleMessage("Noclip enabled.");
    };
    Noclip.prototype.canUse = function (player) {
        return player.getRights() === PlayerRights_1.PlayerRights.OWNER || player.getRights() === PlayerRights_1.PlayerRights.DEVELOPER;
    };
    return Noclip;
}());
exports.Noclip = Noclip;
//# sourceMappingURL=Noclip.js.map