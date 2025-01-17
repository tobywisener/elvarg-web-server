import { MeleeCombatMethod } from "../MeleeCombatMethod";
import { Animation } from "../../../../../model/Animation";
import { Graphic } from "../../../../../model/Graphic";
import { GraphicHeight } from "../../../../../model/GraphicHeight";
import { Priority } from "../../../../../model/Priority";
import { Mobile } from "../../../../../entity/impl/Mobile";
import { CombatSpecial } from "../../../CombatSpecial";
import { PendingHit } from "../../../hit/PendingHit";
import { CombatFactory } from "../../../CombatFactory";

export class DragonScimitarCombatMethod extends MeleeCombatMethod {
    private static ANIMATION = new Animation(1872);
    private static GRAPHIC = new Graphic(347, GraphicHeight.HIGH);

    start(character: Mobile, target: Mobile) {
        CombatSpecial.drain(character, CombatSpecial.DRAGON_SCIMITAR.getDrainAmount());
        character.performAnimation(DragonScimitarCombatMethod.ANIMATION);
        character.performGraphic(DragonScimitarCombatMethod.GRAPHIC);
    }

    handleAfterHitEffects(hit: PendingHit) {
        if (!hit.isAccurate() || !hit.getTarget().isPlayer()) {
            return;
        }
        CombatFactory.disableProtectionPrayers(hit.getTarget().getAsPlayer());
        hit.getAttacker().getAsPlayer().getPacketSender().sendMessage("Your target can no longer use protection prayers.");
    }
}
