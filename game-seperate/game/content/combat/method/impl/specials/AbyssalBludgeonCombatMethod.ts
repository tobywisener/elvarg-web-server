import { MeleeCombatMethod } from "../MeleeCombatMethod";
import { Animation } from "../../../../../model/Animation";
import { Priority } from "../../../../../model/Priority";
import { Graphic } from "../../../../../model/Graphic";
import { Skill } from "../../../../../model/Skill";
import { Mobile } from "../../../../../entity/impl/Mobile";
import { PendingHit } from '../../../hit/PendingHit';
import { CombatSpecial } from '../../../CombatSpecial';

export class AbyssalBludgeonCombatMethod extends MeleeCombatMethod {
    private static readonly ANIMATION = new Animation(3299);
    private static readonly GRAPHIC = new Graphic(1284, Priority.HIGH);

    hits(character: Mobile, target: Mobile): PendingHit[] {
        const hit = new PendingHit(character, target, this);
        if (character.isPlayer()) {
            const player = character.getAsPlayer();
            const missingPrayer = player.getSkillManager().getMaxLevel(Skill.PRAYER) - player.getSkillManager().getCurrentLevel(Skill.PRAYER);
            const extraDamage = missingPrayer * 0.5;
            hit.getHits()[0].incrementDamage(extraDamage);
            hit.updateTotalDamage();
        }

        return [hit];
    }

    start(character: Mobile, target: Mobile) {
        CombatSpecial.drain(character, CombatSpecial.ABYSSAL_DAGGER.getDrainAmount());
        character.performAnimation(AbyssalBludgeonCombatMethod.ANIMATION);
    }

    handleAfterHitEffects(hit: PendingHit) {
        hit.getTarget().performGraphic(AbyssalBludgeonCombatMethod.GRAPHIC);
    }
}