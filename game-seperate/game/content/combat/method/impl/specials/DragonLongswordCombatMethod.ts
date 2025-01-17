import { MeleeCombatMethod } from "../MeleeCombatMethod";
import { Animation } from "../../../../../model/Animation";
import { Graphic } from "../../../../../model/Graphic";
import { GraphicHeight } from "../../../../../model/GraphicHeight";
import { Priority } from "../../../../../model/Priority";
import { Mobile } from "../../../../../entity/impl/Mobile";
import { CombatSpecial } from "../../../CombatSpecial";

export class DragonLongswordCombatMethod extends MeleeCombatMethod {

    private static ANIMATION = new Animation(1058);
    private static GRAPHIC = new Graphic(248, GraphicHeight.HIGH);

    start(character: Mobile, target: Mobile) {
        CombatSpecial.drain(character, CombatSpecial.DRAGON_LONGSWORD.getDrainAmount());
        character.performAnimation(DragonLongswordCombatMethod.ANIMATION);
        character.performGraphic(DragonLongswordCombatMethod.GRAPHIC);
    }
}
