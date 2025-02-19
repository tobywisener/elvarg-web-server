
import { CombatMethod } from "../../CombatMethod";
import { Graphic } from "../../../../../model/Graphic";
import { GraphicHeight } from "../../../../../model/GraphicHeight";
import { Location } from "../../../../../model/Location";
import { Projectile } from "../../../../../model/Projectile";
import { Mobile } from "../../../../../entity/impl/Mobile";
import { CombatType } from "../../../CombatType";
import { HitDamage } from "../../../hit/HitDamage";
import { HitMask } from "../../../hit/HitMask";
import { PendingHit } from "../../../hit/PendingHit";
import { Animation } from "../../../../../model/Animation";
import { Task } from "../../../../../task/Task";
import { TaskManager } from "../../../../../task/TaskManager";
import { Misc } from "../../../../../../util/Misc";
import { TimerKey } from "../../../../../../util/timers/TimerKey";
import { ChaosElementalCombatMethod } from "./ChaosElementalCombatMethod";

class ChaosTask extends Task {
    constructor(n1: number, private readonly execFunc: Function, target?: Mobile, b?: boolean) {
        super(n1, target, b)
    }
    execute(): void {
        this.execFunc();
        this.stop();
    }
}


enum Attack {
    SPECIAL_ATTACK, DEFAULT_MAGIC_ATTACK
}
export class ChaosFanaticCombatMethod extends CombatMethod {

    private static readonly QUOTES: string[] = ["Burn!", "WEUGH!", "Develish Oxen Roll!",
        "All your wilderness are belong to them!", "AhehHeheuhHhahueHuUEehEahAH",
        "I shall call him squidgy and he shall be my squidgy!",];

    private attack = Attack.DEFAULT_MAGIC_ATTACK;
    private static readonly ATTACK_END_GFX = new Graphic(305, GraphicHeight.HIGH);
    private static readonly EXPLOSION_END_GFX = new Graphic(157, GraphicHeight.MIDDLE);
    private static readonly MAGIC_ATTACK_ANIM = new Animation(811);

    public hits(character: Mobile, target: Mobile): PendingHit[] {
        if (this.attack == Attack.SPECIAL_ATTACK) {
            return null;
        }
        return [new PendingHit(character, target, this, 2)];
    }

    start(character: Mobile, target: Mobile) {
        if (!character.isNpc() || !target.isPlayer())
            return;

        character.performAnimation(ChaosFanaticCombatMethod.MAGIC_ATTACK_ANIM);

        this.attack = Attack.DEFAULT_MAGIC_ATTACK;

        if (Misc.getRandom(9) < 3) {
            this.attack = Attack.SPECIAL_ATTACK;
        }

        character.forceChat(ChaosFanaticCombatMethod.QUOTES[Misc.getRandom(ChaosFanaticCombatMethod.QUOTES.length - 1)]);

        if (this.attack == Attack.DEFAULT_MAGIC_ATTACK) {
            const projectile2 = Projectile.createProjectile(character, target, 554, 62, 80, 31, 43);
            projectile2.sendProjectile();
            if (Misc.getRandom(1) == 0) {
                TaskManager.submit(new ChaosTask(3,() => { target.performGraphic(ChaosFanaticCombatMethod.ATTACK_END_GFX) }, target, false));
            }
        } else if (this.attack == Attack.SPECIAL_ATTACK) {
            let targetPos = target.getLocation();
            let attackPositions = new Array<Location>();
            attackPositions.push(targetPos);
            for (let i = 0; i < 3; i++) {
                attackPositions.push(new Location((targetPos.getX() - 1) + Misc.getRandom(3),
                    (targetPos.getY() - 1) + Misc.getRandom(3)));
            }
            for (let pos of attackPositions) {
                new Projectile(character.getLocation(), pos, null, 551, 40, 80, 31, 43, character.getPrivateArea())
                    .sendProjectile();
            }
            TaskManager.submit(new ChaosTask(4, () => {
                for (let pos of attackPositions) {
                    target.getAsPlayer().getPacketSender().sendGlobalGraphic(ChaosFanaticCombatMethod.EXPLOSION_END_GFX, pos);
                    for (let player of character.getAsNpc().getPlayersWithinDistance(10)) {
                        if (player.getLocation().equals(pos)) {
                            player.getCombat().getHitQueue()
                                .addPendingDamage([new HitDamage(Misc.getRandom(25), HitMask.RED)]);
                        }
                    }
                }
                ChaosFanaticCombatMethod.finished(character, target)
            }));
            character.getTimers().registers(TimerKey.COMBAT_ATTACK, 5);
        }
    }

    static attackDistance(character: Mobile): number {
        return 8;
    }

    static finished(character: Mobile, target: Mobile) {
        if (Misc.getRandom(10) == 1) {
            if (target.isPlayer()) {
                ChaosElementalCombatMethod.disarmAttack(target.getAsPlayer());
            }
        }
    }

    type(): CombatType {
        return CombatType.MAGIC;
    }
}
