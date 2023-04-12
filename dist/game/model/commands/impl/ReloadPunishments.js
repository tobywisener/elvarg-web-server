"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReloadPunishments = void 0;
var PlayerRights_1 = require("../../../model/rights/PlayerRights");
var PlayerPunishment_1 = require("../../../../util/PlayerPunishment");
var ReloadPunishments = /** @class */ (function () {
    function ReloadPunishments() {
    }
    ReloadPunishments.prototype.execute = function (player, command, parts) {
        PlayerPunishment_1.PlayerPunishment.init();
        player.getPacketSender().sendConsoleMessage("Reloaded");
    };
    ReloadPunishments.prototype.canUse = function (player) {
        var rights = player.getRights();
        return (rights === PlayerRights_1.PlayerRights.OWNER || rights === PlayerRights_1.PlayerRights.DEVELOPER);
    };
    return ReloadPunishments;
}());
exports.ReloadPunishments = ReloadPunishments;
//# sourceMappingURL=ReloadPunishments.js.map