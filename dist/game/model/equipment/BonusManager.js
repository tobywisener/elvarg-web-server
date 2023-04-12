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
exports.BonusManager = void 0;
var ItemDefinition_1 = require("../../definition/ItemDefinition");
var DamageFormulas_1 = require("../../content/combat/formula/DamageFormulas");
var RangedData_1 = require("../../content/combat/ranged/RangedData");
var RangedData_2 = require("../../content/combat/ranged/RangedData");
var BonusManager = exports.BonusManager = /** @class */ (function () {
    function BonusManager() {
        this.attackBonus = new Array(5);
        this.defenceBonus = new Array(5);
        this.otherBonus = new Array(4);
    }
    BonusManager.open = function (player) {
        player.getPacketSender().sendInterface(BonusManager.INTERFACE_ID);
        BonusManager.update(player);
    };
    BonusManager.update = function (player) {
        var e_1, _a;
        var totalBonuses = BonusManager.STRING_ID.length;
        var bonuses = new Array(totalBonuses);
        try {
            for (var _b = __values(player.getEquipment().getItems()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var item = _c.value;
                var definition = ItemDefinition_1.ItemDefinition.forId(item.getId());
                if (definition.getBonuses() != null) {
                    for (var i = 0; i < definition.getBonuses().length; i++) {
                        if (i == 11 && bonuses[i] != 0) {
                            continue;
                        }
                        bonuses[i] += definition.getBonuses()[i];
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
        for (var i = 0; i < totalBonuses; i++) {
            if (i <= 4) {
                player.getBonusManager().attackBonus[i] = bonuses[i];
            }
            else if (i <= 9) {
                var index = i - 5;
                player.getBonusManager().defenceBonus[index] = bonuses[i];
            }
            else {
                var index = i - 10;
                player.getBonusManager().otherBonus[index] = bonuses[i];
            }
            player.getPacketSender().sendString(BonusManager.STRING_ID[i][1] + ": " + bonuses[i], Number.parseInt(BonusManager.STRING_ID[i][0]));
        }
        /**
         * Update maxhit frames on the interface.
         */
        if (player.getInterfaceId() == BonusManager.INTERFACE_ID) {
            // Update some combat data first,
            // including ranged ammunition/weapon
            player.getCombat().setAmmunition(RangedData_2.Ammunition.getFor(player));
            player.getCombat().setRangedWeapon(RangedData_1.RangedWeapon.getFor(player));
            player.getPacketSender().sendString("Melee maxhit: " + this.getDamageString(DamageFormulas_1.DamageFormulas.calculateMaxMeleeHit(player)), BonusManager.MELEE_MAXHIT_FRAME);
            player.getPacketSender().sendString("Ranged maxhit: " + this.getDamageString(DamageFormulas_1.DamageFormulas.calculateMaxRangedHit(player)), BonusManager.RANGED_MAXHIT_FRAME);
            player.getPacketSender().sendString("Magic maxhit: " + this.getDamageString(DamageFormulas_1.DamageFormulas.getMagicMaxhit(player)), BonusManager.MAGIC_MAXHIT_FRAME);
        }
    };
    BonusManager.getDamageString = function (damage) {
        if (damage == 0) {
            return "---";
        }
        if (damage <= 10) {
            return "@red@" + damage;
        }
        if (damage <= 25) {
            return "@yel@" + damage;
        }
        return "@gre@" + damage;
    };
    BonusManager.prototype.getAttackBonus = function () {
        return this.attackBonus;
    };
    BonusManager.prototype.getDefenceBonus = function () {
        return this.defenceBonus;
    };
    BonusManager.prototype.getOtherBonus = function () {
        return this.otherBonus;
    };
    BonusManager.ATTACK_STAB = 0;
    BonusManager.ATTACK_SLASH = 1;
    BonusManager.ATTACK_CRUSH = 2;
    BonusManager.ATTACK_MAGIC = 3;
    BonusManager.ATTACK_RANGE = 4;
    BonusManager.DEFENCE_STAB = 0;
    BonusManager.DEFENCE_SLASH = 1;
    BonusManager.DEFENCE_CRUSH = 2;
    BonusManager.DEFENCE_MAGIC = 3;
    BonusManager.DEFENCE_RANGE = 4;
    BonusManager.STRENGTH = 0;
    BonusManager.RANGED_STRENGTH = 1;
    BonusManager.MAGIC_STRENGTH = 2;
    BonusManager.PRAYER = 3;
    BonusManager.INTERFACE_ID = 15106;
    BonusManager.STRING_ID = [["1675", "Stab"],
        ["1676", "Slash"],
        ["1677", "Crush"],
        ["1678", "Magic"],
        ["1679", "Range"],
        ["1680", "Stab"],
        ["1681", "Slash"],
        ["1682", "Crush"],
        ["1683", "Magic"],
        ["1684", "Range"],
        ["1686", "Strength"],
        ["15118", "Ranged Strength"],
        ["1671", "Magic Strength"],
        ["1687", "Prayer"],
    ];
    BonusManager.MELEE_MAXHIT_FRAME = 15115;
    BonusManager.RANGED_MAXHIT_FRAME = 15116;
    BonusManager.MAGIC_MAXHIT_FRAME = 15117;
    return BonusManager;
}());
//# sourceMappingURL=BonusManager.js.map