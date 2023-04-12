"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatPacketListener = void 0;
var PlayerPunishment_1 = require("../../../util/PlayerPunishment");
var Misc_1 = require("../../../util/Misc");
var PacketConstants_1 = require("../PacketConstants");
var ClanChatManager_1 = require("../../../game/content/clan/ClanChatManager");
var ChatMessage_1 = require("../../../game/model/ChatMessage");
var ChatPacketListener = /** @class */ (function () {
    function ChatPacketListener() {
    }
    ChatPacketListener.allowChat = function (player, text) {
        if (!text || text.length === 0) {
            return false;
        }
        if (PlayerPunishment_1.PlayerPunishment.muted(player.getUsername()) || PlayerPunishment_1.PlayerPunishment.IPMuted(player.getHostAddress())) {
            player.getPacketSender().sendMessage("You are muted and cannot chat.");
            return false;
        }
        if (Misc_1.Misc.blockedWord(text)) {
            player.getPacketSender().sendMessage("Your message did not make it past the filter.");
            return false;
        }
        return true;
    };
    ChatPacketListener.prototype.execute = function (player, packet) {
        switch (packet.getOpcode()) {
            case PacketConstants_1.PacketConstants.CLAN_CHAT_OPCODE:
                var clanMessage = packet.readString();
                if (!ChatPacketListener.allowChat(player, clanMessage)) {
                    return;
                }
                ClanChatManager_1.ClanChatManager.sendMessage(player, clanMessage);
                break;
            case PacketConstants_1.PacketConstants.REGULAR_CHAT_OPCODE:
                var size = packet.getSize() - 2;
                var color = packet.readByteS();
                var effect = packet.readByteS();
                var text = packet.readReversedBytesA(size);
                var chatMessage = Misc_1.Misc.ucFirst(Misc_1.Misc.textUnpack(text, size).toLowerCase());
                if (!ChatPacketListener.allowChat(player, chatMessage)) {
                    return;
                }
                if (player.getChatMessageQueue().length >= 5) {
                    return;
                }
                player.getChatMessageQueue().push(new ChatMessage_1.ChatMessage(color, effect, text));
                break;
        }
    };
    return ChatPacketListener;
}());
exports.ChatPacketListener = ChatPacketListener;
//# sourceMappingURL=ChatPacketListener.js.map