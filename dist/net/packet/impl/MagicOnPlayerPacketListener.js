"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MagicOnPlayerPacketListener = void 0;
var World_1 = require("../../../game/World");
var CombatSpells_1 = require("../../../game/content/combat/magic/CombatSpells");
var MagicOnPlayerPacketListener = /** @class */ (function () {
    function MagicOnPlayerPacketListener() {
    }
    MagicOnPlayerPacketListener.prototype.execute = function (player, packet) {
        var playerIndex = packet.readShortA();
        if (!player || player.getHitpoints() <= 0) {
            return;
        }
        if (playerIndex < 0 || playerIndex > World_1.World.getPlayers().capacityReturn())
            return;
        var spellId = packet.readLEShort();
        if (spellId < 0) {
            return;
        }
        var attacked = World_1.World.getPlayers().get(playerIndex);
        if (!attacked || attacked === player) {
            player.getMovementQueue().reset();
            return;
        }
        if (attacked.getHitpoints() <= 0) {
            player.getMovementQueue().reset();
            return;
        }
        var spell = CombatSpells_1.CombatSpells.getCombatSpell(spellId);
        if (!spell) {
            player.getMovementQueue().reset();
            return;
        }
        player.setPositionToFace(attacked.getLocation());
        player.getCombat().setCastSpell(spell);
        player.getCombat().attack(attacked);
    };
    return MagicOnPlayerPacketListener;
}());
exports.MagicOnPlayerPacketListener = MagicOnPlayerPacketListener;
//# sourceMappingURL=MagicOnPlayerPacketListener.js.map