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
exports.RangedWeapon = exports.RangedWeaponType = exports.Ammunition = exports.RangedData = void 0;
var CombatEquipment_1 = require("../CombatEquipment");
var CombatFactory_1 = require("../CombatFactory");
var Graphic_1 = require("../../../model/Graphic");
var GraphicHeight_1 = require("../../../model/GraphicHeight");
var Skill_1 = require("../../../model/Skill");
var Equipment_1 = require("../../../model/container/impl/Equipment");
var CombatPoisonEffect_1 = require("../../../task/impl/CombatPoisonEffect");
var ItemIdentifiers_1 = require("../../../../util/ItemIdentifiers");
var Misc_1 = require("../../../../util/Misc");
var FightType_1 = require("../FightType");
var RangedData = exports.RangedData = /** @class */ (function () {
    function RangedData() {
    }
    RangedData.getSpecialEffectsMultiplier = function (p, target, damage) {
        var multiplier = 1.0;
        // Todo: ENCHANTED_RUBY_BOLT
        switch (p.getCombat().getAmmunition()) {
            case Ammunition.ENCHANTED_DIAMOND_BOLT:
                target.performGraphic(new Graphic_1.Graphic(758, GraphicHeight_1.GraphicHeight.MIDDLE));
                multiplier = 1.15;
                break;
            case Ammunition.ENCHANTED_DRAGONSTONE_DRAGON_BOLT:
            case Ammunition.ENCHANTED_DRAGON_BOLT:
                var multiply = true;
                if (target.isPlayer()) {
                    var t = target.getAsPlayer();
                    multiply = !(!t.getCombat().getFireImmunityTimer().finished() || CombatEquipment_1.CombatEquipment.hasDragonProtectionGear(t));
                }
                if (multiply) {
                    target.performGraphic(new Graphic_1.Graphic(756));
                    multiplier = 1.31;
                }
                break;
            case Ammunition.ENCHANTED_EMERALD_BOLT:
                target.performGraphic(new Graphic_1.Graphic(752));
                CombatFactory_1.CombatFactory.poisonEntity(target, CombatPoisonEffect_1.PoisonType.MILD);
                break;
            case Ammunition.ENCHANTED_JADE_BOLT:
                target.performGraphic(new Graphic_1.Graphic(755));
                multiplier = 1.05;
                break;
            case Ammunition.ENCHANTED_ONYX_BOLT:
                target.performGraphic(new Graphic_1.Graphic(753));
                multiplier = 1.26;
                var heal = Math.floor(damage * 0.25) + 10;
                p.getSkillManager().setCurrentLevels(Skill_1.Skill.HITPOINTS, p.getSkillManager().getCurrentLevel(Skill_1.Skill.HITPOINTS) + heal);
                if (p.getSkillManager().getCurrentLevel(Skill_1.Skill.HITPOINTS) >= 1120) {
                    p.getSkillManager().setCurrentLevels(Skill_1.Skill.HITPOINTS, 1120);
                }
                p.getSkillManager().updateSkill(Skill_1.Skill.HITPOINTS);
                if (damage < 250 && Misc_1.Misc.getRandom(3) <= 1) {
                    damage += 150 + Misc_1.Misc.getRandom(80);
                }
                break;
            case Ammunition.ENCHANTED_PEARL_BOLT:
                target.performGraphic(new Graphic_1.Graphic(750));
                multiplier = 1.1;
                break;
            case Ammunition.ENCHANTED_RUBY_BOLT:
                break;
            case Ammunition.ENCHANTED_SAPPHIRE_BOLT:
                target.performGraphic(new Graphic_1.Graphic(751));
                if (target.isPlayer()) {
                    var t = target.getAsPlayer();
                    t.getSkillManager().setCurrentLevels(Skill_1.Skill.PRAYER, t.getSkillManager().getCurrentLevel(Skill_1.Skill.PRAYER) - 20);
                    if (t.getSkillManager().getCurrentLevel(Skill_1.Skill.PRAYER) < 0) {
                        t.getSkillManager().setCurrentLevels(Skill_1.Skill.PRAYER, 0);
                    }
                    t.getPacketSender().sendMessage("Your Prayer level has been leeched.");
                    p.getSkillManager().setCurrentLevels(Skill_1.Skill.PRAYER, t.getSkillManager().getCurrentLevel(Skill_1.Skill.PRAYER) + 20);
                    if (p.getSkillManager().getCurrentLevel(Skill_1.Skill.PRAYER) > p.getSkillManager().getMaxLevel(Skill_1.Skill.PRAYER)) {
                        p.getSkillManager().setCurrentLevels(Skill_1.Skill.PRAYER, p.getSkillManager().getMaxLevel(Skill_1.Skill.PRAYER));
                    }
                    else {
                        p.getPacketSender().sendMessage("Your enchanced bolts leech some Prayer points from your opponent..");
                    }
                }
                break;
            case Ammunition.ENCHANTED_TOPAZ_BOLT:
                target.performGraphic(new Graphic_1.Graphic(757));
                if (target.isPlayer()) {
                    var t = target.getAsPlayer();
                    t.getSkillManager().setCurrentLevels(Skill_1.Skill.MAGIC, t.getSkillManager().getCurrentLevel(Skill_1.Skill.MAGIC) - 3);
                    t.getPacketSender().sendMessage("Your Magic level has been reduced.");
                }
                break;
            case Ammunition.ENCHANTED_OPAL_BOLT:
                target.performGraphic(new Graphic_1.Graphic(749));
                multiplier = 1.3;
                break;
        }
        return multiplier;
    };
    /**
  * A map of items and their respective interfaces.
  */
    RangedData.rangedWeapons = new Map();
    RangedData.rangedAmmunition = new Map();
    return RangedData;
}());
var Ammunition = exports.Ammunition = /** @class */ (function () {
    function Ammunition(itemId, startGfx, projectileId, strength) {
        Ammunition.itemId = itemId;
        Ammunition.startGfx = startGfx;
        Ammunition.projectileId = projectileId;
        Ammunition.strength = strength;
    }
    Ammunition.getFor = function (p) {
        // First try to get a throw weapon as ammo
        var weapon = p.getEquipment().getItems()[Equipment_1.Equipment.WEAPON_SLOT].getId();
        var throwWeapon = Ammunition.rangedAmmunition.get(weapon);
        // Toxic blowpipe should always fire dragon darts.
        if (weapon === 12926) {
            return Ammunition.DRAGON_DART;
        }
        // Didn't find one. Try arrows
        if (throwWeapon == null) {
            return Ammunition.rangedAmmunition.get(p.getEquipment().getItems()[Equipment_1.Equipment.AMMUNITION_SLOT].getId());
        }
        return throwWeapon;
    };
    Ammunition.getForItem = function (item) {
        // First try to get a throw weapon as ammo
        var throwWeapon = Ammunition.rangedAmmunition.get(item);
        // Didn't find one. Try arrows
        if (throwWeapon == null) {
            return Ammunition.rangedAmmunition.get(item);
        }
        return throwWeapon;
    };
    Ammunition.prototype.getItemId = function () {
        return Ammunition.itemId;
    };
    Ammunition.prototype.getStartGraphic = function () {
        return Ammunition.startGfx;
    };
    Ammunition.prototype.getProjectileId = function () {
        return Ammunition.projectileId;
    };
    Ammunition.prototype.getStrength = function () {
        return Ammunition.strength;
    };
    Ammunition.prototype.dropOnFloor = function () {
        return !Ammunition.NO_GROUND_DROP.add(this);
    };
    Ammunition.BRONZE_ARROW = new Ammunition(882, new Graphic_1.Graphic(19, GraphicHeight_1.GraphicHeight.HIGH), 10, 7);
    Ammunition.IRON_ARROW = new Ammunition(884, new Graphic_1.Graphic(18, GraphicHeight_1.GraphicHeight.HIGH), 9, 10);
    Ammunition.STEEL_ARROW = new Ammunition(886, new Graphic_1.Graphic(20, GraphicHeight_1.GraphicHeight.HIGH), 11, 16);
    Ammunition.MITHRIL_ARROW = new Ammunition(888, new Graphic_1.Graphic(21, GraphicHeight_1.GraphicHeight.HIGH), 12, 22);
    Ammunition.ADAMANT_ARROW = new Ammunition(890, new Graphic_1.Graphic(22, GraphicHeight_1.GraphicHeight.HIGH), 13, 31);
    Ammunition.RUNE_ARROW = new Ammunition(892, new Graphic_1.Graphic(24, GraphicHeight_1.GraphicHeight.HIGH), 15, 50);
    Ammunition.ICE_ARROW = new Ammunition(78, new Graphic_1.Graphic(25, GraphicHeight_1.GraphicHeight.HIGH), 16, 58);
    Ammunition.BROAD_ARROW = new Ammunition(4160, new Graphic_1.Graphic(20, GraphicHeight_1.GraphicHeight.HIGH), 11, 58);
    Ammunition.DRAGON_ARROW = new Ammunition(11212, new Graphic_1.Graphic(1111, GraphicHeight_1.GraphicHeight.HIGH), 1120, 65);
    Ammunition.BRONZE_BOLT = new Ammunition(877, new Graphic_1.Graphic(955, GraphicHeight_1.GraphicHeight.HIGH), 27, 13);
    Ammunition.OPAL_BOLT = new Ammunition(879, new Graphic_1.Graphic(955, GraphicHeight_1.GraphicHeight.HIGH), 27, 20);
    Ammunition.ENCHANTED_OPAL_BOLT = new Ammunition(9236, new Graphic_1.Graphic(955, GraphicHeight_1.GraphicHeight.HIGH), 27, 20);
    Ammunition.IRON_BOLT = new Ammunition(9140, new Graphic_1.Graphic(955, GraphicHeight_1.GraphicHeight.HIGH), 27, 28);
    Ammunition.JADE_BOLT = new Ammunition(9335, new Graphic_1.Graphic(955, GraphicHeight_1.GraphicHeight.HIGH), 27, 31);
    Ammunition.ENCHANTED_JADE_BOLT = new Ammunition(9237, new Graphic_1.Graphic(955, GraphicHeight_1.GraphicHeight.HIGH), 27, 31);
    Ammunition.STEEL_BOLT = new Ammunition(9141, new Graphic_1.Graphic(955, GraphicHeight_1.GraphicHeight.HIGH), 27, 35);
    Ammunition.PEARL_BOLT = new Ammunition(880, new Graphic_1.Graphic(955, GraphicHeight_1.GraphicHeight.HIGH), 27, 38);
    Ammunition.ENCHANTED_PEARL_BOLT = new Ammunition(9238, new Graphic_1.Graphic(955, GraphicHeight_1.GraphicHeight.HIGH), 27, 38);
    Ammunition.MITHRIL_BOLT = new Ammunition(9142, new Graphic_1.Graphic(955, GraphicHeight_1.GraphicHeight.HIGH), 27, 40);
    Ammunition.TOPAZ_BOLT = new Ammunition(9336, new Graphic_1.Graphic(955, GraphicHeight_1.GraphicHeight.HIGH), 27, 50);
    Ammunition.ENCHANTED_TOPAZ_BOLT = new Ammunition(9239, new Graphic_1.Graphic(955, GraphicHeight_1.GraphicHeight.HIGH), 27, 50);
    Ammunition.ADAMANT_BOLT = new Ammunition(9143, new Graphic_1.Graphic(955, GraphicHeight_1.GraphicHeight.HIGH), 27, 60);
    Ammunition.SAPPHIRE_BOLT = new Ammunition(9337, new Graphic_1.Graphic(955, GraphicHeight_1.GraphicHeight.HIGH), 27, 65);
    Ammunition.ENCHANTED_SAPPHIRE_BOLT = new Ammunition(9240, new Graphic_1.Graphic(955, GraphicHeight_1.GraphicHeight.HIGH), 27, 65);
    Ammunition.EMERALD_BOLT = new Ammunition(9338, new Graphic_1.Graphic(955, GraphicHeight_1.GraphicHeight.HIGH), 27, 70);
    Ammunition.ENCHANTED_EMERALD_BOLT = new Ammunition(9241, new Graphic_1.Graphic(955, GraphicHeight_1.GraphicHeight.HIGH), 27, 70);
    Ammunition.RUBY_BOLT = new Ammunition(9339, new Graphic_1.Graphic(955, GraphicHeight_1.GraphicHeight.HIGH), 27, 75);
    Ammunition.ENCHANTED_RUBY_BOLT = new Ammunition(9242, new Graphic_1.Graphic(955, GraphicHeight_1.GraphicHeight.HIGH), 27, 75);
    Ammunition.BROAD_BOLT = new Ammunition(13280, new Graphic_1.Graphic(955, GraphicHeight_1.GraphicHeight.HIGH), 27, 100);
    Ammunition.RUNITE_BOLT = new Ammunition(9144, new Graphic_1.Graphic(955, GraphicHeight_1.GraphicHeight.HIGH), 27, 115);
    Ammunition.DIAMOND_BOLT = new Ammunition(9340, new Graphic_1.Graphic(955, GraphicHeight_1.GraphicHeight.HIGH), 27, 105);
    Ammunition.ENCHANTED_DIAMOND_BOLT = new Ammunition(9243, new Graphic_1.Graphic(955, GraphicHeight_1.GraphicHeight.HIGH), 27, 105);
    Ammunition.DRAGON_BOLT = new Ammunition(9341, new Graphic_1.Graphic(955, GraphicHeight_1.GraphicHeight.HIGH), 27, 117);
    Ammunition.ENCHANTED_DRAGON_BOLT = new Ammunition(9244, new Graphic_1.Graphic(955, GraphicHeight_1.GraphicHeight.HIGH), 27, 117);
    Ammunition.ONYX_BOLT = new Ammunition(9342, new Graphic_1.Graphic(955, GraphicHeight_1.GraphicHeight.HIGH), 27, 120);
    Ammunition.ENCHANTED_ONYX_BOLT = new Ammunition(9245, new Graphic_1.Graphic(955, GraphicHeight_1.GraphicHeight.HIGH), 27, 120);
    Ammunition.ENCHANTED_DRAGONSTONE_DRAGON_BOLT = new Ammunition(ItemIdentifiers_1.ItemIdentifiers.DRAGONSTONE_DRAGON_BOLTS_E_, new Graphic_1.Graphic(955, GraphicHeight_1.GraphicHeight.HIGH), 27, 122);
    Ammunition.BRONZE_DART = new Ammunition(806, new Graphic_1.Graphic(232, GraphicHeight_1.GraphicHeight.HIGH), 226, 1);
    Ammunition.IRON_DART = new Ammunition(807, new Graphic_1.Graphic(233, GraphicHeight_1.GraphicHeight.HIGH), 227, 4);
    Ammunition.STEEL_DART = new Ammunition(808, new Graphic_1.Graphic(234, GraphicHeight_1.GraphicHeight.HIGH), 228, 6);
    Ammunition.MITHRIL_DART = new Ammunition(809, new Graphic_1.Graphic(235, GraphicHeight_1.GraphicHeight.HIGH), 229, 8);
    Ammunition.ADAMANT_DART = new Ammunition(810, new Graphic_1.Graphic(236, GraphicHeight_1.GraphicHeight.HIGH), 230, 13);
    Ammunition.RUNE_DART = new Ammunition(811, new Graphic_1.Graphic(237, GraphicHeight_1.GraphicHeight.HIGH), 231, 17);
    Ammunition.DRAGON_DART = new Ammunition(11230, new Graphic_1.Graphic(1123, GraphicHeight_1.GraphicHeight.HIGH), 226, 24);
    Ammunition.BRONZE_KNIFE = new Ammunition(864, new Graphic_1.Graphic(219, GraphicHeight_1.GraphicHeight.HIGH), 212, 3);
    Ammunition.BRONZE_KNIFE_P1 = new Ammunition(870, new Graphic_1.Graphic(219, GraphicHeight_1.GraphicHeight.HIGH), 212, 3);
    Ammunition.BRONZE_KNIFE_P2 = new Ammunition(5654, new Graphic_1.Graphic(219, GraphicHeight_1.GraphicHeight.HIGH), 212, 3);
    Ammunition.BRONZE_KNIFE_P3 = new Ammunition(5661, new Graphic_1.Graphic(219, GraphicHeight_1.GraphicHeight.HIGH), 212, 3);
    Ammunition.IRON_KNIFE = new Ammunition(863, new Graphic_1.Graphic(220, GraphicHeight_1.GraphicHeight.HIGH), 213, 4);
    Ammunition.IRON_KNIFE_P1 = new Ammunition(871, new Graphic_1.Graphic(220, GraphicHeight_1.GraphicHeight.HIGH), 213, 4);
    Ammunition.IRON_KNIFE_P2 = new Ammunition(5655, new Graphic_1.Graphic(220, GraphicHeight_1.GraphicHeight.HIGH), 213, 4);
    Ammunition.IRON_KNIFE_P3 = new Ammunition(5662, new Graphic_1.Graphic(220, GraphicHeight_1.GraphicHeight.HIGH), 213, 4);
    Ammunition.STEEL_KNIFE = new Ammunition(865, new Graphic_1.Graphic(221, GraphicHeight_1.GraphicHeight.HIGH), 214, 7);
    Ammunition.STEEL_KNIFE_P1 = new Ammunition(872, new Graphic_1.Graphic(221, GraphicHeight_1.GraphicHeight.HIGH), 214, 7);
    Ammunition.STEEL_KNIFE_P2 = new Ammunition(5656, new Graphic_1.Graphic(221, GraphicHeight_1.GraphicHeight.HIGH), 214, 7);
    Ammunition.STEEL_KNIFE_P3 = new Ammunition(5663, new Graphic_1.Graphic(221, GraphicHeight_1.GraphicHeight.HIGH), 214, 7);
    Ammunition.BLACK_KNIFE = new Ammunition(869, new Graphic_1.Graphic(222, GraphicHeight_1.GraphicHeight.HIGH), 215, 8);
    Ammunition.BLACK_KNIFE_P1 = new Ammunition(874, new Graphic_1.Graphic(222, GraphicHeight_1.GraphicHeight.HIGH), 215, 8);
    Ammunition.BLACK_KNIFE_P2 = new Ammunition(5658, new Graphic_1.Graphic(222, GraphicHeight_1.GraphicHeight.HIGH), 215, 8);
    Ammunition.BLACK_KNIFE_P3 = new Ammunition(5665, new Graphic_1.Graphic(222, GraphicHeight_1.GraphicHeight.HIGH), 215, 8);
    Ammunition.MITHRIL_KNIFE = new Ammunition(866, new Graphic_1.Graphic(223, GraphicHeight_1.GraphicHeight.HIGH), 215, 10);
    Ammunition.MITHRIL_KNIFE_P1 = new Ammunition(873, new Graphic_1.Graphic(223, GraphicHeight_1.GraphicHeight.HIGH), 215, 10);
    Ammunition.MITHRIL_KNIFE_P2 = new Ammunition(5657, new Graphic_1.Graphic(223, GraphicHeight_1.GraphicHeight.HIGH), 215, 10);
    Ammunition.MITHRIL_KNIFE_P3 = new Ammunition(5664, new Graphic_1.Graphic(223, GraphicHeight_1.GraphicHeight.HIGH), 215, 10);
    Ammunition.ADAMANT_KNIFE = new Ammunition(867, new Graphic_1.Graphic(224, GraphicHeight_1.GraphicHeight.HIGH), 217, 14);
    Ammunition.ADAMANT_KNIFE_P1 = new Ammunition(875, new Graphic_1.Graphic(224, GraphicHeight_1.GraphicHeight.HIGH), 217, 14);
    Ammunition.ADAMANT_KNIFE_P2 = new Ammunition(5659, new Graphic_1.Graphic(224, GraphicHeight_1.GraphicHeight.HIGH), 217, 14);
    Ammunition.ADAMANT_KNIFE_P3 = new Ammunition(5666, new Graphic_1.Graphic(224, GraphicHeight_1.GraphicHeight.HIGH), 217, 14);
    Ammunition.RUNE_KNIFE = new Ammunition(868, new Graphic_1.Graphic(225, GraphicHeight_1.GraphicHeight.HIGH), 218, 24);
    Ammunition.RUNE_KNIFE_P1 = new Ammunition(876, new Graphic_1.Graphic(225, GraphicHeight_1.GraphicHeight.HIGH), 218, 24);
    Ammunition.RUNE_KNIFE_P2 = new Ammunition(5660, new Graphic_1.Graphic(225, GraphicHeight_1.GraphicHeight.HIGH), 218, 24);
    Ammunition.RUNE_KNIFE_P3 = new Ammunition(5667, new Graphic_1.Graphic(225, GraphicHeight_1.GraphicHeight.HIGH), 218, 24);
    Ammunition.BRONZE_JAVELIN = new Ammunition(825, null, 200, 25);
    Ammunition.IRON_JAVELIN = new Ammunition(826, null, 201, 42);
    Ammunition.STEEL_JAVELIN = new Ammunition(827, null, 202, 64);
    Ammunition.MITHRIL_JAVELIN = new Ammunition(828, null, 203, 85);
    Ammunition.ADAMANT_JAVELIN = new Ammunition(829, null, 204, 107);
    Ammunition.RUNE_JAVELIN = new Ammunition(830, null, 205, 124);
    Ammunition.DRAGON_JAVELIN = new Ammunition(19484, null, 1301, 150);
    Ammunition.TOKTZ_XIL_UL = new Ammunition(6522, null, 442, 58);
    Ammunition.BOLT_RACK = new Ammunition(4740, null, 27, 55);
    Ammunition.NO_GROUND_DROP = new Set([
        Ammunition.BRONZE_JAVELIN,
        Ammunition.IRON_JAVELIN,
        Ammunition.STEEL_JAVELIN,
        Ammunition.ADAMANT_JAVELIN,
        Ammunition.RUNE_JAVELIN,
        Ammunition.DRAGON_JAVELIN
    ]);
    Ammunition.rangedAmmunition = new Map();
    (function () {
        var e_1, _a;
        try {
            for (var _b = __values(Object.values(Ammunition)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var data = _c.value;
                Ammunition.rangedAmmunition.set(data.getItemId(), data);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    })();
    return Ammunition;
}());
var RangedWeaponType = exports.RangedWeaponType = /** @class */ (function () {
    function RangedWeaponType(defaultDistance, longRangeDistance, longRangeFightType) {
        RangedWeaponType.defaultDistance = defaultDistance;
        RangedWeaponType.longRangeDistance = longRangeDistance;
        RangedWeaponType.longRangeFightType = longRangeFightType;
    }
    RangedWeaponType.prototype.getDefaultDistance = function () {
        return RangedWeaponType.defaultDistance;
    };
    RangedWeaponType.prototype.getLongRangeDistance = function () {
        return RangedWeaponType.longRangeDistance;
    };
    RangedWeaponType.prototype.getLongRangeFightType = function () {
        return RangedWeaponType.longRangeFightType;
    };
    RangedWeaponType.KNIFE = new RangedWeaponType(4, 6, FightType_1.FightType.KNIFE_LONGRANGE);
    RangedWeaponType.DART = new RangedWeaponType(3, 5, FightType_1.FightType.DART_LONGRANGE);
    RangedWeaponType.TOKTZ_XIL_UL = new RangedWeaponType(5, 6, FightType_1.FightType.OBBY_RING_LONGRANGE);
    RangedWeaponType.LONGBOW = new RangedWeaponType(9, 10, FightType_1.FightType.LONGBOW_LONGRANGE);
    RangedWeaponType.BLOWPIPE = new RangedWeaponType(5, 7, FightType_1.FightType.BLOWPIPE_LONGRANGE);
    RangedWeaponType.SHORTBOW = new RangedWeaponType(7, 9, FightType_1.FightType.SHORTBOW_LONGRANGE);
    RangedWeaponType.CROSSBOW = new RangedWeaponType(7, 9, FightType_1.FightType.CROSSBOW_LONGRANGE);
    RangedWeaponType.BALLISTA = new RangedWeaponType(7, 9, FightType_1.FightType.BALLISTA_LONGRANGE);
    return RangedWeaponType;
}());
var RangedWeapon = exports.RangedWeapon = /** @class */ (function () {
    function RangedWeapon(weaponIds, ammunitionData, type) {
        this.weaponIds = weaponIds;
        this.ammunitionData = ammunitionData;
        this.type = type;
    }
    RangedWeapon.getFor = function (p) {
        var weapon = p.getEquipment().getItems()[Equipment_1.Equipment.WEAPON_SLOT].getId();
        return RangedWeapon.rangedWeapons.get(weapon);
    };
    RangedWeapon.prototype.getWeaponIds = function () {
        return this.weaponIds;
    };
    RangedWeapon.prototype.getAmmunitionData = function () {
        return this.ammunitionData;
    };
    RangedWeapon.prototype.getType = function () {
        return this.type;
    };
    RangedWeapon.LONGBOW = new RangedWeapon([839], [Ammunition.BRONZE_ARROW], RangedWeaponType.LONGBOW);
    RangedWeapon.SHORTBOW = new RangedWeapon([841], [Ammunition.BRONZE_ARROW], RangedWeaponType.SHORTBOW);
    RangedWeapon.OAK_LONGBOW = new RangedWeapon([845], [Ammunition.BRONZE_ARROW, Ammunition.IRON_ARROW, Ammunition.STEEL_ARROW], RangedWeaponType.LONGBOW);
    RangedWeapon.OAK_SHORTBOW = new RangedWeapon([843], [Ammunition.BRONZE_ARROW, Ammunition.IRON_ARROW, Ammunition.STEEL_ARROW], RangedWeaponType.SHORTBOW);
    RangedWeapon.WILLOW_LONGBOW = new RangedWeapon([847], [Ammunition.BRONZE_ARROW, Ammunition.IRON_ARROW, Ammunition.STEEL_ARROW, Ammunition.MITHRIL_ARROW], RangedWeaponType.LONGBOW);
    RangedWeapon.WILLOW_SHORTBOW = new RangedWeapon([849], [Ammunition.BRONZE_ARROW, Ammunition.IRON_ARROW, Ammunition.STEEL_ARROW, Ammunition.MITHRIL_ARROW], RangedWeaponType.SHORTBOW);
    RangedWeapon.MAPLE_LONGBOW = new RangedWeapon([851], [Ammunition.BRONZE_ARROW, Ammunition.IRON_ARROW, Ammunition.STEEL_ARROW, Ammunition.MITHRIL_ARROW, Ammunition.ADAMANT_ARROW], RangedWeaponType.LONGBOW);
    RangedWeapon.MAPLE_SHORTBOW = new RangedWeapon([853], [Ammunition.BRONZE_ARROW, Ammunition.IRON_ARROW, Ammunition.STEEL_ARROW, Ammunition.MITHRIL_ARROW, Ammunition.ADAMANT_ARROW], RangedWeaponType.SHORTBOW);
    RangedWeapon.YEW_LONGBOW = new RangedWeapon([855], [Ammunition.BRONZE_ARROW, Ammunition.IRON_ARROW, Ammunition.STEEL_ARROW, Ammunition.MITHRIL_ARROW, Ammunition.ADAMANT_ARROW, Ammunition.RUNE_ARROW, Ammunition.ICE_ARROW], RangedWeaponType.LONGBOW);
    RangedWeapon.YEW_SHORTBOW = new RangedWeapon([857], [Ammunition.BRONZE_ARROW, Ammunition.IRON_ARROW, Ammunition.STEEL_ARROW, Ammunition.MITHRIL_ARROW, Ammunition.ADAMANT_ARROW, Ammunition.RUNE_ARROW, Ammunition.ICE_ARROW], RangedWeaponType.SHORTBOW);
    RangedWeapon.MAGIC_LONGBOW = new RangedWeapon([859], [Ammunition.BRONZE_ARROW, Ammunition.IRON_ARROW, Ammunition.STEEL_ARROW, Ammunition.MITHRIL_ARROW, Ammunition.ADAMANT_ARROW, Ammunition.RUNE_ARROW, Ammunition.ICE_ARROW, Ammunition.BROAD_ARROW], RangedWeaponType.LONGBOW);
    RangedWeapon.MAGIC_SHORTBOW = new RangedWeapon([861, 6724], [Ammunition.BRONZE_ARROW, Ammunition.IRON_ARROW, Ammunition.STEEL_ARROW, Ammunition.MITHRIL_ARROW, Ammunition.ADAMANT_ARROW, Ammunition.RUNE_ARROW, Ammunition.ICE_ARROW, Ammunition.BROAD_ARROW], RangedWeaponType.SHORTBOW);
    RangedWeapon.GODBOW = new RangedWeapon([19143, 19149, 19146], [Ammunition.BRONZE_ARROW, Ammunition.IRON_ARROW, Ammunition.STEEL_ARROW, Ammunition.MITHRIL_ARROW, Ammunition.ADAMANT_ARROW, Ammunition.RUNE_ARROW, Ammunition.BROAD_ARROW, Ammunition.DRAGON_ARROW], RangedWeaponType.SHORTBOW);
    RangedWeapon.ZARYTE_BOW = new RangedWeapon([20171], [Ammunition.BRONZE_ARROW, Ammunition.IRON_ARROW, Ammunition.STEEL_ARROW, Ammunition.MITHRIL_ARROW, Ammunition.ADAMANT_ARROW, Ammunition.RUNE_ARROW, Ammunition.BROAD_ARROW, Ammunition.DRAGON_ARROW], RangedWeaponType.SHORTBOW);
    RangedWeapon.DARK_BOW = new RangedWeapon([11235, 13405, 15701, 15702, 15703, 15704], [Ammunition.BRONZE_ARROW, Ammunition.IRON_ARROW, Ammunition.STEEL_ARROW, Ammunition.MITHRIL_ARROW, Ammunition.ADAMANT_ARROW, Ammunition.RUNE_ARROW, Ammunition.DRAGON_ARROW], RangedWeaponType.LONGBOW);
    RangedWeapon.BRONZE_CROSSBOW = new RangedWeapon([9174], [Ammunition.BRONZE_BOLT], RangedWeaponType.CROSSBOW);
    RangedWeapon.IRON_CROSSBOW = new RangedWeapon([9177], [Ammunition.BRONZE_BOLT, Ammunition.OPAL_BOLT, Ammunition.ENCHANTED_OPAL_BOLT, Ammunition.IRON_BOLT], RangedWeaponType.CROSSBOW);
    RangedWeapon.STEEL_CROSSBOW = new RangedWeapon([9179], [Ammunition.BRONZE_BOLT, Ammunition.OPAL_BOLT, Ammunition.ENCHANTED_OPAL_BOLT, Ammunition.IRON_BOLT, Ammunition.JADE_BOLT, Ammunition.ENCHANTED_JADE_BOLT, Ammunition.STEEL_BOLT, Ammunition.PEARL_BOLT, Ammunition.ENCHANTED_PEARL_BOLT], RangedWeaponType.CROSSBOW);
    RangedWeapon.MITHRIL_CROSSBOW = new RangedWeapon([9181], [Ammunition.BRONZE_BOLT, Ammunition.OPAL_BOLT, Ammunition.ENCHANTED_OPAL_BOLT, Ammunition.IRON_BOLT, Ammunition.JADE_BOLT, Ammunition.ENCHANTED_JADE_BOLT, Ammunition.STEEL_BOLT, Ammunition.PEARL_BOLT, Ammunition.ENCHANTED_PEARL_BOLT, Ammunition.MITHRIL_BOLT, Ammunition.TOPAZ_BOLT, Ammunition.ENCHANTED_TOPAZ_BOLT], RangedWeaponType.CROSSBOW);
    RangedWeapon.ADAMANT_CROSSBOW = new RangedWeapon([9183], [Ammunition.BRONZE_BOLT, Ammunition.OPAL_BOLT, Ammunition.ENCHANTED_OPAL_BOLT, Ammunition.IRON_BOLT, Ammunition.JADE_BOLT, Ammunition.ENCHANTED_JADE_BOLT, Ammunition.STEEL_BOLT, Ammunition.PEARL_BOLT, Ammunition.ENCHANTED_PEARL_BOLT, Ammunition.MITHRIL_BOLT, Ammunition.TOPAZ_BOLT, Ammunition.ENCHANTED_TOPAZ_BOLT, Ammunition.ADAMANT_BOLT, Ammunition.SAPPHIRE_BOLT, Ammunition.ENCHANTED_SAPPHIRE_BOLT, Ammunition.EMERALD_BOLT, Ammunition.ENCHANTED_EMERALD_BOLT, Ammunition.RUBY_BOLT, Ammunition.ENCHANTED_RUBY_BOLT], RangedWeaponType.CROSSBOW);
    RangedWeapon.RUNE_CROSSBOW = new RangedWeapon([9185], [Ammunition.BRONZE_BOLT, Ammunition.OPAL_BOLT, Ammunition.ENCHANTED_OPAL_BOLT, Ammunition.IRON_BOLT, Ammunition.JADE_BOLT, Ammunition.ENCHANTED_JADE_BOLT, Ammunition.STEEL_BOLT, Ammunition.PEARL_BOLT, Ammunition.ENCHANTED_PEARL_BOLT, Ammunition.MITHRIL_BOLT, Ammunition.TOPAZ_BOLT, Ammunition.ENCHANTED_TOPAZ_BOLT, Ammunition.ADAMANT_BOLT, Ammunition.SAPPHIRE_BOLT, Ammunition.ENCHANTED_SAPPHIRE_BOLT, Ammunition.EMERALD_BOLT, Ammunition.ENCHANTED_EMERALD_BOLT, Ammunition.RUBY_BOLT, Ammunition.ENCHANTED_RUBY_BOLT, Ammunition.RUNITE_BOLT, Ammunition.BROAD_BOLT, Ammunition.DIAMOND_BOLT, Ammunition.ENCHANTED_DIAMOND_BOLT, Ammunition.ONYX_BOLT, Ammunition.ENCHANTED_ONYX_BOLT, Ammunition.DRAGON_BOLT, Ammunition.ENCHANTED_DRAGON_BOLT], RangedWeaponType.CROSSBOW);
    RangedWeapon.ARMADYL_CROSSBOW = new RangedWeapon([ItemIdentifiers_1.ItemIdentifiers.ARMADYL_CROSSBOW], [Ammunition.BRONZE_BOLT, Ammunition.OPAL_BOLT, Ammunition.ENCHANTED_OPAL_BOLT, Ammunition.IRON_BOLT, Ammunition.JADE_BOLT, Ammunition.ENCHANTED_JADE_BOLT, Ammunition.STEEL_BOLT, Ammunition.PEARL_BOLT, Ammunition.ENCHANTED_PEARL_BOLT, Ammunition.MITHRIL_BOLT, Ammunition.TOPAZ_BOLT, Ammunition.ENCHANTED_TOPAZ_BOLT, Ammunition.ADAMANT_BOLT, Ammunition.SAPPHIRE_BOLT, Ammunition.ENCHANTED_SAPPHIRE_BOLT, Ammunition.EMERALD_BOLT, Ammunition.ENCHANTED_EMERALD_BOLT, Ammunition.RUBY_BOLT, Ammunition.ENCHANTED_RUBY_BOLT, Ammunition.RUNITE_BOLT, Ammunition.BROAD_BOLT, Ammunition.DIAMOND_BOLT, Ammunition.ENCHANTED_DIAMOND_BOLT, Ammunition.ONYX_BOLT, Ammunition.ENCHANTED_ONYX_BOLT, Ammunition.DRAGON_BOLT, Ammunition.ENCHANTED_DRAGON_BOLT, Ammunition.ENCHANTED_DRAGONSTONE_DRAGON_BOLT], RangedWeaponType.CROSSBOW);
    RangedWeapon.BRONZE_DART = new RangedWeapon([806], [Ammunition.BRONZE_DART], RangedWeaponType.DART);
    RangedWeapon.IRON_DART = new RangedWeapon([807], [Ammunition.IRON_DART], RangedWeaponType.DART);
    RangedWeapon.STEEL_DART = new RangedWeapon([808], [Ammunition.STEEL_DART], RangedWeaponType.DART);
    RangedWeapon.MITHRIL_DART = new RangedWeapon([809], [Ammunition.MITHRIL_DART], RangedWeaponType.DART);
    RangedWeapon.ADAMANT_DART = new RangedWeapon([810], [Ammunition.ADAMANT_DART], RangedWeaponType.DART);
    RangedWeapon.RUNE_DART = new RangedWeapon([811], [Ammunition.RUNE_DART], RangedWeaponType.DART);
    RangedWeapon.DRAGON_DART = new RangedWeapon([11230], [(Ammunition.DRAGON_DART)], RangedWeaponType.DART);
    RangedWeapon.BRONZE_KNIFE = new RangedWeapon([864, 870, 5654], [Ammunition.BRONZE_KNIFE], RangedWeaponType.KNIFE);
    RangedWeapon.IRON_KNIFE = new RangedWeapon([863, 871, 5655], [Ammunition.IRON_KNIFE], RangedWeaponType.KNIFE);
    RangedWeapon.STEEL_KNIFE = new RangedWeapon([865, 872, 5656], [Ammunition.STEEL_KNIFE], RangedWeaponType.KNIFE);
    RangedWeapon.BLACK_KNIFE = new RangedWeapon([869, 874, 5658], [Ammunition.BLACK_KNIFE], RangedWeaponType.KNIFE);
    RangedWeapon.MITHRIL_KNIFE = new RangedWeapon([866, 873, 5657], [Ammunition.MITHRIL_KNIFE], RangedWeaponType.KNIFE);
    RangedWeapon.ADAMANT_KNIFE = new RangedWeapon([867, 875, 5659], [Ammunition.ADAMANT_KNIFE], RangedWeaponType.KNIFE);
    RangedWeapon.RUNE_KNIFE = new RangedWeapon([868, 876, 5660, 5667], [Ammunition.RUNE_KNIFE], RangedWeaponType.KNIFE);
    RangedWeapon.TOKTZ_XIL_UL = new RangedWeapon([6522], [Ammunition.TOKTZ_XIL_UL], RangedWeaponType.TOKTZ_XIL_UL);
    RangedWeapon.KARILS_CROSSBOW = new RangedWeapon([4734], [Ammunition.BOLT_RACK], RangedWeaponType.CROSSBOW);
    RangedWeapon.BALLISTA = new RangedWeapon([19478, 19481], [Ammunition.BRONZE_JAVELIN, Ammunition.IRON_JAVELIN, Ammunition.STEEL_JAVELIN, Ammunition.MITHRIL_JAVELIN, Ammunition.ADAMANT_JAVELIN, Ammunition.RUNE_JAVELIN, Ammunition.DRAGON_JAVELIN], RangedWeaponType.BALLISTA);
    RangedWeapon.TOXIC_BLOWPIPE = new RangedWeapon([12926], [Ammunition.DRAGON_DART], RangedWeaponType.BLOWPIPE);
    RangedWeapon.rangedWeapons = new Map();
    (function () {
        var e_2, _a, e_3, _b;
        try {
            for (var _c = __values(Object.values(RangedWeapon)), _d = _c.next(); !_d.done; _d = _c.next()) {
                var data = _d.value;
                try {
                    for (var _e = (e_3 = void 0, __values(data.getWeaponIds())), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var i = _f.value;
                        RangedWeapon.rangedWeapons.set(i, data);
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_2) throw e_2.error; }
        }
    })();
    return RangedWeapon;
}());
//# sourceMappingURL=RangedData.js.map