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
exports.EnemyDefenseAwareCombatSwitch = void 0;
var PrayerHandler_1 = require("../../../../content/PrayerHandler");
var CombatType_1 = require("../../../../content/combat/CombatType");
var AccuracyFormulasDpsCalc_1 = require("../../../../content/combat/formula/AccuracyFormulasDpsCalc");
var DamageFormulas_1 = require("../../../../content/combat/formula/DamageFormulas");
var BonusManager_1 = require("../../../../model/equipment/BonusManager");
var EnemyDefenseAwareCombatSwitch = /** @class */ (function () {
    function EnemyDefenseAwareCombatSwitch(styleSwitches, execFunc) {
        this.execFunc = execFunc;
        this.styleSwitches = styleSwitches;
    }
    EnemyDefenseAwareCombatSwitch.prototype.shouldPerform = function (playerBot, enemy) {
        return this.execFunc();
    };
    EnemyDefenseAwareCombatSwitch.prototype.stopAfter = function () {
        return false;
    };
    EnemyDefenseAwareCombatSwitch.prototype.perform = function (playerBot, enemy) {
        var e_1, _a;
        var bestSwitch = null;
        var bestDps = 0.0;
        try {
            for (var _b = __values(this.styleSwitches), _c = _b.next(); !_c.done; _c = _b.next()) {
                var styleSwitch = _c.value;
                if (!styleSwitch.getCombatSwitch().shouldPerform(playerBot, enemy)) {
                    continue;
                }
                var defenseRoll = 1;
                var maxHit = styleSwitch.getMaxHit();
                if (styleSwitch.getCombatType() == CombatType_1.CombatType.MELEE) {
                    defenseRoll = AccuracyFormulasDpsCalc_1.AccuracyFormulasDpsCalc.defenseMeleeRoll(enemy, BonusManager_1.BonusManager.ATTACK_SLASH);
                    if (enemy.getPrayerActive()[PrayerHandler_1.PrayerHandler.PROTECT_FROM_MELEE]) {
                        maxHit *= 0.7;
                    }
                }
                else if (styleSwitch.getCombatType() == CombatType_1.CombatType.RANGED) {
                    defenseRoll = AccuracyFormulasDpsCalc_1.AccuracyFormulasDpsCalc.defenseRangedRoll(enemy);
                    if (enemy.getPrayerActive()[PrayerHandler_1.PrayerHandler.PROTECT_FROM_MISSILES]) {
                        maxHit *= 0.7;
                    }
                }
                else if (styleSwitch.getCombatType() == CombatType_1.CombatType.MAGIC) {
                    defenseRoll = AccuracyFormulasDpsCalc_1.AccuracyFormulasDpsCalc.defenseMagicRoll(enemy);
                    if (enemy.getPrayerActive()[PrayerHandler_1.PrayerHandler.PROTECT_FROM_MAGIC]) {
                        maxHit *= 0.7;
                    }
                    var hitChance = AccuracyFormulasDpsCalc_1.AccuracyFormulasDpsCalc.hitChance(styleSwitch.getAttackRoll(), defenseRoll);
                    var hitsPerSec = 1000 / (600 * styleSwitch.getHitSpeed());
                    var dps = hitChance * maxHit * hitsPerSec;
                    if (dps > bestDps) {
                        bestDps = dps;
                        bestSwitch = styleSwitch;
                    }
                }
                if (!bestSwitch) {
                    return;
                }
                bestSwitch.getCombatSwitch().perform(playerBot, enemy);
                bestSwitch.setHitSpeed(playerBot.getBaseAttackSpeed());
                if (bestSwitch.getCombatType() === CombatType_1.CombatType.MELEE) {
                    bestSwitch.setAttackRoll(AccuracyFormulasDpsCalc_1.AccuracyFormulasDpsCalc.attackMeleeRoll(playerBot));
                    bestSwitch.setMaxHit(DamageFormulas_1.DamageFormulas.calculateMaxMeleeHit(playerBot));
                }
                else if (bestSwitch.getCombatType() === CombatType_1.CombatType.RANGED) {
                    bestSwitch.setAttackRoll(AccuracyFormulasDpsCalc_1.AccuracyFormulasDpsCalc.attackRangedRoll(playerBot));
                    bestSwitch.setMaxHit(DamageFormulas_1.DamageFormulas.calculateMaxRangedHit(playerBot));
                }
                else if (bestSwitch.getCombatType() === CombatType_1.CombatType.MAGIC) {
                    bestSwitch.setAttackRoll(AccuracyFormulasDpsCalc_1.AccuracyFormulasDpsCalc.attackMagicRoll(playerBot));
                    bestSwitch.setMaxHit(DamageFormulas_1.DamageFormulas.getMagicMaxhit(playerBot));
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
    };
    return EnemyDefenseAwareCombatSwitch;
}());
exports.EnemyDefenseAwareCombatSwitch = EnemyDefenseAwareCombatSwitch;
//# sourceMappingURL=EnemyDefenseAwareCombatSwitch.js.map