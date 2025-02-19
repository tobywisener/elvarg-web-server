import { MeleeCombatMethod } from "../MeleeCombatMethod";
import { Animation } from "../../../../../model/Animation";
import { Graphic } from "../../../../../model/Graphic";
import { Priority } from "../../../../../model/Priority";
import { Mobile } from "../../../../../entity/impl/Mobile";
import { CombatSpecial } from "../../../CombatSpecial";
import { PendingHit } from "../../../hit/PendingHit";
import { CombatFactory } from "../../../CombatFactory";

export class ZamorakGodswordCombatMethod extends MeleeCombatMethod {
    private static ANIMATION = new Animation(7638);
    private static GRAPHIC = new Graphic(1210, Priority.HIGH);

    start(character: Mobile, target: Mobile) {
        CombatSpecial.drain(character, CombatSpecial.ZAMORAK_GODSWORD.getDrainAmount());
        character.performAnimation(ZamorakGodswordCombatMethod.ANIMATION);
    }

    handleAfterHitEffects(hit: PendingHit) {
        if (hit.isAccurate()) {
            hit.getTarget().performGraphic(ZamorakGodswordCombatMethod.GRAPHIC);
            CombatFactory.freeze(hit.getTarget(), 15);
        }
    }
}
