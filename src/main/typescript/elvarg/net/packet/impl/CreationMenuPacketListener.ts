import { Player } from '../../../game/entity/impl/player/Player';
import { Packet } from '../Packet';
import { PacketExecutor } from '../PacketExecutor';

export class CreationMenuPacketListener implements PacketExecutor {
    execute(player: Player, packet: Packet) {
        let itemId = packet.readInt();
        let amount = packet.readUnsignedByte();
        if (player.getCreationMenu() != null) {
            player.getCreationMenu().execute(itemId, amount);
        }
    }
}
