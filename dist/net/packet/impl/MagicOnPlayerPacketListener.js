"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MagicOnPlayerPacketListener = void 0;
// import { CombatSpells } from "../../../game/content/combat/magic/CombatSpells";
var MagicOnPlayerPacketListener = /** @class */ (function () {
    function MagicOnPlayerPacketListener() {
    }
    // execute(player: Player, packet: Packet) {
    MagicOnPlayerPacketListener.prototype.execute = function (player, packet) {
        var playerIndex = packet.readShortA();
        if (!player || player.getHitpoints() <= 0) {
            return;
        }
        // if (playerIndex < 0 || playerIndex > World.getPlayers().capacityReturn())
        //     return;
        var spellId = packet.readLEShort();
        if (spellId < 0) {
            return;
        }
        // let attacked = World.getPlayers().get(playerIndex);
        // if (!attacked || attacked === player) {
        //     player.getMovementQueue().reset();
        //     return;
        // }
        // if (attacked.getHitpoints() <= 0) {
        //     player.getMovementQueue().reset();
        //     return;
        // }
        // let spell = CombatSpells.getCombatSpell(spellId);
        // if (!spell) {
        //     player.getMovementQueue().reset();
        //     return;
        // }
        // player.setPositionToFace(attacked.getLocation());
        // player.getCombat().setCastSpell(spell);
        // player.getCombat().attack(attacked);
    };
    return MagicOnPlayerPacketListener;
}());
exports.MagicOnPlayerPacketListener = MagicOnPlayerPacketListener;
//# sourceMappingURL=MagicOnPlayerPacketListener.js.map