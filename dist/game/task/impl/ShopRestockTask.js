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
exports.ShopRestockTask = void 0;
var ShopManager_1 = require("../../model/container/shop/ShopManager");
var Misc_1 = require("../../../util/Misc");
var Task_1 = require("../Task");
var ShopRestockTask = /** @class */ (function (_super) {
    __extends(ShopRestockTask, _super);
    function ShopRestockTask(shop) {
        var _this = _super.call(this) || this;
        _this.shop = shop;
        _this.shop = shop;
        return _this;
    }
    ShopRestockTask.restockCalc = function (overflow, curr) {
        var missing = overflow - curr;
        var amount = (missing * 0.3);
        if (amount < 1) {
            amount = 1;
        }
        return amount;
    };
    ShopRestockTask.prototype.execute = function () {
        var e_1, _a, e_2, _b;
        var items = [];
        try {
            for (var _c = __values(Misc_1.Misc.concat(this.shop.getCurrentStock(), this.shop.getOriginalStock())), _d = _c.next(); !_d.done; _d = _c.next()) {
                var item = _d.value;
                if (item == null)
                    continue;
                var itemId = item.getId();
                if (!items.includes(itemId)) {
                    items.push(itemId);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var performedUpdate = false;
        try {
            for (var items_1 = __values(items), items_1_1 = items_1.next(); !items_1_1.done; items_1_1 = items_1.next()) {
                var itemId = items_1_1.value;
                var originalAmount = this.shop.getAmount(itemId, true);
                var currentAmount = this.shop.getAmount(itemId, false);
                // If we have too many in stock, delete some..
                if (currentAmount > originalAmount) {
                    this.shop.removeItem(itemId, ShopRestockTask.restockCalc(currentAmount, originalAmount));
                    performedUpdate = true;
                }
                // If we have too few in stock, add some..
                else if (currentAmount < originalAmount) {
                    if (ShopManager_1.ShopManager.restocksItem(this.shop.getId())) {
                        this.shop.addItem(itemId, ShopRestockTask.restockCalc(originalAmount, currentAmount));
                        performedUpdate = true;
                    }
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (items_1_1 && !items_1_1.done && (_b = items_1.return)) _b.call(items_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        if (performedUpdate) {
            ShopManager_1.ShopManager.refresh(this.shop);
        }
        else {
            this.stop();
        }
    };
    ShopRestockTask.prototype.stop = function () {
        this.stop();
        this.shop.setRestocking(false);
    };
    return ShopRestockTask;
}(Task_1.Task));
exports.ShopRestockTask = ShopRestockTask;
//# sourceMappingURL=ShopRestockTask.js.map