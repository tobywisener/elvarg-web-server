import { RangedCombatMethod } from "../RangedCombatMethod";
import { Animation } from "../../../../../model/Animation";
import { Priority } from "../../../../../model/Priority";
import { PendingHit } from "../../../hit/PendingHit";
import { CombatSpecial } from "../../../CombatSpecial";
import { RangedWeapon, Ammunition } from "../../../ranged/RangedData";
import { CombatFactory } from "../../../CombatFactory";
import { Projectile } from "../../../../../model/Projectile";
import { Graphic } from "../../../../../model/Graphic";
import { GraphicHeight } from "../../../../../model/GraphicHeight";
import { Mobile } from "../../../../../entity/impl/Mobile";

export class DarkBowCombatMethod extends RangedCombatMethod {

    private static ANIMATION = new Animation(426);
    private static GRAPHIC = new Graphic(1100, GraphicHeight.HIGH);

    public hits(character: Mobile, target: Mobile): PendingHit[] {
        return [new PendingHit(character, target, this, 3, false),
        new PendingHit(character, target, this, 2, false)];
    }

    public canAttack(character: Mobile, target: Mobile): boolean {
        let player = character.getAsPlayer();
        if (player.getCombat().getRangedWeapon() != RangedWeapon.DARK_BOW) {
            return false;
        }
        if (!CombatFactory.checkAmmo(player, 2)) {
            return false;
        }
        return true;
    }

    public start(character: Mobile, target: Mobile) {
        let player = character.getAsPlayer();
        CombatSpecial.drain(player, CombatSpecial.DARK_BOW.getDrainAmount());
        player.performAnimation(DarkBowCombatMethod.ANIMATION);
        let projectileId = 1099;
        if (player.getCombat().getAmmunition() != Ammunition.DRAGON_ARROW) {
            projectileId = 1101;
        }
        Projectile.createProjectile(player, target, projectileId, 40, 70, 43, 31).sendProjectile();
        Projectile.createProjectile(character, target, projectileId, 33, 74, 48, 31).sendProjectile();
        CombatFactory.decrementAmmo(player, target.getLocation(), 2);
    }

    public attackSpeed(character: Mobile): number {
        return super.attackSpeed(character) + 1;
    }

    public handleAfterHitEffects(hit: PendingHit) {
        hit.getTarget().performGraphic(DarkBowCombatMethod.GRAPHIC);
    }
}
