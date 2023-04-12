import { CombatMethod } from "../../CombatMethod";
import { Graphic } from "../../../../../model/Graphic";
import { Projectile } from "../../../../../model/Projectile";
import { Mobile } from "../../../../../entity/impl/Mobile";
import { CombatType } from "../../../CombatType";
import { PendingHit } from "../../../hit/PendingHit";
import { Animation } from "../../../../../model/Animation";
import { Priority } from "../../../../../model/Priority";
import { Misc } from "../../../../../../util/Misc";

export class JadCombatMethod extends CombatMethod {

    private static MAGIC_ATTACK_ANIM = new Animation(2656);
    private static RANGED_ATTACK_ANIM = new Animation(2652);
    private static MELEE_ATTACK_ANIM = new Animation(2655);
    private static MAGIC_ATTACK_PROJECTILE = 448;
    private static RANGED_ATTACK_GRAPHIC = new Graphic(451, Priority.MEDIUM);
    private combatType: CombatType;

    start(character: Mobile, target: Mobile) {
        this.combatType = Misc.getRandom(1) == 0 ? CombatType.RANGED : CombatType.MAGIC;
        if (character.calculateDistance(target) <= 1 && Misc.getRandom(1) == 0) {
            this.combatType = CombatType.MELEE;
        }
        switch (this.combatType) {
            case CombatType.MELEE:
                character.performAnimation(JadCombatMethod.MELEE_ATTACK_ANIM);
                break;
            case CombatType.RANGED:
                character.performAnimation(JadCombatMethod.RANGED_ATTACK_ANIM);
                target.delayedGraphic(JadCombatMethod.RANGED_ATTACK_GRAPHIC, 2);
                break;
            case CombatType.MAGIC:
                character.performAnimation(JadCombatMethod.MAGIC_ATTACK_ANIM);
                const projectile2 = Projectile.createProjectile(character, target, 395, 25, 100, 110, 33);
                projectile2.sendProjectile();
                break;
            default:
                break;
        }
    }

    hits(character: Mobile, target: Mobile) {
        let hitDelay = (this.combatType == CombatType.MELEE ? 1 : 3);
        return [new PendingHit(character, target, this, hitDelay)];
    }

    attackDistance(character: Mobile) {
        return 10;
    }

    type() {
        return this.combatType;
    }
}
