import { CombatMethod } from "../../CombatMethod"
import { Animation } from "../../../../../model/Animation";
import { Graphic } from "../../../../../model/Graphic";
import { CombatType } from "../../../CombatType";
import { Mobile } from "../../../../../entity/impl/Mobile";
import { PendingHit } from "../../../hit/PendingHit";
import { Projectile } from "../../../../../model/Projectile";
import { Misc } from "../../../../../../util/Misc";
import { TaskManager } from "../../../../../task/TaskManager";
import { HitMask } from "../../../hit/HitMask";
import {TimerKey} from '../../../../../../util/timers/TimerKey';
import { Task } from "../../../../../task/Task";
import { HitDamage } from "../../../hit/HitDamage";
import { Location } from "../../../../../model/Location";

class VetionCombatMethodTask extends Task{

    constructor(private readonly execFunction: Function){
        super(4, true)
    }

    execute(): void {
        this.execFunction();
    }
}

export class VetionCombatMethod implements CombatMethod {
    public onCombatBegan(character: Mobile, target: Mobile): void {

    }
    public onCombatEnded(character: Mobile, target: Mobile): void {

    }
    public handleAfterHitEffects(hit: PendingHit): void {

    }
    public attackSpeed(character: Mobile): number {
        return character.getBaseAttackSpeed();
    }
    private attack = CombatType.MELEE;
    private static readonly MAGIC_END_GFX = new Graphic(281);

    canAttack(character: Mobile, target: Mobile): boolean {
        return true;
    }

    hits(character: Mobile, target: Mobile): PendingHit[] {
        if (this.attack === CombatType.MAGIC) {
            return null;
        }
        return [new PendingHit(character, target, this, 2)];
    }

    start(character: Mobile, target: Mobile) {
        if (!character.isNpc() || !target.isPlayer()) {
            return;
        }
        character.performAnimation(new Animation(character.getAttackAnim()));
        if (target.getLocation().getDistance(character.getLocation()) < 2 && Misc.getRandom(1) === 0) {
            this.attack = CombatType.MELEE;
        } else {
            this.attack = CombatType.MAGIC;
        }

        if (this.attack === CombatType.MAGIC) {
            const targetPos = target.getLocation();
            const attackPositions: Location[] = [];
            attackPositions.push(targetPos);
            for (let i = 0; i < 2; i++) {
                attackPositions.push(new Location((targetPos.getX() - 1) + Misc.getRandom(3),
                (targetPos.getY() - 1) + Misc.getRandom(3)));
            }
            for (const pos of attackPositions) {
                new Projectile(character.getLocation(), pos, null, 280, 40, 80, 31, 43, character.getPrivateArea()).sendProjectile();
            }
            TaskManager.submit(new VetionCombatMethodTask(()=>{for (const pos of attackPositions) {
                target.getAsPlayer().getPacketSender().sendGlobalGraphic(VetionCombatMethod.MAGIC_END_GFX, pos);
                for (const player of character.getAsNpc().getPlayersWithinDistance(10)) {
                    if (player.getLocation().equals(pos)) {
                        player.getCombat().getHitQueue()
                            .addPendingDamage([new HitDamage(Misc.getRandom(25), HitMask.RED)]);
                    }
                }
            }
            this.finished(character, target)}));
            character.getTimers().registers(TimerKey.COMBAT_ATTACK, 5);
        }
    }

    attackDistance(character: Mobile): number {
        if (this.attack === CombatType.MELEE) {
            return 2;
        }
        return 8;
    }

    type(): CombatType {
        return this.attack;
    }

    public finished(character: Mobile, target: Mobile): void {
        
    }
}