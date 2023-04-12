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
exports.BoostType = exports.PotionConsumable = void 0;
var Sound_1 = require("../Sound");
var Sounds_1 = require("../Sounds");
var Animation_1 = require("../model/Animation");
var EffectTimer_1 = require("../model/EffectTimer");
var Item_1 = require("../model/Item");
var Skill_1 = require("../model/Skill");
var TimerKey_1 = require("../../util/timers/TimerKey");
var PotionConsumable = exports.PotionConsumable = /** @class */ (function () {
    function PotionConsumable(ids) {
        this.ids = ids;
    }
    PotionConsumable.prototype.onEffects = function (player) {
        switch (this) {
            case PotionConsumable.ANTIFIRE_POTIONS:
                PotionConsumable.onAntifireEffect(player, 60 * 6);
                break;
            case PotionConsumable.ANTIPOISON_POTIONS:
                PotionConsumable.onAntipoisonEffect(player, 60 * 6);
                break;
            case PotionConsumable.COMBAT_POTIONS:
                PotionConsumable.onBasicEffect(player, Skill_1.Skill.ATTACK, BoostType.LOW);
                PotionConsumable.onBasicEffect(player, Skill_1.Skill.STRENGTH, BoostType.LOW);
                break;
            case PotionConsumable.SUPER_COMBAT_POTIONS:
                PotionConsumable.onBasicEffect(player, Skill_1.Skill.ATTACK, BoostType.SUPER);
                PotionConsumable.onBasicEffect(player, Skill_1.Skill.STRENGTH, BoostType.SUPER);
                PotionConsumable.onBasicEffect(player, Skill_1.Skill.DEFENCE, BoostType.SUPER);
                break;
            case PotionConsumable.MAGIC_POTIONS:
                PotionConsumable.onBasicEffect(player, Skill_1.Skill.MAGIC, BoostType.NORMAL);
                break;
            case PotionConsumable.SUPER_MAGIC_POTIONS:
                PotionConsumable.onBasicEffect(player, Skill_1.Skill.MAGIC, BoostType.SUPER);
                break;
        }
    };
    PotionConsumable.prototype.onEffectAttack = function (player) {
        switch (this) {
            case PotionConsumable.DEFENCE_POTIONS:
                PotionConsumable.onBasicEffect(player, Skill_1.Skill.DEFENCE, BoostType.NORMAL);
                break;
            case PotionConsumable.STRENGTH_POTIONS:
                PotionConsumable.onBasicEffect(player, Skill_1.Skill.STRENGTH, BoostType.NORMAL);
                break;
            case PotionConsumable.ATTACK_POTIONS:
                PotionConsumable.onBasicEffect(player, Skill_1.Skill.ATTACK, BoostType.NORMAL);
                break;
            case PotionConsumable.SUPER_DEFENCE_POTIONS:
                PotionConsumable.onBasicEffect(player, Skill_1.Skill.DEFENCE, BoostType.SUPER);
                break;
            case PotionConsumable.SUPER_ATTACK_POTIONS:
                PotionConsumable.onBasicEffect(player, Skill_1.Skill.ATTACK, BoostType.SUPER);
                break;
            case PotionConsumable.SUPER_STRENGTH_POTIONS:
                PotionConsumable.onBasicEffect(player, Skill_1.Skill.STRENGTH, BoostType.SUPER);
                break;
            case PotionConsumable.RANGE_POTIONS:
                PotionConsumable.onBasicEffect(player, Skill_1.Skill.RANGED, BoostType.NORMAL);
                break;
            case PotionConsumable.SUPER_RANGE_POTIONS:
                PotionConsumable.onBasicEffect(player, Skill_1.Skill.RANGED, BoostType.SUPER);
                break;
            case PotionConsumable.ZAMORAK_BREW:
                PotionConsumable.onZamorakEffect(player);
                break;
        }
    };
    PotionConsumable.drink = function (player, item, slot) {
        var potion = this.forId(item);
        if (!potion) {
            return false;
        }
        if (player.getArea() != null) {
            if (!player.getArea().canDrink(player, item)) {
                player.getPacketSender().sendMessage("You cannot use potions here.");
                return true;
            }
            if (potion === PotionConsumable.GUTHIX_REST || potion === PotionConsumable.SARADOMIN_BREW) {
                if (!player.getArea().canEat(player, item)) {
                    player.getPacketSender().sendMessage("You cannot eat here.");
                    return true;
                }
            }
        }
        // Stun
        if (player.getTimers().has(TimerKey_1.TimerKey.STUN)) {
            player.getPacketSender().sendMessage("You're currently stunned and cannot use potions.");
            return true;
        }
        if (player.getTimers().has(TimerKey_1.TimerKey.POTION)) {
            return true;
        }
        player.getTimers().registers(TimerKey_1.TimerKey.POTION, 3);
        player.getTimers().registers(TimerKey_1.TimerKey.FOOD, 3);
        player.getPacketSender().sendInterfaceRemoval();
        player.getCombat().reset();
        player.performAnimation(new Animation_1.Animation(829));
        Sounds_1.Sounds.sendSound(player, Sound_1.Sound.DRINK);
        player.getInventory().setItem(slot, this.getReplacementItem(item)).refreshItems();
        potion.onEffects(player);
        return true;
    };
    PotionConsumable.getReplacementItem = function (item) {
        var potion = this.forId(item);
        if (potion) {
            var length_1 = potion.ids.length;
            for (var index = 0; index < length_1; index++) {
                if (potion.ids[index] == item && index + 1 < length_1) {
                    return new Item_1.Item(potion.ids[index + 1]);
                }
            }
        }
        return new Item_1.Item(PotionConsumable.VIAL);
    };
    PotionConsumable.forId = function (id) {
        var e_1, _a, e_2, _b;
        try {
            for (var _c = __values(Object.values(PotionConsumable)), _d = _c.next(); !_d.done; _d = _c.next()) {
                var potion = _d.value;
                try {
                    for (var _e = (e_2 = void 0, __values(potion.ids)), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var potionId = _f.value;
                        if (id === potionId) {
                            return potion;
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                    }
                    finally { if (e_2) throw e_2.error; }
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
        return undefined;
    };
    PotionConsumable.onSaradominEffect = function (player) {
        player.getSkillManager().increaseCurrentLevelMax(Skill_1.Skill.DEFENCE, Math.floor(2 + (0.120 * player.getSkillManager().getMaxLevel(Skill_1.Skill.DEFENCE))));
        player.getSkillManager().increaseCurrentLevelMax(Skill_1.Skill.HITPOINTS, Math.floor(2 + (0.15 * player.getSkillManager().getMaxLevel(Skill_1.Skill.HITPOINTS))));
        player.getSkillManager().decreaseCurrentLevel(Skill_1.Skill.ATTACK, Math.floor(0.10 * player.getSkillManager().getMaxLevel(Skill_1.Skill.ATTACK)), -1);
        player.getSkillManager().decreaseCurrentLevel(Skill_1.Skill.STRENGTH, Math.floor(0.10 * player.getSkillManager().getCurrentLevel(Skill_1.Skill.STRENGTH)), -1);
        player.getSkillManager().decreaseCurrentLevel(Skill_1.Skill.MAGIC, Math.floor(0.10 * player.getSkillManager().getCurrentLevel(Skill_1.Skill.MAGIC)), -1);
        player.getSkillManager().decreaseCurrentLevel(Skill_1.Skill.RANGED, Math.floor(0.10 * player.getSkillManager().getCurrentLevel(Skill_1.Skill.RANGED)), -1);
    };
    PotionConsumable.onZamorakEffect = function (player) {
        player.getSkillManager().increaseCurrentLevelMax(Skill_1.Skill.ATTACK, Math.floor(2 + (0.20 * player.getSkillManager().getMaxLevel(Skill_1.Skill.ATTACK))));
        player.getSkillManager().increaseCurrentLevelMax(Skill_1.Skill.STRENGTH, Math.floor(2 + (0.12 * player.getSkillManager().getMaxLevel(Skill_1.Skill.STRENGTH))));
        player.getSkillManager().decreaseCurrentLevel(Skill_1.Skill.DEFENCE, Math.floor(2 + (0.10 * player.getSkillManager().getMaxLevel(Skill_1.Skill.DEFENCE))), -1);
        player.getSkillManager().decreaseCurrentLevel(Skill_1.Skill.HITPOINTS, Math.floor(2 + (0.10 * player.getSkillManager().getCurrentLevel(Skill_1.Skill.HITPOINTS))), 1);
        player.getSkillManager().increaseCurrentLevel(Skill_1.Skill.PRAYER, Math.floor(0.10 * player.getSkillManager().getMaxLevel(Skill_1.Skill.PRAYER)), player.getSkillManager().getMaxLevel(Skill_1.Skill.PRAYER));
    };
    PotionConsumable.onPrayerEffect = function (player, restorePotion) {
        var maxLevel = player.getSkillManager().getMaxLevel(Skill_1.Skill.PRAYER);
        var min = Math.floor((restorePotion ? 8 : 7) + (maxLevel / 4));
        player.getSkillManager().increaseCurrentLevel(Skill_1.Skill.PRAYER, min, maxLevel);
    };
    PotionConsumable.onRestoreEffect = function (player) {
        for (var index = 0; index <= 6; index++) {
            var skill = Skill_1.Skill[index];
            if ((skill == Skill_1.Skill.PRAYER) || (skill == Skill_1.Skill.HITPOINTS)) {
                continue;
            }
            var maxLevel = player.getSkillManager().getMaxLevel(skill);
            var currLevel = player.getSkillManager().getCurrentLevel(skill);
            if (currLevel < maxLevel) {
                player.getSkillManager().increaseCurrentLevel(skill, Math.floor(8 + (maxLevel / 4)), maxLevel);
            }
        }
    };
    PotionConsumable.onBasicEffect = function (player, skill, type) {
        var maxLevel = player.getSkillManager().getMaxLevel(skill);
        var boostLevel = Math.round(maxLevel * type.getAmount());
        if (type == BoostType.LOW) {
            boostLevel += 3;
        }
        var cap = maxLevel + boostLevel;
        if (maxLevel + boostLevel > player.getSkillManager().getCurrentLevel(skill)) {
            player.getSkillManager().increaseCurrentLevel(skill, boostLevel, cap);
        }
    };
    PotionConsumable.onAntifireEffect = function (player, seconds) {
        player.getCombat().getFireImmunityTimer().start(seconds);
        player.getPacketSender().sendEffectTimer(seconds, EffectTimer_1.EffectTimer.ANTIFIRE);
    };
    PotionConsumable.onAntipoisonEffect = function (player, seconds) {
        player.getCombat().getPoisonImmunityTimer().start(seconds);
        player.getPacketSender().sendMessage("You are now immune to poison for another " + seconds + " seconds.");
    };
    /**
    
    Gets the identifiers which represent this potion type.
    @return the identifiers for this potion.
    */
    PotionConsumable.prototype.getIds = function () {
        return this.ids;
    };
    PotionConsumable.ANTIFIRE_POTIONS = new PotionConsumable([2452, 2454, 2456, 2458]);
    PotionConsumable.ANTIPOISON_POTIONS = new PotionConsumable([2448, 181, 183, 185]);
    PotionConsumable.COMBAT_POTIONS = new PotionConsumable([9739, 9741, 9743, 9745]);
    PotionConsumable.SUPER_COMBAT_POTIONS = new PotionConsumable([12695, 12697, 12699, 12701]);
    PotionConsumable.MAGIC_POTIONS = new PotionConsumable([3040, 3042, 3044, 3046]);
    PotionConsumable.SUPER_MAGIC_POTIONS = new PotionConsumable([11726, 11727, 11728, 11729]);
    PotionConsumable.VIAL = 229;
    PotionConsumable.DEFENCE_POTIONS = new PotionConsumable([2432, 133, 135, 137]);
    PotionConsumable.STRENGTH_POTIONS = new PotionConsumable([113, 115, 117, 119]);
    PotionConsumable.ATTACK_POTIONS = new PotionConsumable([2428, 121, 123, 125]);
    PotionConsumable.SUPER_DEFENCE_POTIONS = new PotionConsumable([2442, 163, 165, 167]);
    PotionConsumable.SUPER_ATTACK_POTIONS = new PotionConsumable([2436, 145, 147, 149]);
    PotionConsumable.SUPER_STRENGTH_POTIONS = new PotionConsumable([2440, 157, 159, 161]);
    PotionConsumable.RANGE_POTIONS = new PotionConsumable([2444, 169, 171, 173]);
    PotionConsumable.SUPER_RANGE_POTIONS = new PotionConsumable([11722, 11723, 11724, 11725]);
    PotionConsumable.ZAMORAK_BREW = new PotionConsumable([2450, 189, 191, 193]);
    PotionConsumable.SARADOMIN_BREW = new PotionConsumable([6685, 6687, 6689, 6691]);
    PotionConsumable.GUTHIX_REST = new PotionConsumable([4417, 4419, 4421, 4423, 1980]);
    PotionConsumable.SUPER_RESTORE_POTIONS = new PotionConsumable([3024, 3026, 3028, 3030]);
    PotionConsumable.PRAYER_POTIONS = new PotionConsumable([2434, 139, 141, 143]);
    return PotionConsumable;
}());
var BoostType = exports.BoostType = /** @class */ (function () {
    /**
     * Creates a new {@link BoostType}.
     *
     * @param boostAmount
     *            the amount this type will boost by.
     */
    function BoostType(boostAmount) {
        this.amount = boostAmount;
    }
    /**
     * Gets the amount this type will boost by.
     *
     * @return the boost amount.
     */
    BoostType.prototype.getAmount = function () {
        return this.amount;
    };
    BoostType.LOW = new BoostType(0.10);
    BoostType.NORMAL = new BoostType(0.13);
    BoostType.SUPER = new BoostType(0.19);
    return BoostType;
}());
//# sourceMappingURL=PotionConsumable.js.map