import { MeleeCombatMethod } from "../MeleeCombatMethod";
import { Animation } from "../../../../../model/Animation";
import { Graphic } from "../../../../../model/Graphic";
import { Priority } from "../../../../../model/Priority";
import { PendingHit } from "../../../hit/PendingHit";
import { Mobile } from "../../../../../entity/impl/Mobile";
import { CombatSpecial } from "../../../CombatSpecial";
import { Skill } from "../../../../../model/Skill";
import { Misc } from "../../../../../../util/Misc";

export class BandosGodswordCombatMethod extends MeleeCombatMethod {

    private static ANIMATION = new Animation(7642);
    private static GRAPHIC = new Graphic(1212, Priority.HIGH);

    start(character: Mobile, target: Mobile) {
        CombatSpecial.drain(character, CombatSpecial.BANDOS_GODSWORD.getDrainAmount());
        character.performAnimation(BandosGodswordCombatMethod.ANIMATION);
        character.performGraphic(BandosGodswordCombatMethod.GRAPHIC);
    }

    handleAfterHitEffects(hit: PendingHit) {
        if (hit.isAccurate() && hit.getTarget().isPlayer()) {
            let skillDrain = 1;
            let damageDrain = (hit.getTotalDamage() * 0.1);
            if (damageDrain < 0)
                return;
            let player = hit.getAttacker().getAsPlayer();
            let target = hit.getTarget().getAsPlayer();
            let skill = Object.values(Skill)[skillDrain];
            target.getSkillManager().setCurrentLevels(skill, player.getSkillManager().getCurrentLevel(skill) - damageDrain);
            if (target.getSkillManager().getCurrentLevel(skill) < 1)
                target.getSkillManager().setCurrentLevels(skill, 1);
            player.getPacketSender().sendMessage("You've drained " + target.getUsername() + "'s " + Misc.formatText(Object.values(Skill)[skillDrain].toString().toLowerCase()) + " level by " + damageDrain + ".");
            target.getPacketSender().sendMessage("Your " + skill.getName() + " level has been drained.");
        }
    }
}
