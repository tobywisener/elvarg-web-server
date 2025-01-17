"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovementPacketListener = void 0;
var MovementPacketListener = /** @class */ (function () {
    function MovementPacketListener() {
    }
    // execute(player: Player, packet: Packet) {
    MovementPacketListener.prototype.execute = function (player, packet) {
        if (player.getHitpoints() <= 0) {
            return;
        }
        var mobility = player.getMovementQueue().getMobility();
        if (!mobility.canMove()) {
            mobility.sendMessage(player);
            return;
        }
        var absoluteX = packet.readShort();
        var absoluteY = packet.readShort();
        var plane = packet.readUnsignedByte();
        // let destination = new Location(absoluteX, absoluteY, plane);
        // if (!player.getMovementQueue().checkDestination(destination)) {
        //     return;
        // }
        if (player.getInterfaceId() !=
            MovementPacketListener.FLOATING_WORLD_MAP_INTERFACE) {
            // Close all interfaces except for floating world map
            player.getPacketSender().sendInterfaceRemoval();
        }
        // Make sure to reset any previous movement steps
        player.getMovementQueue().reset();
        player.getMovementQueue().walkToReset();
        // PathFinder.calculateWalkRoute(player, absoluteX, absoluteY);
    };
    MovementPacketListener.FLOATING_WORLD_MAP_INTERFACE = 54000;
    return MovementPacketListener;
}());
exports.MovementPacketListener = MovementPacketListener;
//# sourceMappingURL=MovementPacketListener.js.map