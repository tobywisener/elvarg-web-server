"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemInSlot = void 0;
var ItemInSlot = /** @class */ (function () {
    /**
     * An ItemInSlot object constructor.
     *
     * @param id     Item id.
     * @param slot Item slot.
     */
    function ItemInSlot(id, slot) {
        this.id = id;
        this.slot = slot;
    }
    /**
     * Gets the item's id.
     */
    ItemInSlot.prototype.getId = function () {
        return this.id;
    };
    /**
     * Gets the item slot.
     */
    ItemInSlot.prototype.getSlot = function () {
        return this.slot;
    };
    ItemInSlot.getFromInventory = function (itemId, inventory) {
        // Search player's inventory for this.id
        var itemIds = inventory.getItemIdsArray();
        var slot = itemIds.findIndex(function (i) { return i === itemId; });
        if (slot === -1) {
            return null;
        }
        return new ItemInSlot(itemId, slot);
    };
    return ItemInSlot;
}());
exports.ItemInSlot = ItemInSlot;
//# sourceMappingURL=ItemInSlot.js.map