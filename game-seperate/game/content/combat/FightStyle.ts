import { CombatType } from "./CombatType";
import { Skill } from "../../model/Skill";
export abstract class FightStyle {
    static ACCURATE = new class extends FightStyle {
        skill(type: CombatType) {
            return type === CombatType.RANGED ? [Skill.RANGED] : [Skill.ATTACK];
        }
    }

    static AGGRESSIVE = new class extends FightStyle {
        skill(type: CombatType) {
            return type === CombatType.RANGED ? [Skill.RANGED] : [Skill.STRENGTH];
        }
    }

    static DEFENSIVE = new class extends FightStyle {
        skill(type: CombatType) {
            return type === CombatType.RANGED ? [Skill.RANGED, Skill.DEFENCE] : [Skill.DEFENCE];
        }
    }

    static CONTROLLED = new class extends FightStyle {
        skill() {
            return [Skill.ATTACK, Skill.STRENGTH, Skill.DEFENCE];
        }
    }

    abstract skill(type: CombatType);
}