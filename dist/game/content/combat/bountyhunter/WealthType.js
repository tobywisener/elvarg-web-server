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
exports.WealthType = void 0;
var Emblem_1 = require("./Emblem");
var WealthType = exports.WealthType = /** @class */ (function () {
    function WealthType(tooltip, configId) {
        this.tooltip = tooltip;
        this.configId = configId;
    }
    WealthType.getWealth = function (player) {
        var e_1, _a;
        var wealth = 0;
        var items = __spreadArray(__spreadArray([], __read(player.getInventory().getItems()), false), __read(player.getEquipment().getItems()), false);
        try {
            for (var items_1 = __values(items), items_1_1 = items_1.next(); !items_1_1.done; items_1_1 = items_1.next()) {
                var item = items_1_1.value;
                if (item == null || item.getId() <= 0 || item.getAmount() <= 0 || !item.getDefinition().isDropable() || !item.getDefinition().isTradeable()) {
                    continue;
                }
                wealth += item.getDefinition().getValue();
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (items_1_1 && !items_1_1.done && (_a = items_1.return)) _a.call(items_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var type = WealthType.VERY_LOW;
        if (wealth >= Emblem_1.Emblem.MYSTERIOUS_EMBLEM_1.value) {
            type = WealthType.LOW;
        }
        if (wealth >= Emblem_1.Emblem.MYSTERIOUS_EMBLEM_3.value) {
            type = WealthType.MEDIUM;
        }
        if (wealth >= Emblem_1.Emblem.MYSTERIOUS_EMBLEM_6.value) {
            type = WealthType.HIGH;
        }
        if (wealth >= Emblem_1.Emblem.MYSTERIOUS_EMBLEM_9.value) {
            type = WealthType.VERY_HIGH;
        }
        return type;
    };
    WealthType.NO_TARGET = new WealthType("N/A", 876);
    WealthType.VERY_LOW = new WealthType("V. Low", 877);
    WealthType.LOW = new WealthType("Low", 878);
    WealthType.MEDIUM = new WealthType("Medium", 879);
    WealthType.HIGH = new WealthType("High", 880);
    WealthType.VERY_HIGH = new WealthType("V. High", 881);
    return WealthType;
}());
//# sourceMappingURL=WealthType.js.map