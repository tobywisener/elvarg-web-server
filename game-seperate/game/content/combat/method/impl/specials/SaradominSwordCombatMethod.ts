import { MeleeCombatMethod } from "../MeleeCombatMethod";
import { Animation } from "../../../../../model/Animation";
import { Graphic } from "../../../../../model/Graphic";
import { Priority } from "../../../../../model/Priority";
import { Mobile } from "../../../../../entity/impl/Mobile";
import { CombatSpecial } from "../../../CombatSpecial";
import { PendingHit } from "../../../hit/PendingHit";

export class SaradominSwordCombatMethod extends MeleeCombatMethod {
    private static ENEMY_GRAPHIC = new Graphic(1196);
    private static ANIMATION = new Animation(1132);
    private static GRAPHIC = new Graphic(1213, Priority.HIGH);

    hits(character: Mobile, target: Mobile): PendingHit[] {
        const hit = new PendingHit(character, target, this, 2);
        hit.getHits()[1].setDamage(hit.isAccurate() ? hit.getHits()[0].getDamage() + 16 : 0);
        hit.updateTotalDamage();
        return [hit];
    }

    start(character: Mobile, target: Mobile) {
        CombatSpecial.drain(character, CombatSpecial.SARADOMIN_SWORD.getDrainAmount());
        character.performAnimation(SaradominSwordCombatMethod.ANIMATION);
        character.performGraphic(SaradominSwordCombatMethod.GRAPHIC);
    }

    handleAfterHitEffects(hit: PendingHit) {
        hit.getTarget().performGraphic(SaradominSwordCombatMethod.ENEMY_GRAPHIC);
    }
}
