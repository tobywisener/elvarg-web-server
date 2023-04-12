import * as crypto from 'crypto-browserify'

import { PrayerHandler } from "../../../content/PrayerHandler";
import { CombatFactory } from "../CombatFactory";
import { CombatType } from "../CombatType";
import { FightStyle } from '../FightStyle';
import { Misc } from "../../../../util/Misc";
import { Mobile } from "../../../entity/impl/Mobile";
import { BonusManager } from "../../../model/equipment/BonusManager";
import { Skill } from "../../../model/Skill";
import { CombatEquipment } from "../../combat/CombatEquipment";
import { FightType } from '../FightType';
import { Player } from '../../../entity/impl/player/Player';

export class AccuracyFormulasDpsCalc {
    static randomFloat() {
        const randomByte = crypto.randomBytes(1);
        return randomByte.readUInt8() / 255;
    }

    public static rollAccuracy(entity: any, enemy: any, style: any) {
        if (style === CombatType.MELEE && CombatFactory.fullVeracs(entity) && Misc.getRandom(4) === 1) {
            return true;
        }

        if (style === CombatType.MELEE) {
            let attRoll = AccuracyFormulasDpsCalc.attackMeleeRoll(entity);
            let defRoll = AccuracyFormulasDpsCalc.defenseMeleeRoll(entity, enemy);

            let hitChance = this.hitChance(attRoll, defRoll);
            return hitChance > this.randomFloat();

        } else if (style === CombatType.RANGED) {
            let attRoll = AccuracyFormulasDpsCalc.attackRangedRoll(entity);
            let defRoll = AccuracyFormulasDpsCalc.defenseRangedRoll(enemy);

            let hitChance = this.hitChance(attRoll, defRoll);
            return hitChance > this.randomFloat();
        } else if (style === CombatType.MAGIC) {
            let attRoll = AccuracyFormulasDpsCalc.attackMagicRoll(entity);
            let defRoll = AccuracyFormulasDpsCalc.defenseMagicRoll(enemy);

            let hitChance = this.hitChance(attRoll, defRoll);
            return hitChance > this.randomFloat();
        }
        return false;
    }

    public static hitChance(attRoll: number, defRoll: number) {

        if (attRoll > defRoll) {
            return 1 - ((defRoll + 2) / (2 * attRoll + 1));
        } else {
            return attRoll / (2 * defRoll + 1);
        }
    }

    public static effectiveAttackLevel(entity: Mobile) {
        let att = 8;

        if (entity.isNpc()) {
            att += entity.getAsNpc().getCurrentDefinition().getStats()[0];
            return att;
        }

        let player = entity.getAsPlayer();

        att += player.getSkillManager().getCurrentLevel(Skill.ATTACK);

        let prayerBonus = 1;

        // Prayer additions
        if (PrayerHandler.isActivated(player, PrayerHandler.CLARITY_OF_THOUGHT)) {
            prayerBonus = 1.05;
        } else if (PrayerHandler.isActivated(player, PrayerHandler.IMPROVED_REFLEXES)) {
            prayerBonus = 1.10;
        } else if (PrayerHandler.isActivated(player, PrayerHandler.INCREDIBLE_REFLEXES)) {
            prayerBonus = 1.15;
        } else if (PrayerHandler.isActivated(player, PrayerHandler.CHIVALRY)) {
            prayerBonus = 1.15;
        } else if (PrayerHandler.isActivated(player, PrayerHandler.PIETY)) {
            prayerBonus = 1.20;
        }

        att *= prayerBonus;

        let fightStyle = FightType.getStyle();
        if (fightStyle == FightStyle.ACCURATE)
            att += 3;
        else if (fightStyle == FightStyle.CONTROLLED)
            att += 1;

        if (CombatEquipment.wearingVoid(player, CombatType.MELEE))
            att = (att * 1.1);

        // Special attack
        if (player.isSpecialActivated()) {
            att *= Player.getCombatSpecial().getAccuracyMultiplier()
        }

        return att;
    }

    public static attackMeleeRoll(entity: Mobile) {
        let attRoll = AccuracyFormulasDpsCalc.effectiveAttackLevel(entity);

        if (entity.isNpc()) {
            // NPC's don't currently have stab/slash/crush bonuses
            attRoll *= 64;
            return Math.floor(attRoll);
        }

        let player = entity.getAsPlayer();

        let attStab = player.getBonusManager().getAttackBonus()[BonusManager.ATTACK_STAB];
        let attSlash = player.getBonusManager().getAttackBonus()[BonusManager.ATTACK_SLASH];
        let attCrush = player.getBonusManager().getAttackBonus()[BonusManager.ATTACK_CRUSH];

        switch (FightType.getBonusTypes()) {
            case BonusManager.ATTACK_STAB:
                attRoll *= attStab + 64;
                break;
            case BonusManager.ATTACK_SLASH:
                attRoll *= attSlash + 64;
                break;
            case BonusManager.ATTACK_CRUSH:
                attRoll *= attCrush + 64;
                break;
            default:
                let maxAtt = Math.max(attStab, Math.max(attCrush, attSlash));
                attRoll *= maxAtt + 64;
        }

        return Math.floor(attRoll);
    }

    public static effectiveDefenseLevel(enemy: Mobile) {
        let def = 1;

        if (enemy.isNpc()) {
            return enemy.getAsNpc().getCurrentDefinition().getStats()[2];
        }

        let player = enemy.getAsPlayer();
        def = player.getSkillManager().getCurrentLevel(Skill.DEFENCE);


        let prayerBonus = 1;

        // Prayer additions
        if (PrayerHandler.isActivated(enemy, PrayerHandler.THICK_SKIN)) {
            prayerBonus = 1.05;
        } else if (PrayerHandler.isActivated(enemy, PrayerHandler.ROCK_SKIN)) {
            prayerBonus = 1.10;
        } else if (PrayerHandler.isActivated(enemy, PrayerHandler.STEEL_SKIN)) {
            prayerBonus = 1.15;
        } else if (PrayerHandler.isActivated(enemy, PrayerHandler.CHIVALRY)) {
            prayerBonus = 1.20;
        } else if (PrayerHandler.isActivated(enemy, PrayerHandler.PIETY)) {
            prayerBonus = 1.25;
        } else if (PrayerHandler.isActivated(enemy, PrayerHandler.RIGOUR)) {
            prayerBonus = 1.25;
        } else if (PrayerHandler.isActivated(enemy, PrayerHandler.AUGURY)) {
            prayerBonus = 1.25;
        }

        def *= prayerBonus;

        let fightStyle = FightType.getStyle();
        if (fightStyle == FightStyle.DEFENSIVE)
            def += 3;
        else if (fightStyle == FightStyle.CONTROLLED)
            def += 1;
        def += 8;

        if (CombatEquipment.wearingVoid(player, CombatType.MELEE))
            def = (def * 1.1);

        return def;
    }

    private static calcDefenseMeleeRoll(entity: Mobile, enemy: Mobile) {
        let bonusType = (entity.isNpc() ? 3 /* Default case */ : FightType.getBonusType());

        return AccuracyFormulasDpsCalc.defenseMeleeRoll(enemy, bonusType);
    }

    public static defenseMeleeRoll(enemy: Mobile, bonusType: number) {
        let defLevel = AccuracyFormulasDpsCalc.effectiveDefenseLevel(enemy);

        let enemyPlayer = enemy.getAsPlayer();

        // NPCs don't have defence bonuses currently
        let defStab = (enemy.isNpc() ? 0 : enemyPlayer.getBonusManager().getDefenceBonus()[BonusManager.DEFENCE_STAB]);
        let defSlash = (enemy.isNpc() ? 0 : enemyPlayer.getBonusManager().getDefenceBonus()[BonusManager.DEFENCE_SLASH]);
        let defCrush = (enemy.isNpc() ? 0 : enemyPlayer.getBonusManager().getDefenceBonus()[BonusManager.DEFENCE_CRUSH]);

        switch (bonusType) {
            case BonusManager.ATTACK_STAB:
                defLevel *= defStab + 64;
                break;
            case BonusManager.ATTACK_SLASH:
                defLevel *= defSlash + 64;
                break;
            case BonusManager.ATTACK_CRUSH:
                defLevel *= defCrush + 64;
                break;
            default:
                let maxDef = Math.max(defStab, Math.max(defCrush, defSlash));
                defLevel *= maxDef + 64;
        }

        return Math.floor(defLevel);
    }

    // Ranged
    public static defenseRangedRoll(enemy: Mobile) {
        let defLevel = AccuracyFormulasDpsCalc.effectiveDefenseLevel(enemy);

        const defRange = (enemy.isPlayer() ?
            enemy.getAsPlayer().getBonusManager().getDefenceBonus()[BonusManager.DEFENCE_RANGE]
            : 0);

        defLevel *= defRange + 64;

        return defLevel;
    }

    private static effectiveRangedAttack(entity: Mobile) {
        let rngStrength = 8;

        if (entity.isNpc()) {
            // Prayer bonuses don't apply to NPCs (yet)
            return rngStrength + entity.getAsNpc().getCurrentDefinition().getStats()[3];
        }

        let player = entity.getAsPlayer();
        rngStrength += player.getSkillManager().getCurrentLevel(Skill.RANGED);

        // Prayers
        let prayerMod = 1.0;
        if (PrayerHandler.isActivated(player, PrayerHandler.SHARP_EYE)) {
            prayerMod = 1.05;
        } else if (PrayerHandler.isActivated(player, PrayerHandler.HAWK_EYE)) {
            prayerMod = 1.10;
        } else if (PrayerHandler.isActivated(player, PrayerHandler.EAGLE_EYE)) {
            prayerMod = 1.15;
        } else if (PrayerHandler.isActivated(player, PrayerHandler.RIGOUR)) {
            prayerMod = 1.23;
        }
        rngStrength = (rngStrength * prayerMod);

        let fightStyle = FightType.getStyle();
        if (fightStyle == FightStyle.ACCURATE)
            rngStrength += 3;

        if (CombatEquipment.wearingVoid(player, CombatType.RANGED)) {
            rngStrength = (rngStrength * 1.125);
        }

        //    if (dragonHunter(input))
        //        rngStrength =
        return rngStrength;
    }

    public static attackRangedRoll(entity: Mobile) {
        let accuracyBonus = (entity.isNpc() ? 0 : entity.getAsPlayer().getBonusManager().getAttackBonus()[BonusManager.ATTACK_RANGE]);

        let attRoll = AccuracyFormulasDpsCalc.effectiveRangedAttack(entity);

        attRoll *= (accuracyBonus + 64);

        return Math.floor(attRoll);
    }

    private static effectiveMagicLevel(entity: Mobile) {
        let mag = 8;

        if (entity.isNpc()) {
            // Prayer bonuses don't apply to NPCs (yet)
            mag += entity.getAsNpc().getCurrentDefinition().getStats()[4];
            return mag;
        }

        let player = entity.getAsPlayer();
        mag += player.getSkillManager().getCurrentLevel(Skill.MAGIC);

        let prayerBonus = 1;

        // Prayer additions
        if (PrayerHandler.isActivated(player, PrayerHandler.MYSTIC_WILL)) {
            prayerBonus = 1.05;
        } else if (PrayerHandler.isActivated(player, PrayerHandler.MYSTIC_LORE)) {
            prayerBonus = 1.10;
        } else if (PrayerHandler.isActivated(player, PrayerHandler.MYSTIC_MIGHT)) {
            prayerBonus = 1.15;
        } else if (PrayerHandler.isActivated(player, PrayerHandler.AUGURY)) {
            prayerBonus = 1.25;
        }

        mag *= prayerBonus;

        let fightStyle = FightType.getStyle();
        if (fightStyle == FightStyle.ACCURATE)
            mag += 3;
        else if (fightStyle == FightStyle.DEFENSIVE)
            mag += 1;

        if (CombatEquipment.wearingVoid(player, CombatType.MAGIC))
            mag = (mag * 1.45);

        return mag;
    }

    public static defenseMagicRoll(enemy: Mobile): number {
        let defLevel = AccuracyFormulasDpsCalc.effectiveMagicLevel(enemy);

        let defRange = (enemy.isNpc() ? 0 : enemy.getAsPlayer().getBonusManager().getDefenceBonus()[BonusManager.DEFENCE_MAGIC]);

        defLevel *= (defRange + 64);

        return defLevel;
    }

    public static attackMagicRoll(entity: Mobile): number {
        let accuracyBonus = (entity.isNpc() ? 0 : entity.getAsPlayer().getBonusManager().getAttackBonus()[BonusManager.ATTACK_MAGIC]);

        let attRoll = AccuracyFormulasDpsCalc.effectiveMagicLevel(entity);
        attRoll *= (accuracyBonus + 64);

        return attRoll;
    }
}
