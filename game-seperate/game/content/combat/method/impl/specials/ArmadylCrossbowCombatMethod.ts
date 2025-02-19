import { RangedCombatMethod } from "../RangedCombatMethod";
import { Animation } from "../../../../../model/Animation";
import { Priority } from "../../../../../model/Priority";
import { PendingHit } from "../../../hit/PendingHit";
import { Mobile } from "../../../../../entity/impl/Mobile";
import { CombatSpecial } from "../../../CombatSpecial";
import { RangedWeapon } from "../../../ranged/RangedData";
import { CombatFactory } from "../../../CombatFactory";
import { Projectile } from "../../../../../model/Projectile";

export class ArmadylCrossbowCombatMethod extends RangedCombatMethod {
    private static readonly ANIMATION = new Animation(4230);
    hits(character: Mobile, target: Mobile) {
        return [new PendingHit(character, target, this, 2)];
    }

    canAttack(character: Mobile, target: Mobile) {
        const player = character.getAsPlayer();
        if (player.getCombat().getRangedWeapon() != RangedWeapon.ARMADYL_CROSSBOW) {
            return false;
        }
        if (!CombatFactory.checkAmmo(player, 1)) {
            return false;
        }
        return true;
    }

    start(character: Mobile, target: Mobile) {
        const player = character.getAsPlayer();
        CombatSpecial.drain(player, CombatSpecial.ARMADYL_CROSSBOW.getDrainAmount());
        player.performAnimation(ArmadylCrossbowCombatMethod.ANIMATION);
        Projectile.createProjectile(character, target, 301, 50, 70, 44, 35).sendProjectile();
        CombatFactory.decrementAmmo(player, target.getLocation(), 1);
    }
}    