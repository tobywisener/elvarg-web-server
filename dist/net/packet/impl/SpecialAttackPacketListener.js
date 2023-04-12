"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecialAttackPacketListener = void 0;
var CombatSpecial_1 = require("../../../game/content/combat/CombatSpecial");
var SpecialAttackPacketListener = /** @class */ (function () {
    function SpecialAttackPacketListener() {
    }
    SpecialAttackPacketListener.prototype.execute = function (player, packet) {
        var specialBarButton = packet.readInt();
        if (player.getHitpoints() <= 0) {
            return;
        }
        CombatSpecial_1.CombatSpecial.activate(player);
    };
    return SpecialAttackPacketListener;
}());
exports.SpecialAttackPacketListener = SpecialAttackPacketListener;
//# sourceMappingURL=SpecialAttackPacketListener.js.map