import { PlayerPunishment } from "../../../util/PlayerPunishment";
import { Misc } from "../../../util/Misc";
import { Packet } from "../Packet";
import { PacketConstants } from "../PacketConstants";
import { ClanChatManager } from "../../../game/content/clan/ClanChatManager";
import { ChatMessage } from "../../../game/model/ChatMessage";
import { Player } from "../../../game/entity/impl/player/Player";
import { PacketExecutor } from '../../packet/PacketExecutor'

export class ChatPacketListener implements PacketExecutor {
    private static allowChat(player: Player, text: string) {
        if (!text || text.length === 0) {
            return false;
        }
        if (PlayerPunishment.muted(player.getUsername()) || PlayerPunishment.IPMuted(player.getHostAddress())) {
            player.getPacketSender().sendMessage("You are muted and cannot chat.");
            return false;
        }
        if (Misc.blockedWord(text)) {
            player.getPacketSender().sendMessage("Your message did not make it past the filter.");
            return false;
        }
        return true;
    }

    execute(player: Player, packet: Packet) {
        switch (packet.getOpcode()) {
            case PacketConstants.CLAN_CHAT_OPCODE:
                let clanMessage = packet.readString();
                if (!ChatPacketListener.allowChat(player, clanMessage)) {
                    return;
                }
                ClanChatManager.sendMessage(player, clanMessage);
                break;
            case PacketConstants.REGULAR_CHAT_OPCODE:
                let size = packet.getSize() - 2;
                let color = packet.readByteS();
                let effect = packet.readByteS();
                let text = packet.readReversedBytesA(size);
                let chatMessage = Misc.ucFirst(Misc.textUnpack(text, size).toLowerCase());

                if (!ChatPacketListener.allowChat(player, chatMessage)) {
                    return;
                }
                if (player.getChatMessageQueue().length >= 5) {
                    return;
                }
                player.getChatMessageQueue().push(new ChatMessage(color, effect, text));
                break;
        }
    }
}
