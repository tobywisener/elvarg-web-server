import { CombatMethod } from "../../CombatMethod";
import { Animation } from "../../../../../model/Animation";
import { Graphic } from "../../../../../model/Graphic";
import { GraphicHeight } from "../../../../../model/GraphicHeight";
import { CombatType } from "../../../CombatType";
import { Mobile } from "../../../../../entity/impl/Mobile";
import { PendingHit } from "../../../hit/PendingHit";
import { Projectile } from "../../../../../model/Projectile";
import { Misc } from "../../../../../../util/Misc";
import { Skill } from "../../../../../model/Skill";

export class VenenatisCombatMethod extends CombatMethod {
    static readonly MELEE_ATTACK_ANIMATION = new Animation(5319);
    static readonly MAGIC_ATTACK_ANIMATION = new Animation(5322);
    static readonly DRAIN_PRAYER_GRAPHIC = new Graphic(172, GraphicHeight.MIDDLE);

    currentAttackType = CombatType.MELEE;

    type(): CombatType {
        return this.currentAttackType;
    }

    hits(character: Mobile, target: Mobile): PendingHit[] {
        return [new PendingHit(character, target, this, 1)];
    }

    start(character: Mobile, target: Mobile) {
        if (this.currentAttackType === CombatType.MAGIC) {
            character.performAnimation(VenenatisCombatMethod.MAGIC_ATTACK_ANIMATION);
            Projectile.createProjectile(character, target, 165, 40, 55, 31, 43).sendProjectile();
        } else if (this.currentAttackType === CombatType.MELEE) {
            character.performAnimation(VenenatisCombatMethod.MELEE_ATTACK_ANIMATION);
        }
    }

    attackDistance(character: Mobile): number {
        return 4;
    }

    finished(character: Mobile, target: Mobile) {
        // Switch attack type after each attack
        if (this.currentAttackType === CombatType.MAGIC) {
            this.currentAttackType = CombatType.MELEE;
        } else {
            this.currentAttackType = CombatType.MAGIC;
            // Have a chance of comboing with magic by reseting combat delay.
            if (Misc.getRandom(10) <= 3) {
                character.getCombat().performNewAttack(true);
            }
        }
    }

    handleAfterHitEffects(hit: PendingHit) {
        if (!hit.isAccurate() || hit.getTarget() == null || !hit.getTarget().isPlayer()) {
            return;
        }
        // Drain prayer randomly 15% chance
        if (Misc.getRandom(100) <= 15) {
            const player = hit.getTarget().getAsPlayer();
            hit.getTarget().performGraphic(VenenatisCombatMethod.DRAIN_PRAYER_GRAPHIC);
            player.getSkillManager().decreaseCurrentLevel(Skill.PRAYER, (hit.getTotalDamage() * 0.35) as number, 0);
            player.getPacketSender().sendMessage("Venenatis drained your prayer!");
        }
    }
}