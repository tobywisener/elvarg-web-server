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
exports.BrokenItem = void 0;
var ItemIdentifiers_1 = require("../../util/ItemIdentifiers");
var ItemDefinition_1 = require("../definition/ItemDefinition");
var BrokenItems = {
    DRAGON_DEFENDER_BROKEN: [12954, 20463],
    AVERNIC_DEFENDER_BROKEN: [ItemIdentifiers_1.ItemIdentifiers.AVERNIC_DEFENDER, ItemIdentifiers_1.ItemIdentifiers.AVERNIC_DEFENDER_BROKEN_],
    FIRE_CAPE_BROKEN: [6570, 20445],
    INFERNAL_CAPE_BROKEN: [21295, 21287],
    FIGHTER_TORSO_BROKEN: [10551, 20513],
    VOID_KNIGHT_TOP: [8839, 20465],
    VOID_KNIGHT_ROBE: [8840, 20469],
    VOID_KNIGHT_GLOVES: [8842, 20475],
    VOID_KNIGHT_MAGE_HELM: [11663, 20477],
    VOID_KNIGHT_RANGER_HELM: [11664, 20479],
    VOID_KNIGHT_MELEE_HELM: [11665, 20481]
};
var BrokenItem = exports.BrokenItem = /** @class */ (function () {
    function BrokenItem(originalItem, brokenItem) {
        this.originalItem = originalItem;
        this.brokenItem = brokenItem;
    }
    BrokenItem.init = function () {
        var e_1, _a;
        try {
            for (var _b = __values(Object.values(BrokenItem)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var brokenItem = _c.value;
                BrokenItem.brokenItems.set(brokenItem.originalItem, brokenItem);
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
    /**
     * Gets the total cost of repairing a player's stuff.
     *
     * @param player
     * @param deleteEmblems
     * @return
     */
    BrokenItem.getRepairCost = function (player) {
        var e_2, _a;
        var cost = 0;
        try {
            for (var _b = __values(Object.values(BrokenItem)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var b = _c.value;
                var amt = player.getInventory().getAmount(b.brokenItem);
                if (amt > 0) {
                    cost += ((ItemDefinition_1.ItemDefinition.forId(b.originalItem).getBloodMoneyValue() * BrokenItem.REPAIR_COST_MULTIPLIER) * amt);
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
        return cost;
    };
    BrokenItem.get = function (originalId) {
        return BrokenItem.brokenItems.get(originalId);
    };
    BrokenItem.getValueLoseOnDeath = function (player) {
        var e_3, _a;
        var cost = 0;
        try {
            for (var _b = __values(Object.values(BrokenItem)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var b = _c.value;
                var amt = player.getInventory().getAmount(b.getOriginalItem());
                if (amt > 0) {
                    cost += Math.floor(ItemDefinition_1.ItemDefinition.forId(b.getOriginalItem()).getBloodMoneyValue() * BrokenItem.REPAIR_COST_MULTIPLIER) * amt;
                }
                var amtEq = player.getEquipment().getAmount(b.getOriginalItem());
                if (amtEq > 0) {
                    cost += Math.floor(ItemDefinition_1.ItemDefinition.forId(b.getOriginalItem()).getBloodMoneyValue() * BrokenItem.REPAIR_COST_MULTIPLIER) * amtEq;
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return cost;
    };
    BrokenItem.repair = function (player) {
        var e_4, _a;
        var fullCost = BrokenItem.getRepairCost(player);
        if (fullCost > player.getInventory().getAmount(ItemIdentifiers_1.ItemIdentifiers.BLOOD_MONEY)) {
            return false;
        }
        try {
            for (var _b = __values(BrokenItem.brokenItems.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var b = _c.value;
                var amt = player.getInventory().getAmount(b.brokenItem);
                if (amt > 0) {
                    var cost = Math.floor(ItemDefinition_1.ItemDefinition.forId(b.originalItem).getBloodMoneyValue() * BrokenItem.REPAIR_COST_MULTIPLIER * amt);
                    if (player.getInventory().getAmount(ItemIdentifiers_1.ItemIdentifiers.BLOOD_MONEY) >= cost) {
                        player.getInventory().deleteNumber(b.getBrokenItem(), cost);
                        player.getInventory().deleteNumber(b.getBrokenItem(), amt);
                        player.getInventory().adds(b.brokenItem, amt);
                    }
                    else {
                        return false;
                    }
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return true;
    };
    BrokenItem.prototype.getOriginalItem = function () {
        return this.originalItem;
    };
    BrokenItem.prototype.getBrokenItem = function () {
        return this.brokenItem;
    };
    BrokenItem.REPAIR_COST_MULTIPLIER = 0.03;
    BrokenItem.brokenItems = new Map();
    return BrokenItem;
}());
BrokenItem.init();
//# sourceMappingURL=BrokenItem.js.map