"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Inventory = void 0;
var ItemContainer_1 = require("../ItemContainer");
var StackType_1 = require("../StackType");
var Inventory = exports.Inventory = /** @class */ (function (_super) {
    __extends(Inventory, _super);
    function Inventory(player) {
        return _super.call(this, player) || this;
    }
    Inventory.prototype.capacity = function () {
        return 28;
    };
    Inventory.prototype.stackType = function () {
        return StackType_1.StackType.DEFAULT;
    };
    Inventory.prototype.refreshItems = function () {
        this.getPlayer().getPacketSender().sendItemContainer(this, Inventory.INTERFACE_ID);
        return this.refreshItems();
    };
    Inventory.prototype.full = function (itemId) {
        this.getPlayer().getPacketSender().sendMessage("Not enough space in your inventory.");
        return this;
    };
    Inventory.INTERFACE_ID = 3214;
    return Inventory;
}(ItemContainer_1.ItemContainer));
//# sourceMappingURL=Inventory.js.map