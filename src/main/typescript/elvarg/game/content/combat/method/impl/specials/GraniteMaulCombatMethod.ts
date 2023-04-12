import { MeleeCombatMethod } from "../MeleeCombatMethod";
import { Animation } from "../../../../../model/Animation";
import { Graphic } from "../../../../../model/Graphic";
import { Priority } from "../../../../../model/Priority";
import { Mobile } from "../../../../../entity/impl/Mobile";
import { CombatSpecial } from "../../../CombatSpecial";
import { GraphicHeight } from "../../../../../model/GraphicHeight";

export class GraniteMaulCombatMethod extends MeleeCombatMethod {
    private static ANIMATION = new Animation(1667);
    private static GRAPHIC = new Graphic(340, GraphicHeight.HIGH);
    start(character: Mobile, target: Mobile): void {
        CombatSpecial.drain(character, CombatSpecial.GRANITE_MAUL.getDrainAmount());
        character.performAnimation(GraniteMaulCombatMethod.ANIMATION);
        character.performGraphic(GraniteMaulCombatMethod.GRAPHIC);
    }
}
    