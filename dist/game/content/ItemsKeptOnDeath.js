"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
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
exports.ItemsKeptOnDeath = void 0;
var Emblem_1 = require("./combat/bountyhunter/Emblem");
var SkullType_1 = require("../model/SkullType");
var PrayerHandler_1 = require("./PrayerHandler");
var ItemsKeptOnDeath = /** @class */ (function () {
    function ItemsKeptOnDeath() {
    }
    ItemsKeptOnDeath.open = function (player) {
        ItemsKeptOnDeath.clearInterfaceData(player); //To prevent sending multiple layers of items.
        ItemsKeptOnDeath.sendInterfaceData(player); //Send info on the interface.
        player.getPacketSender().sendInterface(17100); //Open the interface.
    };
    ItemsKeptOnDeath.sendInterfaceData = function (player) {
        var e_1, _a;
        player.getPacketSender().sendString("" + ItemsKeptOnDeath.getAmountToKeep(player), 17107);
        var toKeep = ItemsKeptOnDeath.getItemsToKeep(player);
        for (var i = 0; i < toKeep.length; i++) {
            player.getPacketSender().sendItemOnInterface(17108 + i, toKeep[i].getId(), 0, 1);
        }
        var toSend = 17112;
        try {
            for (var _b = __values(__spreadArray(__spreadArray([], __read(player.getInventory().getItems()), false), __read(player.getEquipment().getItems()), false)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var item = _c.value;
                if (item == null || item.getId() <= 0 || item.getAmount() <= 0 || !item.getDefinition().isTradeable() || toKeep.includes(item)) {
                    continue;
                }
                player.getPacketSender().sendItemOnInterface(toSend, item.getId(), 0, item.getAmount());
                toSend++;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    ItemsKeptOnDeath.clearInterfaceData = function (player) {
        for (var i = 17108; i <= 17152; i++)
            player.getPacketSender().clearItemOnInterface(i);
    };
    ItemsKeptOnDeath.getItemsToKeep = function (player) {
        var e_2, _a;
        var items = [];
        try {
            for (var _b = __values(__spreadArray(__spreadArray([], __read(player.getInventory().getItems()), false), __read(player.getEquipment().getItems()), false)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var item = _c.value;
                if (item == null || item.getId() <= 0 || item.getAmount() <= 0 || !item.getDefinition().isTradeable()) {
                    continue;
                }
                //Dont keep emblems
                if (item.getId() == Emblem_1.Emblem.MYSTERIOUS_EMBLEM_1.id ||
                    item.getId() == Emblem_1.Emblem.MYSTERIOUS_EMBLEM_2.id ||
                    item.getId() == Emblem_1.Emblem.MYSTERIOUS_EMBLEM_3.id ||
                    item.getId() == Emblem_1.Emblem.MYSTERIOUS_EMBLEM_4.id ||
                    item.getId() == Emblem_1.Emblem.MYSTERIOUS_EMBLEM_5.id ||
                    item.getId() == Emblem_1.Emblem.MYSTERIOUS_EMBLEM_6.id ||
                    item.getId() == Emblem_1.Emblem.MYSTERIOUS_EMBLEM_7.id ||
                    item.getId() == Emblem_1.Emblem.MYSTERIOUS_EMBLEM_8.id ||
                    item.getId() == Emblem_1.Emblem.MYSTERIOUS_EMBLEM_9.id ||
                    item.getId() == Emblem_1.Emblem.MYSTERIOUS_EMBLEM_10.id) {
                    continue;
                }
                items.push(item);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        items.sort(function (item, item2) {
            var value1 = item.getDefinition().getValue();
            var value2 = item2.getDefinition().getValue();
            if (value1 == value2) {
                return 0;
            }
            else if (value1 > value2) {
                return -1;
            }
            else {
                return 1;
            }
        });
        var toKeep;
        var amountToKeep = ItemsKeptOnDeath.getAmountToKeep(player);
        for (var i = 0; i < amountToKeep && i < items.length; i++) {
            toKeep.unshift(items[i]);
        }
        return toKeep;
    };
    ItemsKeptOnDeath.getAmountToKeep = function (player) {
        if (player.getSkullTimer() > 0) {
            if (player.getSkullType() == SkullType_1.SkullType.RED_SKULL) {
                return 0;
            }
        }
        return (player.getSkullTimer() > 0 ? 0 : 3) + (PrayerHandler_1.PrayerHandler.isActivated(player, PrayerHandler_1.PrayerHandler.PROTECT_ITEM) ? 1 : 0);
    };
    return ItemsKeptOnDeath;
}());
exports.ItemsKeptOnDeath = ItemsKeptOnDeath;
//# sourceMappingURL=ItemsKeptOnDeath.js.map