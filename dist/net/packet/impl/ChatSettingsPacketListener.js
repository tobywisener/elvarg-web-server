"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatSettingsPacketListener = void 0;
var ChatSettingsPacketListener = /** @class */ (function () {
    function ChatSettingsPacketListener() {
    }
    // execute(player: Player, packet: Packet) {
    ChatSettingsPacketListener.prototype.execute = function (player, packet) {
        var publicMode = packet.readByte();
        var privateMode = packet.readByte();
        var tradeMode = packet.readByte();
        // if (privateMode > Object.keys(PrivateChatStatus).length / 2) {
        //     return;
        // }
        // let privateChatStatus = PrivateChatStatus[PrivateChatStatus[privateMode]];
        // if (player.getRelations().getStatus() != privateChatStatus) {
        //     player.getRelations().setStatus(privateChatStatus, true);
        // }
    };
    return ChatSettingsPacketListener;
}());
exports.ChatSettingsPacketListener = ChatSettingsPacketListener;
//# sourceMappingURL=ChatSettingsPacketListener.js.map