"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfiniteHealth = void 0;
var PlayerRights_1 = require("../../../model/rights/PlayerRights");
var InfiniteHealth = /** @class */ (function () {
    function InfiniteHealth() {
    }
    InfiniteHealth.prototype.execute = function (player, command, parts) {
        player.setInfiniteHealth(!player.hasInfiniteHealth());
        player.getPacketSender().sendMessage("Invulnerable: ".concat(player.hasInfiniteHealth()));
    };
    InfiniteHealth.prototype.canUse = function (player) {
        return player.getRights() === PlayerRights_1.PlayerRights.OWNER || player.getRights() === PlayerRights_1.PlayerRights.DEVELOPER;
    };
    return InfiniteHealth;
}());
exports.InfiniteHealth = InfiniteHealth;
//# sourceMappingURL=InfiniteHealth.js.map