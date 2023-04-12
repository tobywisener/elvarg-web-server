"use strict";
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
exports.Shop = void 0;
var ShopCurrencies_1 = require("../shop/currency/ShopCurrencies");
var Item_1 = require("../../Item");
var ShopManager_1 = require("./ShopManager");
var Shop = exports.Shop = /** @class */ (function () {
    function Shop() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.currentStock = new Array(Shop.MAX_SHOP_ITEMS);
        if (args.length === 2 || args.length === 3) {
            // Constructor with optional currency parameter
            if (args.length === 3) {
                this.currency = args[2];
            }
            else {
                this.currency = ShopCurrencies_1.ShopCurrencies.COINS;
            }
            this.id = ShopManager_1.ShopManager.generateUnusedId();
            this.name = args[0];
            this.originalStock = args[1];
            this.currentStock = this.originalStock.map(function (item) { return item.clone(); });
        }
        else if (args.length === 4) {
            // Constructor with all parameters
            this.id = args[0];
            this.name = args[1];
            this.originalStock = args[2];
            this.currentStock = this.originalStock.map(function (item) { return item.clone(); });
            this.currency = args[3];
        }
        else {
            throw new Error('Invalid constructor parameters');
        }
    }
    Shop.prototype.removeItem = function (itemId, amount) {
        for (var i = 0; i < this.currentStock.length; i++) {
            var item = this.currentStock[i];
            if (!item)
                continue;
            if (item.getId() === itemId) {
                item.setAmount(item.getAmount() - amount);
                if (item.getAmount() <= 1) {
                    if (ShopManager_1.ShopManager.deletesItems(this.id)) {
                        this.currentStock[i] = null;
                    }
                    else {
                        item.setAmount(1);
                    }
                }
                break;
            }
        }
    };
    Shop.prototype.addItem = function (itemId, amount) {
        var e_1, _a;
        var found = false;
        try {
            for (var _b = __values(this.currentStock), _c = _b.next(); !_c.done; _c = _b.next()) {
                var item = _c.value;
                if (!item)
                    continue;
                if (item.getId() === itemId) {
                    var amt = item.getAmount() + amount;
                    if (amt < Number.MAX_SAFE_INTEGER) {
                        item.setAmount(item.getAmount() + amount);
                        found = true;
                        break;
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (!found) {
            for (var i = 0; i < this.currentStock.length; i++) {
                if (!this.currentStock[i]) {
                    this.currentStock[i] = new Item_1.Item(itemId, amount);
                    break;
                }
            }
        }
    };
    Shop.prototype.isFull = function () {
        var e_2, _a;
        var amount = 0;
        try {
            for (var _b = __values(this.currentStock), _c = _b.next(); !_c.done; _c = _b.next()) {
                var item = _c.value;
                if (!item)
                    continue;
                amount++;
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return (amount >= Shop.MAX_SHOP_ITEMS);
    };
    Shop.prototype.getAmount = function (itemId, fromOriginalStock) {
        var e_3, _a, e_4, _b;
        if (!fromOriginalStock) {
            try {
                for (var _c = __values(this.currentStock), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var item = _d.value;
                    if (!item)
                        continue;
                    if (item.getId() === itemId) {
                        return item.getAmount();
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }
        else {
            try {
                for (var _e = __values(this.originalStock), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var item = _f.value;
                    if (item.getId() === itemId) {
                        return item.getAmount();
                    }
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                }
                finally { if (e_4) throw e_4.error; }
            }
        }
        return 0;
    };
    Shop.prototype.getCurrentStockList = function () {
        var e_5, _a;
        var list = [];
        try {
            for (var _b = __values(this.currentStock), _c = _b.next(); !_c.done; _c = _b.next()) {
                var item = _c.value;
                if (!item)
                    continue;
                list.push(item);
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_5) throw e_5.error; }
        }
        return list;
    };
    Shop.prototype.getId = function () {
        return this.id;
    };
    Shop.prototype.getName = function () {
        return this.name;
    };
    Shop.prototype.getCurrency = function () {
        return this.currency;
    };
    Shop.prototype.getCurrentStock = function () {
        return this.currentStock;
    };
    Shop.prototype.getOriginalStock = function () {
        return this.originalStock;
    };
    Shop.prototype.isRestocking = function () {
        return this.restocking;
    };
    Shop.prototype.setRestocking = function (restocking) {
        this.restocking = restocking;
    };
    Shop.SALES_TAX_MODIFIER = 0.85;
    Shop.MAX_SHOP_ITEMS = 1000;
    Shop.MAX_SHOPS = 5000;
    Shop.INTERFACE_ID = 3824;
    Shop.ITEM_CHILD_ID = 3900;
    Shop.NAME_INTERFACE_CHILD_ID = 3901;
    Shop.INVENTORY_INTERFACE_ID = 3823;
    Shop.SCROLL_BAR_INTERFACE_ID = 29995;
    Shop.INFINITY = 2000000000;
    Shop.CURRENCY_COINS = ShopCurrencies_1.ShopCurrencies.COINS;
    return Shop;
}());
//# sourceMappingURL=Shop.js.map