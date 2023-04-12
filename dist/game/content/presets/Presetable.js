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
exports.Presetable = void 0;
var Presetable = /** @class */ (function () {
    function Presetable(name, inventory, equipment, stats, spellbook, isGlobal) {
        this.isGlobal = false;
        this.name = name;
        this.inventory = inventory;
        this.equipment = equipment;
        this.stats = stats;
        this.spellbook = spellbook;
        this.isGlobal = isGlobal;
    }
    Presetable.prototype.getAmount = function (itemId) {
        var e_1, _a;
        var count = 0;
        try {
            for (var _b = __values(__spreadArray(__spreadArray([], __read(this.inventory), false), __read(this.equipment), false)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var item = _c.value;
                if (!item)
                    continue;
                if (item.getId() === itemId) {
                    count += item.getAmount();
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
        return count;
    };
    Presetable.prototype.getName = function () {
        return this.name;
    };
    Presetable.prototype.setName = function (name) {
        this.name = name;
    };
    Presetable.prototype.getInventory = function () {
        return this.inventory;
    };
    Presetable.prototype.setInventory = function (inventory) {
        this.inventory = inventory;
    };
    Presetable.prototype.getEquipment = function () {
        return this.equipment;
    };
    Presetable.prototype.setEquipment = function (equipment) {
        this.equipment = equipment;
    };
    Presetable.prototype.getStats = function () {
        return this.stats;
    };
    Presetable.prototype.setStats = function (stats) {
        this.stats = stats;
    };
    Presetable.prototype.getSpellbook = function () {
        return this.spellbook;
    };
    Presetable.prototype.setSpellbook = function (spellbook) {
        this.spellbook = spellbook;
    };
    Presetable.prototype.getIsGlobal = function () {
        return this.isGlobal;
    };
    return Presetable;
}());
exports.Presetable = Presetable;
//# sourceMappingURL=Presetable.js.map