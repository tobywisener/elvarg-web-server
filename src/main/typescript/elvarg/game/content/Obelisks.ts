import { World } from '../../game/World';
import { GameObject } from '../entity/impl/object/GameObject';
import { ObjectManager } from '../entity/impl/object/ObjectManager';
import { Graphic } from '../model/Graphic';
import { Location } from '../model/Location';
import { WildernessArea } from '../model/areas/impl/WildernessArea';
import { Task } from '../task/Task';
import { TaskManager } from '../task/TaskManager';
import { Misc } from '../../util/Misc';
import { TeleportType } from '../model/teleportation/TeleportType';

class ObeliskTask extends Task{
    constructor(private readonly func: Function, private readonly funcStop: Function){
        super(4, false);

    }
    execute(): void {
        this.func();
        this.stop();
    }

    stop() {
        super.stop();
        this.funcStop();
    }
    
}


export class Obelisks {

    static activate(objectId: number): boolean {
        const index = this.getObeliskIndex(objectId);
        if (index >= 0) {
            if (!Obelisks.OBELISK_ACTIVATED[index]) {
                Obelisks.OBELISK_ACTIVATED[index] = true;
                ObjectManager.register(new GameObject(14825, new Location(Obelisks.OBELISK_COORDS[index][0], Obelisks.OBELISK_COORDS[index][1]), 10, 0, null), true);
                ObjectManager.register(new GameObject(14825, new Location(Obelisks.OBELISK_COORDS[index][0] + 4, Obelisks.OBELISK_COORDS[index][1]), 10, 0, null), true);
                ObjectManager.register(new GameObject(14825, new Location(Obelisks.OBELISK_COORDS[index][0], Obelisks.OBELISK_COORDS[index][1] + 4), 10, 0, null), true);
                ObjectManager.register(new GameObject(14825, new Location(Obelisks.OBELISK_COORDS[index][0] + 4, Obelisks.OBELISK_COORDS[index][1] + 4), 10, 0, null), true);
                TaskManager.submit(new ObeliskTask(() => {
                    const obeliskLocation = new Location(Obelisks.OBELISK_COORDS[index][0] + 2,
                        Obelisks.OBELISK_COORDS[index][1] + 2);
                    let random = Misc.getRandom(5);
                    while (random == index)
                        random = Misc.getRandom(5);
                    const newLocation = new Location(Obelisks.OBELISK_COORDS[random][0] + 2,
                        Obelisks.OBELISK_COORDS[random][1] + 2);
                    for (const player of World.getPlayers()) {
                        if (player == null || !(player.getArea() instanceof WildernessArea))
                            continue;
                        if (player.getLocation().isWithinDistance(obeliskLocation, 1) && !player.getCombat().getTeleblockTimer().finished())
                            player.getPacketSender().sendMessage("A magical spell is blocking you from teleporting.");

                        if (player.getLocation().isWithinDistance(obeliskLocation, 1) && player.getCombat().getTeleblockTimer().finished()) {
                            player.performGraphic(new Graphic(661));
                            player.moveTo(newLocation);
                            player.performAnimation(TeleportType.NORMAL.getEndAnimation());
                        }
                    }
                    Obelisks.deactivate(index);
                }, ()=> {
                    Obelisks.OBELISK_ACTIVATED[index] = false;
                }));
            }
            return true;
        }
        return false;
    }


    public static deactivate(index: number): void {
        let obeliskX: number, obeliskY: number;
        for (let i = 0; i < this.obelisks.length; i++) {
          obeliskX = i == 1 || i == 3 ? this.OBELISK_COORDS[index][0] + 4 : this.OBELISK_COORDS[index][0];
          obeliskY = i >= 2 ? this.OBELISK_COORDS[index][1] + 4 : this.OBELISK_COORDS[index][1];
          ObjectManager.register(
            new GameObject(this.OBELISK_IDS[index], new Location(obeliskX, obeliskY), 10, 0, undefined),
            true
          );
        }
      }

    /*
     * Obelisk ids
     */
    public static readonly OBELISK_IDS: number[] = [14829, 14830, 14827, 14828, 14826, 14831];

    /*
     * The obelisks
     */
    public static readonly obelisks: GameObject[] = new Array(4);

    /*
     * Are the obelisks activated?
     */
    private static readonly OBELISK_ACTIVATED: boolean[] = new Array(Obelisks.OBELISK_IDS.length);

    /*
     * Obelisk coords
     */
    private static readonly OBELISK_COORDS: number[][] = [
        [3154, 3618],
        [3225, 3665],
        [3033, 3730],
        [3104, 3792],
        [2978, 3864],
        [3305, 3914]
    ];

    public static getObeliskIndex(id: number) {
        for (let j = 0; j < Obelisks.OBELISK_IDS.length; j++) {
            if (Obelisks.OBELISK_IDS[j] == id)
                return j;
        }
        return -1;
    }
}