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
exports.CombatEquipment = void 0;
var Equipment_1 = require("../../model/container/impl/Equipment");
var CombatType_1 = require("./CombatType");
var ItemIdentifiers_1 = require("../../../util/ItemIdentifiers");
var CombatEquipment = exports.CombatEquipment = /** @class */ (function () {
    function CombatEquipment() {
    }
    /**
 * Is the player wearing obsidian?
 *
 * @param player The player.
 * @return true if player is wearing obsidian, false otherwise.
 */
    CombatEquipment.wearingObsidian = function (player) {
        var e_1, _a;
        if (player.getEquipment().getItems()[2].getId() != 11128)
            return false;
        try {
            for (var _b = __values(CombatEquipment.OBSIDIAN_WEAPONS), _c = _b.next(); !_c.done; _c = _b.next()) {
                var weapon = _c.value;
                if (player.getEquipment().getItems()[3].getId() == weapon) {
                    return true;
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
        return false;
    };
    /**
     * Is the player wearing void?
     *
     * @param player The player.
     * @return true if player is wearing void, false otherwise.
     */
    CombatEquipment.wearingVoid = function (player, attackType) {
        var e_2, _a;
        var correctEquipment = 0;
        var helmet = attackType == CombatType_1.CombatType.MAGIC ? CombatEquipment.MAGE_VOID_HELM :
            attackType == CombatType_1.CombatType.RANGED ? CombatEquipment.RANGED_VOID_HELM : CombatEquipment.MELEE_VOID_HELM;
        try {
            for (var _b = __values(CombatEquipment.VOID_ARMOUR), _c = _b.next(); !_c.done; _c = _b.next()) {
                var armour = _c.value;
                if (player.getEquipment().getItems()[armour[0]].getId() == armour[1]) {
                    correctEquipment++;
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
        if (player.getEquipment().getItems()[Equipment_1.Equipment.SHIELD_SLOT].getId() == CombatEquipment.VOID_KNIGHT_DEFLECTOR) {
            correctEquipment++;
        }
        return correctEquipment >= 3 && player.getEquipment().getItems()[Equipment_1.Equipment.HEAD_SLOT].getId() == helmet;
    };
    CombatEquipment.hasDragonProtectionGear = function (player) {
        return player.getEquipment().get(Equipment_1.Equipment.SHIELD_SLOT).getId() == ItemIdentifiers_1.ItemIdentifiers.ANTI_DRAGON_SHIELD
            || player.getEquipment().get(Equipment_1.Equipment.SHIELD_SLOT).getId() == ItemIdentifiers_1.ItemIdentifiers.DRAGONFIRE_SHIELD;
    };
    CombatEquipment.MAGE_VOID_HELM = 11663;
    CombatEquipment.RANGED_VOID_HELM = 11664;
    CombatEquipment.MELEE_VOID_HELM = 11665;
    CombatEquipment.VOID_ARMOUR = [
        Equipment_1.Equipment.BODY_SLOT, 8839,
        Equipment_1.Equipment.LEG_SLOT, 8840,
        Equipment_1.Equipment.HANDS_SLOT, 8842
    ];
    CombatEquipment.OBSIDIAN_WEAPONS = [
        746, 747, 6523, 6525, 6526, 6527, 6528
    ];
    CombatEquipment.VOID_KNIGHT_DEFLECTOR = 19712;
    return CombatEquipment;
}());
//# sourceMappingURL=CombatEquipment.js.map