import { MeleeCombatMethod } from "../MeleeCombatMethod";
import { Animation } from "../../../../../model/Animation";
import { Graphic } from "../../../../../model/Graphic";
import { Priority } from "../../../../../model/Priority";
import { Mobile } from "../../../../../entity/impl/Mobile";
import { CombatSpecial } from "../../../CombatSpecial";
import { GraphicHeight } from "../../../../../model/GraphicHeight";

export class BarrelchestAnchorCombatMethod extends MeleeCombatMethod {
    private static readonly ANIMATION = new Animation(5870);
    private static readonly GRAPHIC = new Graphic(1027, GraphicHeight.MIDDLE);

    start(character: Mobile, target: Mobile) {
        CombatSpecial.drain(character, CombatSpecial.BARRELSCHEST_ANCHOR.getDrainAmount());
        character.performAnimation(BarrelchestAnchorCombatMethod.ANIMATION);
        character.performGraphic(BarrelchestAnchorCombatMethod.GRAPHIC);
    }
}
