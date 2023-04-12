"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatSettingsPacketListener = void 0;
var PlayerRelations_1 = require("../../../game/model/PlayerRelations");
var ChatSettingsPacketListener = /** @class */ (function () {
    function ChatSettingsPacketListener() {
    }
    ChatSettingsPacketListener.prototype.execute = function (player, packet) {
        var publicMode = packet.readByte();
        var privateMode = packet.readByte();
        var tradeMode = packet.readByte();
        if (privateMode > Object.keys(PlayerRelations_1.PrivateChatStatus).length / 2) {
            return;
        }
        var privateChatStatus = PlayerRelations_1.PrivateChatStatus[PlayerRelations_1.PrivateChatStatus[privateMode]];
        if (player.getRelations().getStatus() != privateChatStatus) {
            player.getRelations().setStatus(privateChatStatus, true);
        }
    };
    return ChatSettingsPacketListener;
}());
exports.ChatSettingsPacketListener = ChatSettingsPacketListener;
//# sourceMappingURL=ChatSettingsPacketListener.js.map