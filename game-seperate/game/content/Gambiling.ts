import { Player } from '../entity/impl/player/Player';
import { ObjectManager } from '../entity/impl/object/ObjectManager';
import { MovementQueue } from '../model/movement/MovementQueue';
import { TaskManager } from '../task/TaskManager';
import { GameObject } from '../entity/impl/object/GameObject';
import { TimedObjectSpawnTask } from '../task/impl/TimedObjectSpawnTask';
import { Animation } from '../model/Animation';


export class Gambling {
    public static MITHRIL_SEEDS = 299;

    public static plantFlower(player: Player) {
        if (!player.getClickDelay().elapsedTime(3000)) {
            return;
        }
        for (let npc of player.getLocalNpcs()) {
            if (npc != null && npc.getLocation().equals(player.getLocation())) {
                player.getPacketSender().sendMessage("You cannot plant a seed right here.");
                return;
            }
        }
        if (ObjectManager.existsLocation(player.getLocation())) {
            player.getPacketSender().sendMessage("You cannot plant a seed right here.");
            return;
        }
        const flowers = FlowersData.generate();
        const flowerObject = new GameObject(flowers.objectId, player.getLocation().clone(), 10, 0, player.getPrivateArea());

        //Stop skilling..
        player.getSkillManager().stopSkillable();
        player.getMovementQueue().reset();
        player.getInventory().deleteNumber(Gambling.MITHRIL_SEEDS, 1);
        player.performAnimation(new Animation(827));
        player.getPacketSender().sendMessage("You plant the seed and suddenly some flowers appear..");
        MovementQueue.clippedStep(player);
        //Start a task which will spawn and then delete them after a period of time.
        TaskManager.submit(new TimedObjectSpawnTask(flowerObject, 60, null));
        player.setPositionToFace(flowerObject.getLocation());
        player.getClickDelay().reset();
    }

    

}

class FlowersData {
    static readonly WHITE_FLOWERS = new FlowersData(2980, 2460);
    static readonly BLACK_FLOWERS = new FlowersData(2981, 2462);
    static readonly RED_FLOWERS = new FlowersData(2982, 2464);
    static readonly YELLOW_FLOWERS = new FlowersData(2983, 2466);
    static readonly PURPLE_FLOWERS = new FlowersData(2984, 2468);
    static readonly ORANGE_FLOWERS = new FlowersData(2985, 2470);
    static readonly PASTEL_FLOWERS = new FlowersData(2986, 2472);
  
    objectId: number;
    itemId: number;
  
    constructor(objectId: number, itemId: number) {
      this.objectId = objectId;
      this.itemId = itemId;
    }
  
    static forObject(object: number): FlowersData | null {
      for (const data of Object.values(FlowersData)) {
        if (data.objectId === object) {
          return data;
        }
      }
      return null;
    }
  
    static generate(): FlowersData {
      const RANDOM = Math.random() * 100;
      if (RANDOM >= 1) {
        return Object.values(FlowersData)[Math.floor(Math.random() * 7)];
      } else {
        return Math.floor(Math.random() * 3) === 1 ? FlowersData.WHITE_FLOWERS : FlowersData.BLACK_FLOWERS;
      }
    }
}

