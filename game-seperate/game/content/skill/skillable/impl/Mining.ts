import { DefaultSkillable } from "./DefaultSkillable";
import { Skill } from "../../../../model/Skill";
import { Player } from "../../../../entity/impl/player/Player";
import { Misc } from "../../../../../util/Misc";
import { PetHandler } from "../../../PetHandler";
import { GameObject } from "../../../../entity/impl/object/GameObject";
import { Task } from "../../../../task/Task";
import { TaskManager } from "../../../../task/TaskManager";
import { ObjectManager } from "../../../../entity/impl/object/ObjectManager";
import { Equipment } from "../../../../model/container/impl/Equipment"
import { MapObjects } from "../../../../entity/impl/object/MapObjects";
import { Animation } from "../../../../model/Animation";
import { TimedObjectReplacementTask } from "../../../../task/impl/TimedObjectReplacementTask";

class MiningTask extends Task {
    constructor(n1: number, p: Player, b: boolean, private readonly execFunc: Function) {
        super(n1, p, b);
    }

    execute(): void {
        this.execFunc();
    }

}

export class Mining extends DefaultSkillable {
    private rockObject: GameObject;
    private rock: Rock;
    private pickaxe: Pickaxe | null = null;

    constructor(rockObject: GameObject, rock: Rock) {
        super();
        this.rockObject = rockObject;
        this.rock = rock;
    }

    public start(player: Player) {
        player.getPacketSender().sendMessage("You swing your pickaxe at the rock..");
        super.start(player);
    }

    public startAnimationLoop(player: Player): void {
        const animLoop = new MiningTask(6, player, true, () => {
            player.performAnimation(this.pickaxe.getAnimation());
        });
        TaskManager.submit(animLoop);
        this.getTasks().push(animLoop);
    }

    public onCycle(player: Player) {
        PetHandler.onSkill(player, Skill.MINING);
    }

    public finishedCycle(player: Player) {
        if (this.rock.getOreId() > 0) {
            player.getInventory().adds(this.rock.getOreId(), 1);
            player.getPacketSender().sendMessage("You get some ores.");
        }
        if (this.rock.getXpReward() > 0) {
            player.getSkillManager().addExperiences(Skill.MINING, this.rock.getXpReward());
        }
        this.cancel(player);
        if (this.rock == Rock.CASTLE_WARS_ROCKS) {
            let id = this.rockObject.getId() + 1;
            let loc = this.rockObject.getLocation();
            let face = this.rockObject.getFace();
            ObjectManager.deregister(this.rockObject, false);
            if (id == 4439) {
                ObjectManager.deregister(new GameObject(-1, loc, 10, face, null), true);
                return;
            }
            ObjectManager.register(new GameObject(id, loc, 10, face, null), true);
            return;
        }
        TaskManager.submit(new TimedObjectReplacementTask(this.rockObject,
            new GameObject(2704, this.rockObject.getLocation(), 10, 0, player.getPrivateArea()),
            this.rock.getRespawnTimer()));
    }

    public cyclesRequired(player: Player): number {
        let cycles: number = this.rock.getCycles() + Misc.getRandom(4);
        cycles -= player.getSkillManager().getCurrentLevel(Skill.MINING) * 0.1;
        cycles -= cycles * this.pickaxe.getSpeed();

        return Math.max(3, Math.floor(cycles));
    }

    public hasRequirements(player: Player): boolean {
        //Attempt to find a pickaxe..
        let pickaxe: Pickaxe | undefined;
        for (let a of Object.values(Pickaxe)) {
            if (player.getEquipment().getItems()[Equipment.WEAPON_SLOT].getId() == a.getId()
                || player.getInventory().contains(a.getId())) {

                //If we have already found a pickaxe,
                //don't select others that are worse or can't be used
                if (pickaxe) {
                    if (player.getSkillManager().getMaxLevel(Skill.MINING) < a.getRequiredLevel()) {
                        continue;
                    }
                    if (a.getRequiredLevel() < pickaxe.getRequiredLevel()) {
                        continue;
                    }
                }

                pickaxe = a;
            }
        }

        //Check if we found one..
        if (!pickaxe) {
            player.getPacketSender().sendMessage("You don't have a pickaxe which you can use.");
            return false;
        }

        //Check if we have the required level to mine this {@code rock} using the {@link Pickaxe} we found..
        if (player.getSkillManager().getCurrentLevel(Skill.MINING) < pickaxe.getRequiredLevel()) {
            player.getPacketSender().sendMessage("You don't have a pickaxe which you have the required Mining level to use.");
            return false;
        }

        //Check if we have the required level to mine this {@code rock}..
        if (player.getSkillManager().getCurrentLevel(Skill.MINING) < this.rock.getRequiredLevel()) {
            player.getPacketSender().sendMessage("You need a Mining level of at least " + this.rock.getRequiredLevel() + " to mine this rock.");
            return false;
        }

        //Finally, check if the rock object remains there.
        //Another player may have mined it already.
        if (!MapObjects.exists(this.rockObject)) {
            return false;
        }

        return this.hasRequirements(player);
    }
    public loopRequirements(): boolean {
        return true;
    }

    public allowFullInventory(): boolean {
        return false;
    }

    public getTreeObject(): GameObject {
        return this.rockObject;
    }


}




export class Pickaxe {
    public static readonly BRONZE = new Pickaxe(1265, 1, new Animation(625), 0.03);
    public static readonly IRON = new Pickaxe(1267, 1, new Animation(626), 0.05);
    public static readonly STEEL = new Pickaxe(1269, 6, new Animation(627), 0.09);
    public static readonly MITHRIL = new Pickaxe(1273, 21, new Animation(628), 0.13);
    public static readonly ADAMANT = new Pickaxe(1271, 31, new Animation(629), 0.16);
    public static readonly RUNE = new Pickaxe(1275, 41, new Animation(624), 0.20);
    public static readonly DRAGON = new Pickaxe(15259, 61, new Animation(624), 0.25);

    private readonly id: number;
    private readonly requiredLevel: number;
    private readonly animation: Animation;
    private readonly speed: number;

    constructor(id: number, req: number, animation: Animation, speed: number) {
        this.id = id;
        this.requiredLevel = req;
        this.animation = animation;
        this.speed = speed;
    }

    public getId(): number {
        return this.id;
    }

    public getRequiredLevel(): number {
        return this.requiredLevel;
    }

    public getAnimation(): Animation {
        return this.animation;
    }

    public getSpeed(): number {
        return this.speed;
    }
}

export class Rock {
    public static readonly CLAY = new Rock([9711, 9712, 9713, 15503, 15504, 15505], 1, 5, 434, 11, 2);
    public static readonly COPPER = new Rock([7453], 1, 18, 436, 12, 4);
    public static readonly TIN = new Rock([7486], 1, 8, 438, 12, 4);
    public static readonly IRON = new Rock([7455, 7488], 15, 35, 440, 13, 5);
    public static readonly SILVER = new Rock([7457], 20, 40, 442, 14, 7);
    public static readonly COAL = new Rock([7456], 30, 50, 453, 15, 7);
    public static readonly GOLD = new Rock([9720, 9721, 9722, 11951, 11183, 11184, 11185, 2099], 40, 65, 444, 15, 10);
    public static readonly MITHRIL = new Rock([7492, 7459], 50, 80, 447, 17, 11);
    public static readonly ADAMANTITE = new Rock([7460], 70, 95, 449, 18, 14);
    public static readonly RUNITE = new Rock([14859, 4860, 2106, 2107, 7461], 85, 125, 451, 23, 45);
    public static readonly CASTLE_WARS_ROCKS = new Rock([4437, 4438], 1, 0, -1, 12, -1);
  
    private rocks: Map<number, Rock> = new Map<number, Rock>();
  
    constructor(ids: number[], requiredLevel: number, experience: number, oreId: number, cycles: number, respawnTimer: number) {
      this.ids = ids;
      this.requiredLevel = requiredLevel;
      this.experience = experience;
      this.oreId = oreId;
      this.cycles = cycles;
      this.respawnTimer = respawnTimer;
  
      for (const t of Object.values(Rock)) {
        for (const obj of t.ids) {
          this.rocks.set(obj, t);
        }
        this.rocks.set(t.oreId, t);
      }
    }
  
    ids: number[];
    oreId: number;
    requiredLevel: number;
    experience: number;
    cycles: number;
    respawnTimer: number;
  
    public forObjectId(objectId: number): Rock | undefined {
      return this.rocks.get(objectId);
    }
  
    getRespawnTimer(): number {
      return this.respawnTimer;
    }
  
    getRequiredLevel(): number {
      return this.requiredLevel;
    }
  
    getXpReward(): number {
      return this.experience;
    }
  
    getOreId(): number {
      return this.oreId;
    }

    public getCycles(): number {
        return this.cycles;
    }
}
