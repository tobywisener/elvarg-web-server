"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecialAttackPacketListener = void 0;
// import { CombatSpecial } from "../../../game/content/combat/CombatSpecial";
var SpecialAttackPacketListener = /** @class */ (function () {
    function SpecialAttackPacketListener() {
    }
    // execute(player: Player, packet: Packet) {
    SpecialAttackPacketListener.prototype.execute = function (player, packet) {
        var specialBarButton = packet.readInt();
        if (player.getHitpoints() <= 0) {
            return;
        }
        // CombatSpecial.activate(player);
    };
    return SpecialAttackPacketListener;
}());
exports.SpecialAttackPacketListener = SpecialAttackPacketListener;
//# sourceMappingURL=SpecialAttackPacketListener.js.map