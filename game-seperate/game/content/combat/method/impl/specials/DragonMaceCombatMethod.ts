import { MeleeCombatMethod } from "../MeleeCombatMethod";
import { Animation } from "../../../../../model/Animation";
import { Graphic } from "../../../../../model/Graphic";
import { GraphicHeight } from "../../../../../model/GraphicHeight";
import { Priority } from "../../../../../model/Priority";
import { Mobile } from "../../../../../entity/impl/Mobile";
import { CombatSpecial } from "../../../CombatSpecial";

export class DragonMaceCombatMethod extends MeleeCombatMethod {
    private static ANIMATION = new Animation(1060);
    private static GRAPHIC = new Graphic(251, GraphicHeight.HIGH);

    start(character: Mobile, target: Mobile) {
        CombatSpecial.drain(character, CombatSpecial.DRAGON_MACE.getDrainAmount());
        character.performAnimation(DragonMaceCombatMethod.ANIMATION);
        character.performGraphic(DragonMaceCombatMethod.GRAPHIC);
    }
}
