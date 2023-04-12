"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KickPlayer = void 0;
var World_1 = require("../../../World");
var PlayerRights_1 = require("../../rights/PlayerRights");
var KickPlayer = /** @class */ (function () {
    function KickPlayer() {
    }
    KickPlayer.prototype.execute = function (player, command, parts) {
        var plr = World_1.World.getPlayerByName(command.substring(parts[0].length + 1));
        if (plr) {
            plr.requestLogout();
        }
    };
    KickPlayer.prototype.canUse = function (player) {
        return (player.getRights() == PlayerRights_1.PlayerRights.OWNER || player.getRights() == PlayerRights_1.PlayerRights.DEVELOPER);
    };
    return KickPlayer;
}());
exports.KickPlayer = KickPlayer;
//# sourceMappingURL=KickPlayer.js.map