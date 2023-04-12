"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnlockPrayers = void 0;
var PlayerRights_1 = require("../../rights/PlayerRights");
var UnlockPrayers = /** @class */ (function () {
    function UnlockPrayers() {
    }
    UnlockPrayers.prototype.execute = function (player, command, parts) {
        var type = parseInt(parts[1]);
        if (type == 0) {
            player.setPreserveUnlocked(true);
        }
        else if (type == 1) {
            player.setRigourUnlocked(true);
        }
        else if (type == 2) {
            player.setAuguryUnlocked(true);
        }
        player.getPacketSender().sendConfig(709, player.isPreserveUnlocked() ? 1 : 0);
        player.getPacketSender().sendConfig(711, player.isRigourUnlocked() ? 1 : 0);
        player.getPacketSender().sendConfig(713, player.getAuguryUnlocked() ? 1 : 0);
    };
    UnlockPrayers.prototype.canUse = function (player) {
        var rights = player.getRights();
        return (rights == PlayerRights_1.PlayerRights.OWNER || rights == PlayerRights_1.PlayerRights.DEVELOPER);
    };
    return UnlockPrayers;
}());
exports.UnlockPrayers = UnlockPrayers;
//# sourceMappingURL=UnlockPrayers.js.map