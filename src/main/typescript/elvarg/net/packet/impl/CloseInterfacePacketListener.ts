import { Player } from "../../../game/entity/impl/player/Player";
import { Packet } from "../Packet";
import { PacketExecutor } from "../PacketExecutor";

export class CloseInterfacePacketListener implements PacketExecutor {
    execute(player: Player, packet: Packet) {
        player.getPacketSender().sendInterfaceRemoval();
    }
}
