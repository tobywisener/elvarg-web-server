import { CombatType } from '../../../../CombatType';
import { NPC } from '../../../../../../entity/impl/npc/NPC';
import { Mobile } from '../../../../../../entity/impl/Mobile';
import { Location } from '../../../../../../model/Location';
import { World } from '../../../../../../World';
import { PathFinder } from '../../../../../../model/movement/path/PathFinder';
import { MeleeCombatMethod } from '../../MeleeCombatMethod';
import { Task } from '../../../../../../task/Task';
import { TaskManager } from '../../../../../../task/TaskManager';
import { Graphic } from '../../../../../../model/Graphic';
import { GraphicHeight } from '../../../../../../model/GraphicHeight';
import { NpcIdentifiers } from '../../../../../../../util/NpcIdentifiers';

export class ShifterCombatMethod extends MeleeCombatMethod {

    public type(): CombatType {
        return CombatType.MELEE;
    }

    private static readonly CENTER = new Location(2657, 2592, 0);

    public onTick(npc: NPC, target: Mobile): void {
        if (npc == null || npc.isDyingFunction()) {
            return;
        }

        const knight = World.getNpcs().stream()
            .find((n) => n != null && n.getId() == NpcIdentifiers.VOID_KNIGHT_8);

        if (!knight) {
            return;
        }

        const knightNPC = knight.getAsNpc();

        if (target == null) {
            if (Math.random() <= 0.2) {
                // 20% chance to tp to middle
                this.teleport(npc, null, true);
                PathFinder.calculateEntityRoute(
                    npc,
                    knightNPC.getLocation().getX(),
                    knightNPC.getLocation().getY()
                );
                npc.getCombat().setTarget(knightNPC);
            } else {
                const players = World.getPlayers();
                const p = players.stream().find(n => n !== null && n.getLocation().isWithinDistance(n.getLocation(), 10));
              
                if (!p) {
                  return;
                }
              
                const t = p;
                PathFinder.calculateEntityRoute(
                  npc,
                  p.getLocation().getX(),
                  p.getLocation().getY()
                );
                npc.getCombat().setTarget(t);
              }
        } else {
            const distance = target.getLocation().getDistance(npc.getLocation());

            if (distance > 1) {
                if (Math.random() <= 0.1) {
                    this.teleport(npc, target, false);
                }
            }
        }
    }

    private teleport(npc: NPC, target: Mobile | null, center: boolean): void {
        World.sendLocalGraphics(654, npc.getLocation());

        TaskManager.submit(
            new ShifterTask(() => {
                let ticks: number = 0;


                ticks++;

                if (ticks === 1) {
                    if (center) {
                        target.smartMove(ShifterCombatMethod.CENTER, 2);
                    } else {
                        target.smartMove(target?.getLocation() ?? new Location(0, 0, 0), 2);
                    }
                    npc.performGraphic(new Graphic(654));
                }

                if (ticks === 2) {
                    npc.performGraphic(new Graphic(654));
                    stop();
                }

            }
            ));
    }
}

class ShifterTask extends Task {
    constructor(private readonly execFunc: Function) {
        super(1, false)
    }
    execute(): void {
        this.execFunc();
    }

}