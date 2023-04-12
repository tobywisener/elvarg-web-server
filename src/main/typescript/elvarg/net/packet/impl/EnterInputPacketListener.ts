
import { Player } from "../../../game/entity/impl/player/Player";
import { ByteBufUtils } from "../../../net/ByteBufUtils";
import { Packet } from "../../../net/packet/Packet";
import { PacketConstants } from "../../../net/packet/PacketConstants";
import { PacketExecutor } from "../../../net/packet/PacketExecutor";

export class EnterInputPacketListener implements PacketExecutor {

    execute(player: Player, packet: Packet) {

        if (player == null || player.getHitpoints() <= 0) {
            return;
        }

        switch (packet.getOpcode()) {
            case PacketConstants.ENTER_SYNTAX_OPCODE:
                let name = ByteBufUtils.readString(packet.getBuffer());
                if (name == null)
                    return;
                if (player.getEnteredSyntaxAction() != null) {
                    player.getEnteredSyntaxAction().execute(name);
                    player.setEnteredSyntaxAction(null);
                }
                break;
            case PacketConstants.ENTER_AMOUNT_OPCODE:
                let amount = packet.readInt();
                if (amount <= 0)
                    return;
                if (player.getEnteredAmountAction() != null) {
                    player.getEnteredAmountAction().execute(amount);
                    player.setEnteredAmountAction(null);
                }
                break;
        }
    }
}
