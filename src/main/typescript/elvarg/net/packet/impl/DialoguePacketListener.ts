// import { Player } from "../../../game/entity/impl/player/Player";
import { Packet } from "../Packet";
import { PacketExecutor } from "../PacketExecutor";

export class DialoguePacketListener implements PacketExecutor {
  // execute(player: Player, packet: Packet) {
  execute(player: any, packet: Packet) {
    player.getDialogueManager().advance();
  }
}
