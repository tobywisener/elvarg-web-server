import { World } from "../../../game/World";
import { Player } from "../../../game/entity/impl/player/Player";
import { Packet } from "../Packet";
import { PacketExecutor } from "../PacketExecutor";
import { CombatSpells } from "../../../game/content/combat/magic/CombatSpells";

export class MagicOnPlayerPacketListener implements PacketExecutor {
    execute(player: Player, packet: Packet) {
        let playerIndex = packet.readShortA();

        if (!player || player.getHitpoints() <= 0) {
            return;
        }

        if (playerIndex < 0 || playerIndex > World.getPlayers().capacityReturn())
            return;
        let spellId = packet.readLEShort();
        if (spellId < 0) {
            return;
        }

        let attacked = World.getPlayers().get(playerIndex);

        if (!attacked || attacked === player) {
            player.getMovementQueue().reset();
            return;
        }


        if (attacked.getHitpoints() <= 0) {
            player.getMovementQueue().reset();
            return;
        }

        let spell = CombatSpells.getCombatSpell(spellId);

        if (!spell) {
            player.getMovementQueue().reset();
            return;
        }

        player.setPositionToFace(attacked.getLocation());
        player.getCombat().setCastSpell(spell);

        player.getCombat().attack(attacked);
    }
}
