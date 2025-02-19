// import { Player } from "../../../game/entity/impl/player/Player";
import { PacketExecutor } from "../PacketExecutor";
import { Packet } from "../Packet";
// import { CombatSpecial } from "../../../game/content/combat/CombatSpecial";

export class SpecialAttackPacketListener implements PacketExecutor {
  // execute(player: Player, packet: Packet) {
  execute(player: any, packet: Packet) {
    let specialBarButton = packet.readInt();

    if (player.getHitpoints() <= 0) {
      return;
    }

    // CombatSpecial.activate(player);
  }
}
