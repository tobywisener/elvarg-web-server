import { Player } from "../../../game/entity/impl/player/Player"
import { Packet } from "../Packet"
import { PacketExecutor } from "../PacketExecutor"

export class FinalizedMapRegionChangePacketListener implements PacketExecutor {
    execute(player: Player, packet: Packet): void {
    }
}