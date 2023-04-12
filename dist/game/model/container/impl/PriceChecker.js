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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceChecker = void 0;
var ItemContainer_1 = require("../ItemContainer");
var StackType_1 = require("../StackType");
var PlayerStatus_1 = require("../../PlayerStatus");
var Misc_1 = require("../../../../util/Misc");
var Item_1 = require("../../Item");
var PriceChecker = exports.PriceChecker = /** @class */ (function (_super) {
    __extends(PriceChecker, _super);
    function PriceChecker(player) {
        return _super.call(this, player) || this;
    }
    PriceChecker.prototype.open = function () {
        this.player.setStatus(PlayerStatus_1.PlayerStatus.PRICE_CHECKING);
        this.player.getMovementQueue().reset();
        this.refreshItems();
        return this;
    };
    PriceChecker.prototype.capacity = function () {
        return 24;
    };
    PriceChecker.prototype.stackType = function () {
        return StackType_1.StackType.DEFAULT;
    };
    PriceChecker.prototype.refreshItems = function () {
        var items_ = this.getValidItems();
        if (items_.length > 0) {
            this.player.getPacketSender().sendString("", 18355).sendString(Misc_1.Misc.insertCommasToNumber(this.getTotalValue()), 18351); // TOTAL VALUE
            // Send item prices
            for (var i = 0; i < this.capacity(); i++) {
                var itemPrice = "";
                var totalPrice = "";
                if (this.getItems()[i].isValid()) {
                    var value = this.getItems()[i].getDefinition().getValue();
                    var amount = this.getItems()[i].getAmount();
                    var total_price = (value * amount);
                    if (total_price >= Number.MAX_SAFE_INTEGER) {
                        totalPrice = "Too High!";
                    }
                    else {
                        totalPrice = " = " + Misc_1.Misc.insertCommasToNumber(String(total_price));
                    }
                    itemPrice = "" + Misc_1.Misc.insertCommasToNumber(String(value)) + " x" + String(amount);
                }
                this.player.getPacketSender().sendString(itemPrice, PriceChecker.TEXT_START_ROW_1 + i);
                this.player.getPacketSender().sendString(totalPrice, PriceChecker.TEXT_START_ROW_2 + i);
            }
        }
        else {
            this.player.getPacketSender().sendString("Click an item in your inventory to check it's wealth.", 18355)
                .sendString("0", 18351); // TOTAL VALUE
            // Reset item prices
            for (var i = 0; i < this.capacity(); i++) {
                this.player.getPacketSender().sendString("", PriceChecker.TEXT_START_ROW_1 + i);
                this.player.getPacketSender().sendString("", PriceChecker.TEXT_START_ROW_2 + i);
            }
        }
        this.player.getPacketSender().sendInterfaceSet(PriceChecker.INTERFACE_ID, 3321);
        this.player.getPacketSender().sendItemContainer(this, PriceChecker.CONTAINER_ID);
        this.player.getPacketSender().sendItemContainer(this.player.getInventory(), 3322);
        return this;
    };
    PriceChecker.prototype.full = function () {
        this.player.getPacketSender().sendMessage("The pricechecker cannot hold any more items.");
        return this;
    };
    PriceChecker.prototype.withdrawAll = function () {
        var e_1, _a;
        if (this.player.getStatus() == PlayerStatus_1.PlayerStatus.PRICE_CHECKING && this.player.getInterfaceId() == PriceChecker.INTERFACE_ID) {
            try {
                for (var _b = __values(this.getValidItems()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var item = _c.value;
                    this.switchItems(this.player.getInventory(), item.clone(), false, false);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            this.refreshItems();
            this.player.getInventory().refreshItems();
        }
    };
    PriceChecker.prototype.depositAll = function () {
        var e_2, _a;
        if (this.player.getStatus() == PlayerStatus_1.PlayerStatus.PRICE_CHECKING && this.player.getInterfaceId() == PriceChecker.INTERFACE_ID) {
            try {
                for (var _b = __values(this.player.getInventory().getValidItems()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var item = _c.value;
                    if (item.getDefinition().getValue() > 0) {
                        this.switchItems(this, item.clone(), false, false);
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
            this.refreshItems();
            this.player.getInventory().refreshItems();
        }
    };
    PriceChecker.prototype.deposit = function (id, amount, slot) {
        if (this.player.getStatus() == PlayerStatus_1.PlayerStatus.PRICE_CHECKING && this.player.getInterfaceId() == PriceChecker.INTERFACE_ID) {
            // Verify item
            if (this.player.getInventory().getItems()[slot].getId() == id) {
                // Perform switch
                var item = new Item_1.Item(id, amount);
                if (!item.getDefinition().isSellable()) {
                    this.player.getPacketSender()
                        .sendMessage("That item cannot be pricechecked because it isn't sellable.");
                    return true;
                }
                if (item.getDefinition().getValue() == 0) {
                    this.player.getPacketSender()
                        .sendMessage("There's no point pricechecking that item. It has no value.");
                    return true;
                }
                if (item.getAmount() == 1) {
                    this.player.getInventory().switchItem(this, item, false, slot, true);
                }
                else {
                    this.switchItems(this, item, false, true);
                }
            }
            return true;
        }
        return false;
    };
    PriceChecker.prototype.withdraw = function (id, amount, slot) {
        if (this.player.getStatus() == PlayerStatus_1.PlayerStatus.PRICE_CHECKING && this.player.getInterfaceId() == PriceChecker.INTERFACE_ID) {
            // Verify item
            if (this.items[slot].getId() == id) {
                // Perform switch
                var item = new Item_1.Item(id, amount);
                if (item.getAmount() == 1) {
                    this.switchItem(this.player.getInventory(), item, false, slot, true);
                }
                else {
                    this.switchItems(this.player.getInventory(), item, false, true);
                }
            }
            return true;
        }
        return false;
    };
    PriceChecker.INTERFACE_ID = 42000;
    PriceChecker.CONTAINER_ID = 18500;
    PriceChecker.TEXT_START_ROW_1 = 18300;
    PriceChecker.TEXT_START_ROW_2 = 18400;
    return PriceChecker;
}(ItemContainer_1.ItemContainer));
//# sourceMappingURL=PriceChecker.js.map