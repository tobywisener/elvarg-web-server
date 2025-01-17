import { CombatMethod } from "../../CombatMethod";
import { Animation } from "../../../../../model/Animation";
import { Graphic } from "../../../../../model/Graphic";
import { GraphicHeight } from "../../../../../model/GraphicHeight";
import { SecondsTimer } from "../../../../../model/SecondsTimer";
import { CombatType } from "../../../CombatType";
import { Mobile } from "../../../../../entity/impl/Mobile";
import { PendingHit } from "../../../hit/PendingHit";
import { Projectile } from "../../../../../model/Projectile";
import { Misc } from "../../../../../../util/Misc";
import { TimerKey } from "../../../../../../util/timers/TimerKey";
import { CombatFactory } from "../../../CombatFactory";
import { Location } from "../../../../../model/Location";
import { TaskManager } from "../../../../../task/TaskManager";
import { ForceMovementTask } from "../../../../../task/impl/ForceMovementTask";
import { ForceMovement } from "../../../../../model/ForceMovement";

export class CallistoCombatMethod extends CombatMethod {
    private static MELEE_ATTACK_ANIMATION = new Animation(4925);
    private static END_PROJECTILE_GRAPHIC = new Graphic(359, GraphicHeight.HIGH);

    private comboTimer = new SecondsTimer();
    private currentAttackType = CombatType.MELEE;

    type(): CombatType {
        return this.currentAttackType;
    }

    hits(character: Mobile, target: Mobile): PendingHit[] {
        return [new PendingHit(character, target, this, 2)];
    }

    start(character: Mobile, target: Mobile) {
        character.performAnimation(CallistoCombatMethod.MELEE_ATTACK_ANIMATION);
        if (this.currentAttackType === CombatType.MAGIC) {
            const projectile2 = Projectile.createProjectile(character, target, 395, 40, 60, 31, 43);
            projectile2.sendProjectile();
        }
    }

    attackDistance(character: Mobile): number {
        return 4;
    }

    finished(character: Mobile, target: Mobile) {
        this.currentAttackType = CombatType.MELEE;

        if (this.comboTimer.finished()) {
            if (Misc.getRandom(10) <= 2) {
                this.comboTimer.start(5);
                this.currentAttackType = CombatType.MAGIC;
                character.getCombat().performNewAttack(true);
            }
        }
    }

    handleAfterHitEffects(hit: PendingHit) {
        if (!hit.getTarget() || !hit.getTarget().isPlayer()) {
            return;
        }

        const player = hit.getTarget().getAsPlayer();

        if (this.currentAttackType == CombatType.MAGIC) {
            player.performGraphic(CallistoCombatMethod.END_PROJECTILE_GRAPHIC);
        }

        if (!player.getTimers().has(TimerKey.STUN) && Misc.getRandom(100) <= 10) {
            player.performAnimation(new Animation(3131));
            const toKnock = new Location(player.getLocation().getX() > 3325 ? -3 : 1 + Misc.getRandom(2),
                player.getLocation().getY() > 3834 && player.getLocation().getY() < 3843 ? 3 : -3);
            TaskManager.submit(new ForceMovementTask(player, 3,
                new ForceMovement(player.getLocation().clone(), toKnock, 0, 15, 0, 0)));
            CombatFactory.stun(player, 4, false);
        }
    }
}
