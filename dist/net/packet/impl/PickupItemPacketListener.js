"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PickupItemPacketListener = void 0;
var PlayerRights_1 = require("../../../game/model/rights/PlayerRights");
var ItemOnGroundManager_1 = require("../../../game/entity/impl/grounditem/ItemOnGroundManager");
var ItemDefinition_1 = require("../../../game/definition/ItemDefinition");
var Sound_1 = require("../../../game/Sound");
var Sounds_1 = require("../../../game/Sounds");
var Location_1 = require("../../../game/model/Location");
var PickupItemPacketListener = /** @class */ (function () {
    function PickupItemPacketListener() {
    }
    PickupItemPacketListener.prototype.execute = function (player, packet) {
        var _this = this;
        var y = packet.readLEShort();
        var itemId = packet.readShort();
        var x = packet.readLEShort();
        var position = new Location_1.Location(x, y, player.getLocation().getZ());
        if (player.getRights() == PlayerRights_1.PlayerRights.DEVELOPER) {
            player.getPacketSender().sendMessage("Pick up item: " + itemId + ". " + position.toString());
        }
        if (player.busy() || !player.getLastItemPickup().elapsed()) {
            // If player is busy or last item was picked up less than 0.3 seconds ago
            return;
        }
        player.getMovementQueue().walkToGroundItem(position, function () { return _this.takeItem(player, itemId, position); });
    };
    PickupItemPacketListener.prototype.takeItem = function (player, itemId, position) {
        var x = position.getX(), y = position.getY();
        if (Math.abs(player.getLocation().getX() - x) > 25 || Math.abs(player.getLocation().getY() - y) > 25) {
            player.getMovementQueue().reset();
            return;
        }
        // Check if we can hold it..
        if (!(player.getInventory().getFreeSlots() > 0 || (player.getInventory().getFreeSlots() == 0
            && ItemDefinition_1.ItemDefinition.forId(itemId).isStackable() && player.getInventory().contains(itemId)))) {
            player.getInventory().full();
            return;
        }
        var item = ItemOnGroundManager_1.ItemOnGroundManager.getGroundItem(player.getUsername(), itemId, position);
        var deregister = true;
        if (item) {
            if (player.getInventory().getAmount(item.getItem().getId()) + item.getItem().getAmount() > Number.MAX_SAFE_INTEGER || player.getInventory().getAmount(item.getItem().getId()) + item.getItem().getAmount() <= 0) {
                var playerCanHold = Number.MAX_SAFE_INTEGER - player.getInventory().getAmount(item.getItem().getId());
                if (playerCanHold <= 0) {
                    player.getPacketSender().sendMessage("You cannot hold that more of that item.");
                    return;
                }
                else {
                    var currentAmount = item.getItem().getAmount();
                    item.setOldAmount(currentAmount);
                    item.getItem().decrementAmountBy(playerCanHold);
                    ItemOnGroundManager_1.ItemOnGroundManager.perform(item, ItemOnGroundManager_1.OperationType.ALTER);
                    deregister = false;
                }
            }
            if (deregister) {
                ItemOnGroundManager_1.ItemOnGroundManager.deregister(item);
            }
            player.getInventory().addItem(item.getItem());
            Sounds_1.Sounds.sendSound(player, Sound_1.Sound.PICK_UP_ITEM);
            player.getLastItemPickup().reset();
        }
    };
    return PickupItemPacketListener;
}());
exports.PickupItemPacketListener = PickupItemPacketListener;
//# sourceMappingURL=PickupItemPacketListener.js.map