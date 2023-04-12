"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccuracyFormulasDpsCalc = void 0;
var crypto = require("crypto-browserify");
var PrayerHandler_1 = require("../../../content/PrayerHandler");
var CombatFactory_1 = require("../CombatFactory");
var CombatType_1 = require("../CombatType");
var FightStyle_1 = require("../FightStyle");
var Misc_1 = require("../../../../util/Misc");
var BonusManager_1 = require("../../../model/equipment/BonusManager");
var Skill_1 = require("../../../model/Skill");
var CombatEquipment_1 = require("../../combat/CombatEquipment");
var FightType_1 = require("../FightType");
var Player_1 = require("../../../entity/impl/player/Player");
var AccuracyFormulasDpsCalc = /** @class */ (function () {
    function AccuracyFormulasDpsCalc() {
    }
    AccuracyFormulasDpsCalc.randomFloat = function () {
        var randomByte = crypto.randomBytes(1);
        return randomByte.readUInt8() / 255;
    };
    AccuracyFormulasDpsCalc.rollAccuracy = function (entity, enemy, style) {
        if (style === CombatType_1.CombatType.MELEE && CombatFactory_1.CombatFactory.fullVeracs(entity) && Misc_1.Misc.getRandom(4) === 1) {
            return true;
        }
        if (style === CombatType_1.CombatType.MELEE) {
            var attRoll = AccuracyFormulasDpsCalc.attackMeleeRoll(entity);
            var defRoll = AccuracyFormulasDpsCalc.defenseMeleeRoll(entity, enemy);
            var hitChance = this.hitChance(attRoll, defRoll);
            return hitChance > this.randomFloat();
        }
        else if (style === CombatType_1.CombatType.RANGED) {
            var attRoll = AccuracyFormulasDpsCalc.attackRangedRoll(entity);
            var defRoll = AccuracyFormulasDpsCalc.defenseRangedRoll(enemy);
            var hitChance = this.hitChance(attRoll, defRoll);
            return hitChance > this.randomFloat();
        }
        else if (style === CombatType_1.CombatType.MAGIC) {
            var attRoll = AccuracyFormulasDpsCalc.attackMagicRoll(entity);
            var defRoll = AccuracyFormulasDpsCalc.defenseMagicRoll(enemy);
            var hitChance = this.hitChance(attRoll, defRoll);
            return hitChance > this.randomFloat();
        }
        return false;
    };
    AccuracyFormulasDpsCalc.hitChance = function (attRoll, defRoll) {
        if (attRoll > defRoll) {
            return 1 - ((defRoll + 2) / (2 * attRoll + 1));
        }
        else {
            return attRoll / (2 * defRoll + 1);
        }
    };
    AccuracyFormulasDpsCalc.effectiveAttackLevel = function (entity) {
        var att = 8;
        if (entity.isNpc()) {
            att += entity.getAsNpc().getCurrentDefinition().getStats()[0];
            return att;
        }
        var player = entity.getAsPlayer();
        att += player.getSkillManager().getCurrentLevel(Skill_1.Skill.ATTACK);
        var prayerBonus = 1;
        // Prayer additions
        if (PrayerHandler_1.PrayerHandler.isActivated(player, PrayerHandler_1.PrayerHandler.CLARITY_OF_THOUGHT)) {
            prayerBonus = 1.05;
        }
        else if (PrayerHandler_1.PrayerHandler.isActivated(player, PrayerHandler_1.PrayerHandler.IMPROVED_REFLEXES)) {
            prayerBonus = 1.10;
        }
        else if (PrayerHandler_1.PrayerHandler.isActivated(player, PrayerHandler_1.PrayerHandler.INCREDIBLE_REFLEXES)) {
            prayerBonus = 1.15;
        }
        else if (PrayerHandler_1.PrayerHandler.isActivated(player, PrayerHandler_1.PrayerHandler.CHIVALRY)) {
            prayerBonus = 1.15;
        }
        else if (PrayerHandler_1.PrayerHandler.isActivated(player, PrayerHandler_1.PrayerHandler.PIETY)) {
            prayerBonus = 1.20;
        }
        att *= prayerBonus;
        var fightStyle = FightType_1.FightType.getStyle();
        if (fightStyle == FightStyle_1.FightStyle.ACCURATE)
            att += 3;
        else if (fightStyle == FightStyle_1.FightStyle.CONTROLLED)
            att += 1;
        if (CombatEquipment_1.CombatEquipment.wearingVoid(player, CombatType_1.CombatType.MELEE))
            att = (att * 1.1);
        // Special attack
        if (player.isSpecialActivated()) {
            att *= Player_1.Player.getCombatSpecial().getAccuracyMultiplier();
        }
        return att;
    };
    AccuracyFormulasDpsCalc.attackMeleeRoll = function (entity) {
        var attRoll = AccuracyFormulasDpsCalc.effectiveAttackLevel(entity);
        if (entity.isNpc()) {
            // NPC's don't currently have stab/slash/crush bonuses
            attRoll *= 64;
            return Math.floor(attRoll);
        }
        var player = entity.getAsPlayer();
        var attStab = player.getBonusManager().getAttackBonus()[BonusManager_1.BonusManager.ATTACK_STAB];
        var attSlash = player.getBonusManager().getAttackBonus()[BonusManager_1.BonusManager.ATTACK_SLASH];
        var attCrush = player.getBonusManager().getAttackBonus()[BonusManager_1.BonusManager.ATTACK_CRUSH];
        switch (FightType_1.FightType.getBonusTypes()) {
            case BonusManager_1.BonusManager.ATTACK_STAB:
                attRoll *= attStab + 64;
                break;
            case BonusManager_1.BonusManager.ATTACK_SLASH:
                attRoll *= attSlash + 64;
                break;
            case BonusManager_1.BonusManager.ATTACK_CRUSH:
                attRoll *= attCrush + 64;
                break;
            default:
                var maxAtt = Math.max(attStab, Math.max(attCrush, attSlash));
                attRoll *= maxAtt + 64;
        }
        return Math.floor(attRoll);
    };
    AccuracyFormulasDpsCalc.effectiveDefenseLevel = function (enemy) {
        var def = 1;
        if (enemy.isNpc()) {
            return enemy.getAsNpc().getCurrentDefinition().getStats()[2];
        }
        var player = enemy.getAsPlayer();
        def = player.getSkillManager().getCurrentLevel(Skill_1.Skill.DEFENCE);
        var prayerBonus = 1;
        // Prayer additions
        if (PrayerHandler_1.PrayerHandler.isActivated(enemy, PrayerHandler_1.PrayerHandler.THICK_SKIN)) {
            prayerBonus = 1.05;
        }
        else if (PrayerHandler_1.PrayerHandler.isActivated(enemy, PrayerHandler_1.PrayerHandler.ROCK_SKIN)) {
            prayerBonus = 1.10;
        }
        else if (PrayerHandler_1.PrayerHandler.isActivated(enemy, PrayerHandler_1.PrayerHandler.STEEL_SKIN)) {
            prayerBonus = 1.15;
        }
        else if (PrayerHandler_1.PrayerHandler.isActivated(enemy, PrayerHandler_1.PrayerHandler.CHIVALRY)) {
            prayerBonus = 1.20;
        }
        else if (PrayerHandler_1.PrayerHandler.isActivated(enemy, PrayerHandler_1.PrayerHandler.PIETY)) {
            prayerBonus = 1.25;
        }
        else if (PrayerHandler_1.PrayerHandler.isActivated(enemy, PrayerHandler_1.PrayerHandler.RIGOUR)) {
            prayerBonus = 1.25;
        }
        else if (PrayerHandler_1.PrayerHandler.isActivated(enemy, PrayerHandler_1.PrayerHandler.AUGURY)) {
            prayerBonus = 1.25;
        }
        def *= prayerBonus;
        var fightStyle = FightType_1.FightType.getStyle();
        if (fightStyle == FightStyle_1.FightStyle.DEFENSIVE)
            def += 3;
        else if (fightStyle == FightStyle_1.FightStyle.CONTROLLED)
            def += 1;
        def += 8;
        if (CombatEquipment_1.CombatEquipment.wearingVoid(player, CombatType_1.CombatType.MELEE))
            def = (def * 1.1);
        return def;
    };
    AccuracyFormulasDpsCalc.calcDefenseMeleeRoll = function (entity, enemy) {
        var bonusType = (entity.isNpc() ? 3 /* Default case */ : FightType_1.FightType.getBonusType());
        return AccuracyFormulasDpsCalc.defenseMeleeRoll(enemy, bonusType);
    };
    AccuracyFormulasDpsCalc.defenseMeleeRoll = function (enemy, bonusType) {
        var defLevel = AccuracyFormulasDpsCalc.effectiveDefenseLevel(enemy);
        var enemyPlayer = enemy.getAsPlayer();
        // NPCs don't have defence bonuses currently
        var defStab = (enemy.isNpc() ? 0 : enemyPlayer.getBonusManager().getDefenceBonus()[BonusManager_1.BonusManager.DEFENCE_STAB]);
        var defSlash = (enemy.isNpc() ? 0 : enemyPlayer.getBonusManager().getDefenceBonus()[BonusManager_1.BonusManager.DEFENCE_SLASH]);
        var defCrush = (enemy.isNpc() ? 0 : enemyPlayer.getBonusManager().getDefenceBonus()[BonusManager_1.BonusManager.DEFENCE_CRUSH]);
        switch (bonusType) {
            case BonusManager_1.BonusManager.ATTACK_STAB:
                defLevel *= defStab + 64;
                break;
            case BonusManager_1.BonusManager.ATTACK_SLASH:
                defLevel *= defSlash + 64;
                break;
            case BonusManager_1.BonusManager.ATTACK_CRUSH:
                defLevel *= defCrush + 64;
                break;
            default:
                var maxDef = Math.max(defStab, Math.max(defCrush, defSlash));
                defLevel *= maxDef + 64;
        }
        return Math.floor(defLevel);
    };
    // Ranged
    AccuracyFormulasDpsCalc.defenseRangedRoll = function (enemy) {
        var defLevel = AccuracyFormulasDpsCalc.effectiveDefenseLevel(enemy);
        var defRange = (enemy.isPlayer() ?
            enemy.getAsPlayer().getBonusManager().getDefenceBonus()[BonusManager_1.BonusManager.DEFENCE_RANGE]
            : 0);
        defLevel *= defRange + 64;
        return defLevel;
    };
    AccuracyFormulasDpsCalc.effectiveRangedAttack = function (entity) {
        var rngStrength = 8;
        if (entity.isNpc()) {
            // Prayer bonuses don't apply to NPCs (yet)
            return rngStrength + entity.getAsNpc().getCurrentDefinition().getStats()[3];
        }
        var player = entity.getAsPlayer();
        rngStrength += player.getSkillManager().getCurrentLevel(Skill_1.Skill.RANGED);
        // Prayers
        var prayerMod = 1.0;
        if (PrayerHandler_1.PrayerHandler.isActivated(player, PrayerHandler_1.PrayerHandler.SHARP_EYE)) {
            prayerMod = 1.05;
        }
        else if (PrayerHandler_1.PrayerHandler.isActivated(player, PrayerHandler_1.PrayerHandler.HAWK_EYE)) {
            prayerMod = 1.10;
        }
        else if (PrayerHandler_1.PrayerHandler.isActivated(player, PrayerHandler_1.PrayerHandler.EAGLE_EYE)) {
            prayerMod = 1.15;
        }
        else if (PrayerHandler_1.PrayerHandler.isActivated(player, PrayerHandler_1.PrayerHandler.RIGOUR)) {
            prayerMod = 1.23;
        }
        rngStrength = (rngStrength * prayerMod);
        var fightStyle = FightType_1.FightType.getStyle();
        if (fightStyle == FightStyle_1.FightStyle.ACCURATE)
            rngStrength += 3;
        if (CombatEquipment_1.CombatEquipment.wearingVoid(player, CombatType_1.CombatType.RANGED)) {
            rngStrength = (rngStrength * 1.125);
        }
        //    if (dragonHunter(input))
        //        rngStrength =
        return rngStrength;
    };
    AccuracyFormulasDpsCalc.attackRangedRoll = function (entity) {
        var accuracyBonus = (entity.isNpc() ? 0 : entity.getAsPlayer().getBonusManager().getAttackBonus()[BonusManager_1.BonusManager.ATTACK_RANGE]);
        var attRoll = AccuracyFormulasDpsCalc.effectiveRangedAttack(entity);
        attRoll *= (accuracyBonus + 64);
        return Math.floor(attRoll);
    };
    AccuracyFormulasDpsCalc.effectiveMagicLevel = function (entity) {
        var mag = 8;
        if (entity.isNpc()) {
            // Prayer bonuses don't apply to NPCs (yet)
            mag += entity.getAsNpc().getCurrentDefinition().getStats()[4];
            return mag;
        }
        var player = entity.getAsPlayer();
        mag += player.getSkillManager().getCurrentLevel(Skill_1.Skill.MAGIC);
        var prayerBonus = 1;
        // Prayer additions
        if (PrayerHandler_1.PrayerHandler.isActivated(player, PrayerHandler_1.PrayerHandler.MYSTIC_WILL)) {
            prayerBonus = 1.05;
        }
        else if (PrayerHandler_1.PrayerHandler.isActivated(player, PrayerHandler_1.PrayerHandler.MYSTIC_LORE)) {
            prayerBonus = 1.10;
        }
        else if (PrayerHandler_1.PrayerHandler.isActivated(player, PrayerHandler_1.PrayerHandler.MYSTIC_MIGHT)) {
            prayerBonus = 1.15;
        }
        else if (PrayerHandler_1.PrayerHandler.isActivated(player, PrayerHandler_1.PrayerHandler.AUGURY)) {
            prayerBonus = 1.25;
        }
        mag *= prayerBonus;
        var fightStyle = FightType_1.FightType.getStyle();
        if (fightStyle == FightStyle_1.FightStyle.ACCURATE)
            mag += 3;
        else if (fightStyle == FightStyle_1.FightStyle.DEFENSIVE)
            mag += 1;
        if (CombatEquipment_1.CombatEquipment.wearingVoid(player, CombatType_1.CombatType.MAGIC))
            mag = (mag * 1.45);
        return mag;
    };
    AccuracyFormulasDpsCalc.defenseMagicRoll = function (enemy) {
        var defLevel = AccuracyFormulasDpsCalc.effectiveMagicLevel(enemy);
        var defRange = (enemy.isNpc() ? 0 : enemy.getAsPlayer().getBonusManager().getDefenceBonus()[BonusManager_1.BonusManager.DEFENCE_MAGIC]);
        defLevel *= (defRange + 64);
        return defLevel;
    };
    AccuracyFormulasDpsCalc.attackMagicRoll = function (entity) {
        var accuracyBonus = (entity.isNpc() ? 0 : entity.getAsPlayer().getBonusManager().getAttackBonus()[BonusManager_1.BonusManager.ATTACK_MAGIC]);
        var attRoll = AccuracyFormulasDpsCalc.effectiveMagicLevel(entity);
        attRoll *= (accuracyBonus + 64);
        return attRoll;
    };
    return AccuracyFormulasDpsCalc;
}());
exports.AccuracyFormulasDpsCalc = AccuracyFormulasDpsCalc;
//# sourceMappingURL=AccuracyFormulasDpsCalc.js.map