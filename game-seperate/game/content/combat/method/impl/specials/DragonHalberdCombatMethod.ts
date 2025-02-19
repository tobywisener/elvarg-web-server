import { MeleeCombatMethod } from "../MeleeCombatMethod";
import { Animation } from "../../../../../model/Animation";
import { Graphic } from "../../../../../model/Graphic";
import { GraphicHeight } from "../../../../../model/GraphicHeight";
import { Priority } from "../../../../../model/Priority";
import { Mobile } from "../../../../../entity/impl/Mobile";
import { CombatSpecial } from "../../../CombatSpecial";
import { PendingHit } from "../../../hit/PendingHit";

export class DragonHalberdCombatMethod extends MeleeCombatMethod {

    private static readonly ANIMATION = new Animation(1203);
    private static readonly GRAPHIC = new Graphic(282, GraphicHeight.HIGH);

    public hits(character: Mobile, target: Mobile): PendingHit[] {
        return [new PendingHit(character, target, this, 1), new PendingHit(character, target, this)];
    }

    public start(character: Mobile, target: Mobile) {
        CombatSpecial.drain(character, CombatSpecial.DRAGON_HALBERD.getDrainAmount());
        character.performAnimation(DragonHalberdCombatMethod.ANIMATION);
        character.performGraphic(DragonHalberdCombatMethod.GRAPHIC);
    }
}
