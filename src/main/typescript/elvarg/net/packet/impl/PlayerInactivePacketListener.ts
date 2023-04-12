import { Player } from '../../../game/entity/impl/player/Player';
import { Packet } from '../Packet';
import { PacketExecutor } from '../PacketExecutor';

export class PlayerInactivePacketListener implements PacketExecutor {

    execute(player: Player, packet: Packet) {
        //CALLED EVERY 3 MINUTES OF INACTIVITY
    }
}
