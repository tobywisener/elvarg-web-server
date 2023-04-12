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
exports.BarrowsSet = void 0;
var BarrowsSets = {
    GUTHANS_SET: [12873, 4724, 4726, 4728, 4730],
    VERACS_SET: [12875, 4753, 4755, 4757, 4759],
    TORAGS_SET: [12879, 4745, 4747, 4749, 4751],
    AHRIMS_SET: [12881, 4708, 4710, 4712, 4714],
    KARILS_SET: [12883, 4732, 4734, 4736, 4738],
    DHAROKS_SET: [12877, 4716, 4718, 4720, 4722],
};
var BarrowsSet = exports.BarrowsSet = /** @class */ (function () {
    function BarrowsSet(setId) {
        var items = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            items[_i - 1] = arguments[_i];
        }
        this.setId = setId;
        this.items = items;
    }
    BarrowsSet.init = function () {
        var e_1, _a, e_2, _b;
        try {
            for (var _c = __values(Object.values(BarrowsSet)), _d = _c.next(); !_d.done; _d = _c.next()) {
                var set = _d.value;
                try {
                    for (var _e = (e_2 = void 0, __values(set.items)), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var i = _f.value;
                        BarrowsSet.sets.set(i, set);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                BarrowsSet.sets.set(set.getSetId(), set);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    BarrowsSet.pack = function (player, itemId) {
        var e_3, _a, e_4, _b;
        var set = BarrowsSet.sets.get(itemId);
        if (!set) {
            return false;
        }
        if (player.busy()) {
            player.getPacketSender().sendMessage("You cannot do that right now.");
            return true;
        }
        try {
            for (var _c = __values(set.items), _d = _c.next(); !_d.done; _d = _c.next()) {
                var i = _d.value;
                if (!player.getInventory().contains(i)) {
                    player.getPacketSender().sendMessage("You do not have enough components to make a set out of this armor.");
                    return true;
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
        try {
            for (var _e = __values(set.items), _f = _e.next(); !_f.done; _f = _e.next()) {
                var i = _f.value;
                player.getInventory().deleteNumber(i, 1);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
            }
            finally { if (e_4) throw e_4.error; }
        }
        player.getInventory().adds(set.setId, 1);
        player.getPacketSender().sendMessage("You've made a set our of your armor.");
        return true;
    };
    BarrowsSet.get = function (item) {
        return BarrowsSet.sets.get(item);
    };
    BarrowsSet.prototype.getSetId = function () {
        return this.setId;
    };
    BarrowsSet.prototype.getItems = function () {
        return this.items;
    };
    BarrowsSet.sets = new Map();
    return BarrowsSet;
}());
//# sourceMappingURL=BarrowsSet.js.map