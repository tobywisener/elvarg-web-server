import { CombatMethod } from "../CombatMethod";
import { CombatType } from "../../CombatType";
import { CombatFactory } from "../../CombatFactory";
import { PendingHit } from "../../hit/PendingHit";
import { Ammunition, RangedWeapon, RangedWeaponType, } from "../../ranged/RangedData";
import { Mobile } from "../../../../entity/impl/Mobile";
import { Animation } from "../../../../model/Animation";
import { Projectile } from "../../../../model/Projectile";
import { Sound } from "../../../../Sound";
import { Sounds } from "../../../../Sounds";
export class RangedCombatMethod extends CombatMethod {
    type(): CombatType {
        return CombatType.RANGED;
    }

    hits(character: Mobile, target: Mobile): PendingHit[] {
        if (character.getCombat().getRangedWeapon() === RangedWeapon.DARK_BOW) {
            return [new PendingHit(character, target, this, 1), new PendingHit(character, target, this, 2)];
        }
        if (character.getCombat().getRangedWeapon() === RangedWeapon.BALLISTA) {
            return [new PendingHit(character, target, this, 2)];
        }

        return [new PendingHit(character, target, this, 1)];
    }

    canAttack(character: Mobile, target: Mobile): boolean {
        if (character.isNpc()) {
            return true;
        }

        const p = character.getAsPlayer();

        let ammoRequired = 1;
        if (p.getCombat().getRangedWeapon() === RangedWeapon.DARK_BOW) {
            ammoRequired = 2;
        }
        if (!CombatFactory.checkAmmo(p, ammoRequired)) {
            return false;
        }
        return true;
    }

    start(character: Mobile, target: Mobile) {
        const ammo = character.getCombat().getAmmunition();
        const rangedWeapon = character.getCombat().getRangedWeapon();
        const animation = character.getAttackAnim();

        if (animation !== -1) {
            character.performAnimation(new Animation(animation));
        }

        if (ammo && ammo.getStartGraphic()) {

            // Check toxic blowpipe, it shouldn't have any start gfx.
            if (character.getCombat().getRangedWeapon()) {
                if (character.getCombat().getRangedWeapon() === RangedWeapon.TOXIC_BLOWPIPE) {
                    return;
                }
            }

            // Perform start gfx for ammo
            character.performGraphic(ammo.getStartGraphic());
        }

        if (!ammo || !rangedWeapon) {
            return;
        }

        let projectileId = ammo.getProjectileId();
        let delay = 40;
        let speed = 57;
        let heightEnd = 31;
        let heightStart = 43;

        if (rangedWeapon.getType() === RangedWeaponType.CROSSBOW) {
            delay = 46;
            speed = 62;
            heightStart = 44;
            heightEnd = 35;
        } else if (rangedWeapon.getType() === RangedWeaponType.LONGBOW) {
            speed = 70;
        } else if (rangedWeapon.getType() === RangedWeaponType.BLOWPIPE) {
            speed = 60;
            heightStart = 40;
            heightEnd = 35;
        }
        if (ammo === Ammunition.TOKTZ_XIL_UL) {
            delay = 30;
            speed = 55;
        }

        // Fire projectile
        Projectile.createProjectile(character, target, projectileId, delay, speed, heightStart, heightEnd).sendProjectile();

        // Send sound
        Sounds.sendSound(character.getAsPlayer(), Sound.SHOOT_ARROW);

        // Dark bow sends two arrows, so send another projectile and delete another
        // arrow.
        if (rangedWeapon === RangedWeapon.DARK_BOW) {
            Projectile.createProjectile(character, target, ammo.getProjectileId(), delay - 7, speed + 4, heightStart + 5, heightEnd).sendProjectile();

            // Decrement 2 ammo if d bow
            if (character.isPlayer()) {
                CombatFactory.decrementAmmo(character.getAsPlayer(), target.getLocation(), 2);
            }

        } else {

            // Decrement 1 ammo
            if (character.isPlayer()) {
                CombatFactory.decrementAmmo(character.getAsPlayer(), target.getLocation(), 1);
            }
        }
    }

    attackDistance(character: Mobile): number {
        const bow = character.getCombat().getRangedWeapon();
        if (bow) {
            if (character.isNpc() || (character.isPlayer() && character.getAsPlayer().getFightType() === bow.getType().getLongRangeFightType())) {
                return bow.getType().getLongRangeDistance();
            }
            return bow.getType().getDefaultDistance();
        }
        return 6;
    }

}
