"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemCurrency = void 0;
var ItemDefinition_1 = require("../../../../../definition/ItemDefinition");
var ItemCurrency = /** @class */ (function () {
    function ItemCurrency(itemId) {
        this.itemId = itemId;
    }
    ItemCurrency.prototype.getItemDefinition = function () {
        if (!this.itemDefinition) {
            this.itemDefinition = ItemDefinition_1.ItemDefinition.forId(this.itemId);
        }
        return this.itemDefinition;
    };
    ItemCurrency.prototype.getName = function () {
        return this.getItemDefinition().getName();
    };
    ItemCurrency.prototype.getAmountForPlayer = function (player) {
        return player.getInventory().getAmount(this.itemDefinition.getId());
    };
    ItemCurrency.prototype.decrementForPlayer = function (player, amount) {
        player.getInventory().deleteNumber(this.itemDefinition.getId(), amount);
    };
    ItemCurrency.prototype.incrementForPlayer = function (player, amount) {
        player.getInventory().adds(this.itemDefinition.getId(), amount);
    };
    return ItemCurrency;
}());
exports.ItemCurrency = ItemCurrency;
//# sourceMappingURL=ItemCurrency.js.map