import { CombatMethod } from "../../CombatMethod";
import { PendingHit } from "../../../hit/PendingHit";
import { Misc } from "../../../../../../util/Misc";
import { CombatType } from "../../../CombatType";
import { Mobile } from "../../../../../entity/impl/Mobile";
import { Projectile } from "../../../../../model/Projectile";
import { PrayerHandler } from "../../../../PrayerHandler";
import { CombatEquipment } from "../../../CombatEquipment";
import { CombatFactory } from "../../../CombatFactory";
import { PoisonType } from "../../../../../task/impl/CombatPoisonEffect";
import { Player } from "../../../../../entity/impl/player/Player";
import { Animation } from "../../../../../model/Animation";

enum Breath {
    ICE, POISON, SHOCK, DRAGON
}

export class KingBlackDragonMethod extends CombatMethod {
    private static currentAttackType = CombatType.MAGIC;
    private static currentBreath = Breath.DRAGON;

    static start(character: Mobile, target: Mobile) {
        if (this.currentAttackType === CombatType.MAGIC) {
            character.performAnimation(new Animation(84));
            switch (this.currentBreath) {
                case Breath.DRAGON:
                    Projectile.createProjectile(character, target, 393, 40, 55, 31, 43).sendProjectile;
                    break;
                case Breath.ICE:
                    Projectile.createProjectile(character, target, 396, 40, 55, 31, 43).sendProjectile();
                    break;
                case Breath.POISON:
                    Projectile.createProjectile(character, target, 394, 40, 55, 31, 43).sendProjectile();
                    break;
                case Breath.SHOCK:
                    Projectile.createProjectile(character, target, 395, 40, 55, 31, 43).sendProjectile();
                    break;
                default:
                    break;
            }
        } else if (this.currentAttackType === CombatType.MELEE) {
            character.performAnimation( new Animation(91));
        }
    }

    static attackSpeed(character: Mobile): number {
        return this.currentAttackType === CombatType.MAGIC ? 6 : 4;
    }

    static attackDistance(character: Mobile): number {
        return 8;
    }

    type(): CombatType {
        return KingBlackDragonMethod.currentAttackType;
    }

    hits(character: Mobile, target: Player): PendingHit[] {
        let hit = new PendingHit(character, target, this, 1);
        if (target.isPlayer()) {
            let p = target.getAsPlayer();
            if (KingBlackDragonMethod.currentAttackType === CombatType.MAGIC && KingBlackDragonMethod.currentBreath === Breath.DRAGON) {
                if (PrayerHandler.isActivated(p, PrayerHandler.PROTECT_FROM_MAGIC) && CombatEquipment.hasDragonProtectionGear(p) && !p.getCombat().getFireImmunityTimer().finished()) {
                    target.getPacketSender().sendMessage("You're protected against the dragonfire breath.");
                    return [hit];
                }
                let extendedHit = 25;
                if (PrayerHandler.isActivated(p, PrayerHandler.PROTECT_FROM_MAGIC)) {
                    extendedHit -= 5;
                }
                if (!p.getCombat().getFireImmunityTimer().finished()) {
                    extendedHit -= 10;
                }
                if (CombatEquipment.hasDragonProtectionGear(p)) {
                    extendedHit -= 10;
                }
                p.getPacketSender().sendMessage("The dragonfire burns you.");
                hit.getHits()[0].incrementDamage(extendedHit);
            }
            if (KingBlackDragonMethod.currentAttackType === CombatType.MAGIC) {
                switch (KingBlackDragonMethod.currentBreath) {
                    case Breath.ICE:
                        CombatFactory.freeze(hit.getTarget().getAsPlayer(), 5);
                        break;
                    case Breath.POISON:
                        CombatFactory.poisonEntity(hit.getTarget().getAsPlayer(), PoisonType.SUPER);
                        break;
                    default:
                        break;
                }
            }
        }
        return [hit];
    }

    static finished(character: Mobile, target: Mobile) {
        if (character.getLocation().getDistance(target.getLocation()) <= 3) {
            if (Misc.randomInclusive(0, 2) === 0) {
                this.currentAttackType = CombatType.MAGIC;
            } else {
                this.currentAttackType = CombatType.MELEE;
            }
        } else {
            this.currentAttackType = CombatType.MAGIC;
        }
        if (this.currentAttackType === CombatType.MAGIC) {
            let random = Misc.randomInclusive(0, 10);
            if (random >= 0 && random <= 3) {
                this.currentBreath = Breath.DRAGON;
            } else if (random >= 4 && random <= 6) {
                this.currentBreath = Breath.SHOCK;
            } else if (random >= 7 && random <= 9) {
                this.currentBreath = Breath.POISON;
            } else {
                this.currentBreath = Breath.ICE;
            }
        }
    }
}