import { MeleeCombatMethod } from "../MeleeCombatMethod";
import { Animation } from "../../../../../model/Animation";
import { Graphic } from "../../../../../model/Graphic";
import { Priority } from "../../../../../model/Priority";
import { PendingHit } from "../../../hit/PendingHit";
import { Mobile } from "../../../../../entity/impl/Mobile";
import { CombatSpecial } from "../../../CombatSpecial";
import { GraphicHeight } from "../../../../../model/GraphicHeight";
import { CombatFactory } from "../../../CombatFactory";
import { Misc } from "../../../../../../util/Misc";
import { PoisonType } from "../../../../../task/impl/CombatPoisonEffect";

export class AbyssalTentacleCombatMethod extends MeleeCombatMethod {
    private static readonly ANIMATION = new Animation(1658);
    private static readonly GRAPHIC = new Graphic(181, GraphicHeight.HIGH);

    start(character: Mobile, target: Mobile) {
        CombatSpecial.drain(character, CombatSpecial.ABYSSAL_TENTACLE.getDrainAmount());
        character.performAnimation(AbyssalTentacleCombatMethod.ANIMATION);
    }

    handleAfterHitEffects(hit: PendingHit) {
        const target = hit.getTarget();
        if (target.getHitpoints() <= 0) {
            return;
        }
        target.performGraphic(AbyssalTentacleCombatMethod.GRAPHIC);
        CombatFactory.freeze(target, 10);
        if (Misc.getRandom(100) < 50) {
            CombatFactory.poisonEntity(target, PoisonType.EXTRA);
        }
    }
}