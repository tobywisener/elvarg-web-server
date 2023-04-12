import { MeleeCombatMethod } from "../MeleeCombatMethod";
import { Animation } from "../../../../../model/Animation";
import { Graphic } from "../../../../../model/Graphic";
import { Priority } from "../../../../../model/Priority";
import { Mobile } from "../../../../../entity/impl/Mobile";
import { CombatSpecial } from "../../../CombatSpecial";

export class ArmadylGodswordCombatMethod extends MeleeCombatMethod {

    private static readonly ANIMATION = new Animation(7644);
    private static readonly GRAPHIC = new Graphic(1211, Priority.HIGH);

    start(character: Mobile, target: Mobile): void {
        CombatSpecial.drain(character, CombatSpecial.ARMADYL_GODSWORD.getDrainAmount());
        character.performAnimation(ArmadylGodswordCombatMethod.ANIMATION);
        character.performGraphic(ArmadylGodswordCombatMethod.GRAPHIC);
    }
}
