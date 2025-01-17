import { PrayerHandler } from "../../../../content/PrayerHandler";
import { CombatType } from "../../../../content/combat/CombatType";
import { AccuracyFormulasDpsCalc } from "../../../../content/combat/formula/AccuracyFormulasDpsCalc";
import { DamageFormulas } from "../../../../content/combat/formula/DamageFormulas";
import { Mobile } from "../../Mobile";
import { PlayerBot } from "../PlayerBot";
import { BonusManager } from "../../../../model/equipment/BonusManager";
import { CombatAction } from "./CombatAction";
import { AttackStyleSwitch } from "./AttackStyleSwitch";
import { TimerKey } from "../../../../../util/timers/TimerKey";

export class EnemyDefenseAwareCombatSwitch implements CombatAction {
    private styleSwitches: AttackStyleSwitch[];

    constructor(styleSwitches: AttackStyleSwitch[], private readonly execFunc: Function) {
        this.styleSwitches = styleSwitches;
    }
    shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
        return this.execFunc();
    }

    stopAfter(): boolean {
        return false;
    }

    perform(playerBot: PlayerBot, enemy: Mobile) {
        let bestSwitch: AttackStyleSwitch = null;
        let bestDps = 0.0;

        for (let styleSwitch of this.styleSwitches) {
            if (!styleSwitch.getCombatSwitch().shouldPerform(playerBot, enemy)) {
                continue;
            }
            let defenseRoll = 1;
            let maxHit = styleSwitch.getMaxHit();

            if (styleSwitch.getCombatType() == CombatType.MELEE) {
                defenseRoll = AccuracyFormulasDpsCalc.defenseMeleeRoll(enemy, BonusManager.ATTACK_SLASH);
                if (enemy.getPrayerActive()[PrayerHandler.PROTECT_FROM_MELEE]) {
                    maxHit *= 0.7;
                }
            } else if (styleSwitch.getCombatType() == CombatType.RANGED) {
                defenseRoll = AccuracyFormulasDpsCalc.defenseRangedRoll(enemy);
                if (enemy.getPrayerActive()[PrayerHandler.PROTECT_FROM_MISSILES]) {
                    maxHit *= 0.7;
                }
            } else if (styleSwitch.getCombatType() == CombatType.MAGIC) {
                defenseRoll = AccuracyFormulasDpsCalc.defenseMagicRoll(enemy);
                if (enemy.getPrayerActive()[PrayerHandler.PROTECT_FROM_MAGIC]) {
                    maxHit *= 0.7;
                }
                let hitChance = AccuracyFormulasDpsCalc.hitChance(styleSwitch.getAttackRoll(), defenseRoll);
                let hitsPerSec = 1000 / (600 * styleSwitch.getHitSpeed());
                let dps: number = hitChance * maxHit * hitsPerSec;

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

            if (bestSwitch.getCombatType() === CombatType.MELEE) {
                bestSwitch.setAttackRoll(AccuracyFormulasDpsCalc.attackMeleeRoll(playerBot));
                bestSwitch.setMaxHit(DamageFormulas.calculateMaxMeleeHit(playerBot));
            } else if (bestSwitch.getCombatType() === CombatType.RANGED) {
                bestSwitch.setAttackRoll(AccuracyFormulasDpsCalc.attackRangedRoll(playerBot));
                bestSwitch.setMaxHit(DamageFormulas.calculateMaxRangedHit(playerBot));
            } else if (bestSwitch.getCombatType() === CombatType.MAGIC) {
                bestSwitch.setAttackRoll(AccuracyFormulasDpsCalc.attackMagicRoll(playerBot));
                bestSwitch.setMaxHit(DamageFormulas.getMagicMaxhit(playerBot));
            }
        }
    }
}