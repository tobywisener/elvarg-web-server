
import { Player } from '../../../game/entity/impl/player/Player';
import { World } from '../../../game/World';
import { Packet } from '../Packet';
import { PacketConstants } from '../PacketConstants';
import { PacketExecutor } from '../PacketExecutor';
import { Misc } from '../../../util/Misc';

export class PlayerRelationPacketListener implements PacketExecutor {

    execute(player: Player, packet: Packet) {
        try {
            let username = packet.readLong();
            if (username < 0) {
                return;
            }
            switch (packet.getOpcode()) {
                case PacketConstants.ADD_FRIEND_OPCODE:
                    player.getRelations().addFriend(username);
                    break;
                case PacketConstants.ADD_IGNORE_OPCODE:
                    player.getRelations().addIgnore(username);
                    break;
                case PacketConstants.REMOVE_FRIEND_OPCODE:
                    player.getRelations().deleteFriend(username);
                    break;
                case PacketConstants.REMOVE_IGNORE_OPCODE:
                    player.getRelations().deleteIgnore(username);
                    break;
                case PacketConstants.SEND_PM_OPCODE:
                    let size = packet.getSize();
                    let message = packet.readBytes(size);
                    let friend = World.getPlayerByName(Misc.formatText(Misc.longToString(username)).replace("_", " "));
                    if (friend) {
                        player.getRelations().message(friend, new Uint8Array(message), size);
                    } else {
                        player.getPacketSender().sendMessage("That player is offline.");
                    }
                    break;
            }
        } catch (e) {
            console.log(e);
        }
    }
}
