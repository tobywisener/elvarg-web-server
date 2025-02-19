import { MeleeCombatMethod } from "../MeleeCombatMethod";
import { Animation } from "../../../../../model/Animation";
import { Graphic } from "../../../../../model/Graphic";
import { Priority } from "../../../../../model/Priority";
import { Mobile } from "../../../../../entity/impl/Mobile";
import { CombatSpecial } from "../../../CombatSpecial";
import { PendingHit } from "../../../hit/PendingHit";
import { Skill } from "../../../../../model/Skill";

export class DragonWarhammerCombatMethod extends MeleeCombatMethod {
    private static ANIMATION = new Animation(1378);
    private static GRAPHIC = new Graphic(1292, Priority.HIGH);

    start(character: Mobile, target: Mobile): void {
        CombatSpecial.drain(character, CombatSpecial.DRAGON_WARHAMMER.getDrainAmount());
        character.performAnimation(DragonWarhammerCombatMethod.ANIMATION);
        character.performGraphic(DragonWarhammerCombatMethod.GRAPHIC);
    }

    handleAfterHitEffects(hit: PendingHit): void {
        if (hit.isAccurate() && hit.getTarget().isPlayer()) {
            let damageDrain = Math.floor(hit.getTotalDamage() * 0.3);
            if (damageDrain < 0) return;
            let player = hit.getAttacker().getAsPlayer();
            let target = hit.getTarget().getAsPlayer();
            target.getSkillManager().decreaseCurrentLevel(Skill.DEFENCE, damageDrain, 1);
            player.getPacketSender().sendMessage(`You've drained ${target.getUsername()}'s Defence level by ${damageDrain}.`);
            target.getPacketSender().sendMessage("Your Defence level has been drained.");
        }
    }
}
