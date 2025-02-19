import { Packet } from "../Packet";
// import { Player } from "../../../game/entity/impl/player/Player";
import { PacketExecutor } from "../PacketExecutor";
// import { NpcDefinition } from "../../../game/definition/NpcDefinition";

export class ExamineNpcPacketListener implements PacketExecutor {
  // execute(player: Player, packet: Packet) {
  execute(player: any, packet: Packet) {
    let npcId = packet.readShort();

    if (npcId <= 0) {
      return;
    }

    // let npcDef = NpcDefinition.forId(npcId);
    // if (npcDef != null) {
    //     player.getPacketSender().sendMessage(npcDef.getExamine());
    // }
  }
}
