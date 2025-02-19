import { Player } from "../../../../../entity/impl/player/Player";
import { GameObject } from "../../../../../entity/impl/object/GameObject";
import { TaskManager } from "../../../../../task/TaskManager";
import { Sounds } from "../../../../../Sounds";
import { PetHandler } from "../../../../PetHandler";
import { Task } from "../../../../../task/Task";
import { Sound } from "../../../../../Sound";
import { Misc } from "../../../../../../util/Misc";
import { Equipment } from "../../../../../model/container/impl/Equipment";
import { Skill } from "../../../../../model/Skill";
import { MapObjects } from "../../../../../entity/impl/object/MapObjects";
import { TimedObjectReplacementTask } from "../../../../../task/impl/TimedObjectReplacementTask";
import { Ring, BirdNest } from './BirdNest'
import { Animation } from "../../../../../model/Animation";
import { DefaultSkillable } from '../DefaultSkillable'

class WoodcuttingTask extends Task {

    constructor(c: number, player: Player, b: boolean, private readonly execFunction: Function) {
        super(4, true)
    }

    execute(): void {
        this.execFunction();
    }
}

export class Woodcutting extends DefaultSkillable {
    // The GameObject to cut down.
    private treeObject: GameObject;
    // The treeObject as an enumerated type which contains information about it, such as required level.
    private tree: Tree;
    // The axe we're using to cut down the tree.
    private axe: Axe ;

    constructor(treeObject: GameObject, tree: Tree) {
        super();
        this.treeObject = treeObject;
        this.tree = tree;
    }

    public start(player: Player) {
        player.getPacketSender().sendMessage("You swing your axe at the tree..");
        super.start(player);
    }

    public startAnimationLoop(player: Player) {
        const animLoop = new WoodcuttingTask(4, player, true, () => {
            Sounds.sendSound(player, Sound.WOODCUTTING_CHOP);
            player.performAnimation(this.axe.getAnimation());
        });

        TaskManager.submit(animLoop);
        let defaultSkillable: DefaultSkillable;
        defaultSkillable.tasks.push(animLoop);

        const soundLoop = new WoodcuttingTask(2, player, false, () => {
            Sounds.sendSound(player, Sound.WOODCUTTING_CHOP);
        });

        TaskManager.submit(soundLoop);
        defaultSkillable.tasks.push(soundLoop);
    }

    public onCycle(player: Player) {
        PetHandler.onSkill(player, Skill.WOODCUTTING);
    }

    public finishedCycle(player: Player) {
        //Add logs..
        player.getInventory().adds(this.tree.getLogId(), 1);
        player.getPacketSender().sendMessage("You get some logs.");
        //Add exp..
        player.getSkillManager().addExperiences(Skill.WOODCUTTING, this.tree.getXpReward());
        //The chance of getting a bird nest from a tree is 1/256 each time you would normally get a log, regardless of the type of tree.
        if (Misc.getRandom(BirdNest.NEST_DROP_CHANCE) == 1) {
            BirdNest.handleDropNest(player);
        }
        //Regular trees should always despawn.
        //Multi trees are random.
        if (!this.tree.isMulti() || Misc.getRandom(15) >= 2) {
            //Stop skilling...
            this.cancel(player); // <- chama o método cancel na instância de DefaultSkillable

            //Despawn object and respawn it after a short period of time...
            TaskManager.submit(new TimedObjectReplacementTask(this.treeObject, new GameObject(1343, this.treeObject.getLocation(), 10, 0, player.getPrivateArea()), this.tree.getRespawnTimer()));
        }
    }

    public cyclesRequired(player: Player): number {
        let cycles: number = this.tree.getCycles() + Misc.getRandom(4);
        cycles -= player.getSkillManager().getMaxLevel(Skill.WOODCUTTING) * 0.1;
        cycles -= cycles * this.axe.getSpeed();

        return Math.max(3, Math.floor(cycles));
    }

    public hasRequirements(player: Player): boolean {
        //Attempt to find an axe..
        let axes: Axe; 
        for (let a of Object.values(Axe)) {
            if (player.getEquipment().getItems()[Equipment.WEAPON_SLOT].getId() == a.getId()
                || player.getInventory().contains(a.getId())) {

                //If we have already found an axe,
                //don't select others that are worse or can't be used
                if (axes) {
                    if (player.getSkillManager().getMaxLevel(Skill.WOODCUTTING) < a.getRequiredLevel()) {
                        continue;
                    }
                    if (a.getRequiredLevel() < this.axe.getRequiredLevel()) {
                        continue;
                    }
                }

                axes = a;
            }
        }

        //Check if we found one..
        if (!this.axe) {
            player.getPacketSender().sendMessage("You don't have an axe which you can use.");
            return false;
        }

        //Check if we have the required level to cut down this {@code tree} using the {@link Axe} we found..
        if (player.getSkillManager().getCurrentLevel(Skill.WOODCUTTING) < this.axe.getRequiredLevel()) {
            player.getPacketSender().sendMessage("You don't have an axe which you have the required Woodcutting level to use.");
            return false;
        }

        //Check if we have the required level to cut down this {@code tree}..
        if (player.getSkillManager().getCurrentLevel(Skill.WOODCUTTING) < this.tree.getRequiredLevel()) {
            player.getPacketSender().sendMessage("You need a Woodcutting level of at least " + this.tree.getRequiredLevel() + " to cut this tree.");
            return false;
        }

        //Finally, check if the tree object remains there.
        //Another player may have cut it down already.
        if (!MapObjects.exists(this.treeObject)) {
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
        return this.treeObject;
    }
}

class Axe {
    public static readonly BRONZE_AXE = new Axe(1351, 1, 0.03, new Animation(879));
    public static readonly IRON_AXE = new Axe(1349, 1, 0.05, new Animation(877));
    public static readonly STEEL_AXE = new Axe(1353, 6, 0.09, new Animation(875));
    public static readonly BLACK_AXE = new Axe(1361, 6, 0.11, new Animation(873));
    public static readonly MITHRIL_AXE = new Axe(1355, 21, 0.13, new Animation(871));
    public static readonly ADAMANT_AXE = new Axe(1357, 31, 0.16, new Animation(869));
    public static readonly RUNE_AXE = new Axe(1359, 41, 0.19, new Animation(867));
    public static readonly DRAGON_AXE = new Axe(6739, 61, 0.25, new Animation(2846));
    public static readonly INFERNAL = new Axe(13241, 61, 0.3, new Animation(2117));

    private id: number;
    private requiredLevel: number;
    private speed: number;
    private animation: Animation;

    constructor(id: number, level: number, speed: number, animation: Animation) {
        this.id = id;
        this.requiredLevel = level;
        this.speed = speed;
        this.animation = animation;
    }

    public getId(): number {
        return this.id;
    }

    public getRequiredLevel(): number {
        return this.requiredLevel;
    }

    public getSpeed(): number {
        return this.speed;
    }

    public getAnimation(): Animation {
        return this.animation;
    }

    public isEmpty(): boolean {
        return this.isEmpty();
    }
}

const trees = new Map<number, Tree>();

(() => {
    for (const t of Object.values(Tree)) {
        for (const obj of t.objects) {
            trees.set(obj, t);
        }
    }
})();

export class Tree {
    NORMAL = new Tree(
        1,
        25,
        1511,
        [2091, 2890, 1276, 1277, 1278, 1279, 1280, 1282, 1283, 1284, 1285, 1286, 1289, 1290, 1291, 1315, 1316, 1318, 1319, 1330, 1331, 1332, 1365, 1383, 1384, 3033, 3034, 3035, 3036, 3881, 3882, 3883, 5902, 5903, 5904],
        10,
        8,
        false,
    );
    ACHEY = new Tree(
        1,
        25,
        2862,
        [2023],
        13,
        9,
        false,
    );
    OAK = new Tree(
        15,
        38,
        1521,
        [1281, 3037, 9734, 1751],
        14,
        11,
        true,
    );
    WILLOW = new Tree(
        30,
        68,
        1519,
        [1308, 5551, 5552, 5553, 1750, 1758],
        15,
        14,
        true,
    );
    TEAK = new Tree(
        35,
        85,
        6333,
        [9036],
        16,
        16,
        true,
    );
    DRAMEN = new Tree(
        36,
        88,
        771,
        [1292],
        16,
        17,
        true,
    );
    MAPLE = new Tree(
        45,
        100,
        1517,
        [1759, 4674],
        17,
        18,
        true,
    );
    MAHOGANY = new Tree(
        50,
        125,
        6332,
        [9034],
        17,
        20,
        true,
    );
    YEW = new Tree(
        60,
        175,
        1515,
        [1309, 1753],
        18,
        28,
        true,
    );
    MAGIC = new Tree(
        75,
        250,
        1513,
        [1761],
        20,
        40,
        true,
    );
    REDWOOD = new Tree(
        90,
        380,
        19669,
        [],
        22,
        43,
        true,
    );

    private objects: number[];
    private requiredLevel: number;
    private xpReward: number;
    private logId: number;
    private cycles: number;
    private respawnTimer: number;
    private multi: boolean;

    constructor(req: number, xp: number, log: number, obj: number[], cycles: number, respawnTimer: number, multi: boolean) {
        this.requiredLevel = req;
        this.xpReward = xp;
        this.logId = log;
        this.objects = obj;
        this.cycles = cycles;
        this.respawnTimer = respawnTimer;
        this.multi = multi;
    }

    public static forObjectId(objectId: number): Tree | undefined {
        return trees.get(objectId);
    }

    public isMulti(): boolean {
        return this.multi;
    }

    public getCycles(): number {
        return this.cycles;
    }

    public getRespawnTimer(): number {
        return this.respawnTimer;
    }

    public getLogId(): number {
        return this.logId;
    }

    public getXpReward(): number {
        return this.xpReward;
    }

    public getRequiredLevel(): number {
        return this.requiredLevel;
    }
}
