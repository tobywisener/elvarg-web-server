"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DropItemPacketListener = void 0;
var Item_1 = require("../../../game/model/Item");
var Sound_1 = require("../../../game/Sound");
var Inventory_1 = require("../../../game/model/container/impl/Inventory");
var ItemOnGroundManager_1 = require("../../../game/entity/impl/grounditem/ItemOnGroundManager");
var WildernessArea_1 = require("../../../game/model/areas/impl/WildernessArea");
var Sounds_1 = require("../../../game/Sounds");
var PetHandler_1 = require("../../../game/content/PetHandler");
var PlayerRights_1 = require("../../../game/model/rights/PlayerRights");
var DropItemPacketListener = /** @class */ (function () {
    function DropItemPacketListener() {
    }
    DropItemPacketListener.destroyItemInterface = function (player, item) {
        var _a;
        player.setDestroyItem(item.getId());
        var info = [{ "Are you sure you want to discard this item?": "14174" }, { "Yes.": "14175" }, { "No.": "14176" }, { "": "14177" }, { "This item will vanish once it hits the floor.": "14182" }, { "You cannot get it back if discarded.": "14183" }, (_a = {}, _a[item.getDefinition().getName()] = "14184", _a)];
        player.getPacketSender().sendItemOnInterfaces(14171, item.getId(), item.getAmount());
        for (var i = 0; i < info.length; i++)
            player.getPacketSender().sendString(info[i][0], parseInt(info[i][1]));
        player.getPacketSender().sendChatboxInterface(14170);
    };
    DropItemPacketListener.prototype.execute = function (player, packet) {
        var id = packet.readUnsignedShortA();
        var interface_id = packet.readUnsignedShort();
        var itemSlot = packet.readUnsignedShortA();
        if (player == null || player.getHitpoints() <= 0) {
            return;
        }
        if (interface_id != Inventory_1.Inventory.INTERFACE_ID) {
            return;
        }
        if (player.getHitpoints() <= 0)
            return;
        if (itemSlot < 0 || itemSlot >= player.getInventory().capacity())
            return;
        if (player.busy()) {
            player.getPacketSender().sendInterfaceRemoval();
        }
        var item = player.getInventory().getItems()[itemSlot];
        if (item == null)
            return;
        if (item.getId() != id || item.getAmount() <= 0) {
            return;
        }
        if (player.getRights() == PlayerRights_1.PlayerRights.DEVELOPER) {
            player.getPacketSender().sendMessage("Drop item: " + item.getId().toString() + ".");
        }
        player.getPacketSender().sendInterfaceRemoval();
        // Stop skilling..
        player.getSkillManager().stopSkillable();
        // Check if we're dropping a pet..
        if (PetHandler_1.PetHandler.drop(player, id, false)) {
            Sounds_1.Sounds.sendSound(player, Sound_1.Sound.DROP_ITEM);
            return;
        }
        if (item.getDefinition().isDropable()) {
            // Items dropped in the Wilderness should go global immediately.
            if (player.getArea() instanceof WildernessArea_1.WildernessArea) {
                ItemOnGroundManager_1.ItemOnGroundManager.registerGlobal(player, item);
            }
            else {
                ItemOnGroundManager_1.ItemOnGroundManager.registers(player, item);
            }
            player.getInventory().setItem(itemSlot, new Item_1.Item(-1, 0)).refreshItems();
            Sounds_1.Sounds.sendSound(player, Sound_1.Sound.DROP_ITEM);
        }
        else {
            DropItemPacketListener.destroyItemInterface(player, item);
        }
    };
    return DropItemPacketListener;
}());
exports.DropItemPacketListener = DropItemPacketListener;
//# sourceMappingURL=DropItemPacketListener.js.map