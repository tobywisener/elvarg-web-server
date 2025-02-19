import { RangedCombatMethod } from "../RangedCombatMethod";
import { Animation } from "../../../../../model/Animation";
import { Priority } from "../../../../../model/Priority";
import { PendingHit } from "../../../hit/PendingHit";
import { CombatSpecial } from "../../../CombatSpecial";
import { RangedWeapon } from "../../../ranged/RangedData";
import { CombatFactory } from "../../../CombatFactory";
import { Projectile } from "../../../../../model/Projectile";
import { Graphic } from "../../../../../model/Graphic";
import { GraphicHeight } from "../../../../../model/GraphicHeight";
import { Mobile } from "../../../../../entity/impl/Mobile";

export class MagicShortbowCombatMethod extends RangedCombatMethod {
    private static ANIMATION = new Animation(1074);
    private static GRAPHIC = new Graphic(250, GraphicHeight.HIGH);

    hits(character: Mobile, target: Mobile): PendingHit[] {
        return [new PendingHit(character, target, this, 3), new PendingHit(character, target, this, 2)];
    }

    canAttack(character: Mobile, target: Mobile): boolean {
        const player = character.getAsPlayer();
        if (player.getCombat().getRangedWeapon() != RangedWeapon.MAGIC_SHORTBOW) {
            return false;
        }
        if (!CombatFactory.checkAmmo(player, 2)) {
            return false;
        }
        return true;
    }

    start(character: Mobile, target: Mobile) {
        const player = character.getAsPlayer();
        CombatSpecial.drain(player, CombatSpecial.MAGIC_SHORTBOW.getDrainAmount());
        player.performAnimation(MagicShortbowCombatMethod.ANIMATION);
        player.performGraphic(MagicShortbowCombatMethod.GRAPHIC);
        Projectile.createProjectile(player, target, 249, 40, 57, 43, 31).sendProjectile();
        Projectile.createProjectile(character, target, 249, 33, 57, 48, 31).sendProjectile();
        CombatFactory.decrementAmmo(player, target.getLocation(), 2);
    }

    attackSpeed(character: Mobile): number {
        return super.attackSpeed(character) + 1;
    }
}
