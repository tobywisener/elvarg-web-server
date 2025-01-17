"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DialoguePacketListener = void 0;
var DialoguePacketListener = /** @class */ (function () {
    function DialoguePacketListener() {
    }
    // execute(player: Player, packet: Packet) {
    DialoguePacketListener.prototype.execute = function (player, packet) {
        player.getDialogueManager().advance();
    };
    return DialoguePacketListener;
}());
exports.DialoguePacketListener = DialoguePacketListener;
//# sourceMappingURL=DialoguePacketListener.js.map