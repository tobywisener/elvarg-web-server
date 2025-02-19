import { Location } from "../../../model/Location";
import { World } from "../../../World";
import { TaskManager } from "../../../task/TaskManager";
import { FightCavesArea } from "../../../model/areas/impl/FightCavesArea";
import { TztokJad } from "../../../entity/impl/npc/impl/TztokJad";
import { Player } from "../../../entity/impl/player/Player";
import { Task } from "../../../task/Task";

class FightCavesTask extends Task{

    constructor(private readonly execFunction: Function){
        super(4, true)
    }

    execute(): void {
        this.execFunction();
    }
}

export class FightCaves {
    public static readonly ENTRANCE: Location = new Location(2413, 5117);
    public static readonly EXIT: Location = new Location(2438, 5168);
    private static readonly JAD_SPAWN_POS: Location = new Location(2401, 5088);
    private static readonly JAD_NPC_ID: number = 3127;

    public static start(player: Player) {
        const area = new FightCavesArea();
        area.add(player);
        TaskManager.submit(new FightCavesTask(() => {
            const result = [14, player, false];
            const callback = () => {
                if (area.isDestroyed()) {
                    return;
                }
                World.getAddNPCQueue().push(new TztokJad(player, area, FightCaves.JAD_NPC_ID, FightCaves.JAD_SPAWN_POS.clone()));
            };
        }));
    }
}