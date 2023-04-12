"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = void 0;
var ItemDefinition_1 = require("../definition/ItemDefinition");
var Item = /** @class */ (function () {
    /**
 * An Item object constructor.
 *
 * @param id     Item id.
 * @param amount Item amount.
 *
 */
    function Item(id, amount) {
        this.id = id;
        this.amount = amount != null ? amount : 1;
    }
    /**
     * Gets the item's id.
     */
    Item.prototype.getId = function () {
        return this.id;
    };
    /**
     * Sets the item's id.
     *
     * @param id New item id.
     */
    Item.prototype.setId = function (id) {
        this.id = id;
        return this;
    };
    Item.prototype.getAmount = function () {
        return this.amount;
    };
    /**
* Sets the amount of the item.
*/
    Item.prototype.setAmount = function (amount) {
        this.amount = amount;
        return this;
    };
    /**
     * Checks if this item is valid or not.
     *
     * @return
     */
    Item.prototype.isValid = function () {
        return this.id > 0 && this.amount > 0;
    };
    /**
     * Increment the amount by 1.
     */
    Item.prototype.incrementAmount = function () {
        if ((this.amount + 1) > Number.MAX_SAFE_INTEGER) {
            return;
        }
        this.amount++;
    };
    /**
     * Decrement the amount by 1.
     */
    Item.prototype.decrementAmount = function () {
        if ((this.amount - 1) < 0) {
            return;
        }
        this.amount--;
    };
    Item.prototype.incrementAmountBy = function (amount) {
        if ((this.amount + amount) > Number.MAX_SAFE_INTEGER) {
            this.amount = Number.MAX_SAFE_INTEGER;
        }
        else {
            this.amount += amount;
        }
    };
    /**
* Decrement the amount by the specified amount.
*/
    Item.prototype.decrementAmountBy = function (amount) {
        if ((this.amount - amount) < 1) {
            this.amount = 0;
        }
        else {
            this.amount -= amount;
        }
    };
    Item.prototype.getDefinition = function () {
        return ItemDefinition_1.ItemDefinition.forId(this.id);
    };
    Item.prototype.clone = function () {
        return new Item(this.id, this.amount);
    };
    Item.prototype.equals = function (o) {
        if (!(o instanceof Item))
            return false;
        var item = o;
        return item.getId() == this.getId() && item.getAmount() == this.getAmount();
    };
    return Item;
}());
exports.Item = Item;
//# sourceMappingURL=Item.js.map