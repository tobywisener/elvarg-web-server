"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreationMenuPacketListener = void 0;
var CreationMenuPacketListener = /** @class */ (function () {
    function CreationMenuPacketListener() {
    }
    // execute(player: Player, packet: Packet) {
    CreationMenuPacketListener.prototype.execute = function (player, packet) {
        var itemId = packet.readInt();
        var amount = packet.readUnsignedByte();
        if (player.getCreationMenu() != null) {
            player.getCreationMenu().execute(itemId, amount);
        }
    };
    return CreationMenuPacketListener;
}());
exports.CreationMenuPacketListener = CreationMenuPacketListener;
//# sourceMappingURL=CreationMenuPacketListener.js.map