"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PickupItemPacketListener = void 0;
// import { ItemOnGroundManager, OperationType } from "../../../game/entity/impl/grounditem/ItemOnGroundManager";
// import { ItemDefinition } from "../../../game/definition/ItemDefinition";
// import { Sound } from "../../../game/Sound";
// import { Sounds } from "../../../game/Sounds";
// import { Location } from "../../../game/model/Location";
// import { ItemOnGround } from "../../../game/entity/impl/grounditem/ItemOnGround";
var PickupItemPacketListener = /** @class */ (function () {
    function PickupItemPacketListener() {
    }
    // execute(player: Player, packet: Packet) {
    PickupItemPacketListener.prototype.execute = function (player, packet) {
        var y = packet.readLEShort();
        var itemId = packet.readShort();
        var x = packet.readLEShort();
        // const position = new Location(x, y, player.getLocation().getZ());
        // if (player.getRights() == PlayerRights.DEVELOPER) {
        //     player.getPacketSender().sendMessage("Pick up item: " + itemId + ". " + position.toString());
        // }
        if (player.busy() || !player.getLastItemPickup().elapsed()) {
            // If player is busy or last item was picked up less than 0.3 seconds ago
            return;
        }
        // player.getMovementQueue().walkToGroundItem(position, () => this.takeItem(player, itemId, position));
    };
    return PickupItemPacketListener;
}());
exports.PickupItemPacketListener = PickupItemPacketListener;
//# sourceMappingURL=PickupItemPacketListener.js.map