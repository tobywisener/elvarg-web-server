import { Animation } from "../../../../model/Animation";
import { Player } from "../../../../entity/impl/player/Player";
import { GameObject } from "../../../../entity/impl/object/GameObject";
import { ItemOnGround } from "../../../../entity/impl/grounditem/ItemOnGround";
import { ItemIdentifiers } from "../../../../../util/ItemIdentifiers";
import { DefaultSkillable } from "./DefaultSkillable";
import { ItemOnGroundManager } from "../../../../entity/impl/grounditem/ItemOnGroundManager";
import { Task } from "../../../../task/Task";
import { TaskManager } from "../../../../task/TaskManager";
import { ObjectIdentifiers } from "../../../../../util/ObjectIdentifiers";
import { MovementQueue } from "../../../../model/movement/MovementQueue";
import { Skill } from "../../../../model/Skill";
import { Misc } from "../../../../../util/Misc";
import { ObjectManager } from "../../../../entity/impl/object/ObjectManager";
import { Item } from "../../../../model/Item";
import { TimedObjectSpawnTask } from '../../../../task/impl/TimedObjectSpawnTask'
import { PetHandler } from "../../../PetHandler";
import { Cooking } from './Cooking'
import { Action } from "../../../../model/Action";

class FireAction implements Action {
    constructor(private readonly execFunc: Function){

    }
    execute(): void {
        this.execFunc();
    }

}

class FireMakingTask extends Task {

    constructor(n: number, player: Player, b: boolean, private readonly func: Function) {
        super(3);
    }

    execute(): void {
        this.func();
    }

}

export class Firemaking extends DefaultSkillable {
    static LIGHT_FIRE = new Animation(733);
    /**
     * The {@link LightableLog} which we will be attempting
     * to light.
     */
    log: LightableLog;
    groundLog: ItemOnGround | null = null;
    bonfire: GameObject | null = null;
    bonfireAmount: number | null = null;

    constructor(log: LightableLog, groundLog?: ItemOnGround, bonfire?: GameObject, bonfireAmount?: number) {
        super();
        this.log = log;
        if (groundLog !== undefined) {
            this.groundLog = groundLog;
        }
        if (bonfire !== undefined && bonfireAmount !== undefined) {
            this.bonfire = bonfire;
            this.bonfireAmount = bonfireAmount;
        }
    }
    /**
     * Checks if we should light a log.
     *
     * @param player
     * @param itemUsed
     * @param itemUsedWith
     * @return
     */
    static init(player: Player, itemUsed: number, itemUsedWith: number): boolean {
        if (itemUsed == ItemIdentifiers.TINDERBOX || itemUsedWith == ItemIdentifiers.TINDERBOX) {
            const logId = itemUsed == ItemIdentifiers.TINDERBOX ? itemUsedWith : itemUsed;
            const log = LightableLog.getForItem(logId);
            if (log) {
                player.getSkillManager().startSkillable(new Firemaking(log));
            }
            return true;
        }
        return false;
    }

    start(player: Player): void {
        //Reset movement queue..
        player.getMovementQueue().reset();

        //Send message..
        player.getPacketSender().sendMessage("You attempt to light the logs..");

        //If we're lighting a log from our inventory..
        if (!this.groundLog && !this.bonfire) {
            //Delete logs from inventory..
            player.getInventory().deleteNumber(this.log.getLogId(), 1);

            //Place logs on ground..
            this.groundLog = ItemOnGroundManager.registers(player, new Item(this.log.getLogId(), 1));
        }

        //Face logs if present.
        if (this.groundLog) {
            player.setPositionToFace(this.groundLog.getPosition());
        }

        //Start parent execution task..
        super.start(player);
    }

    startAnimationLoop(player: Player): void {
        //If we're not adding to a bonfire
        //Simply do the regular animation.
        if (!this.bonfire) {
            player.performAnimation(Firemaking.LIGHT_FIRE);
            return;
        }
        const animLoop = new FireMakingTask(3, player, true, () => {
            player.performAnimation(Cooking.ANIMATION); //Cooking anim looks fine for bonfires
        });
        TaskManager.submit(animLoop);
        this.getTasks().push(animLoop);
    }

    onCycle(player: Player): void {
        PetHandler.onSkill(player, Skill.FIREMAKING);
    }

    finishedCycle(player: Player): void {
        //Handle reset of skill..
        if (this.bonfire) {
            if (--this.bonfireAmount <= 0) {
                this.cancel(player);
            }
        } else {
            this.cancel(player);
        }

        //If we're adding to a bonfire or the log on ground still exists... Reward player.
        if (this.bonfire || this.groundLog && ItemOnGroundManager.exists(this.groundLog)) {

            //If we aren't adding to a bonfire..
            if (!this.bonfire) {
                //The position to create the fire at..
                const pos = this.groundLog.getPosition().clone();

                //Delete logs from ground ..
                ItemOnGroundManager.deregister(this.groundLog);

                //Create fire..
                TaskManager.submit(new TimedObjectSpawnTask(new GameObject(ObjectIdentifiers.FIRE_5, pos, 10, 0, player.getPrivateArea()), this.log.getRespawnTimer(),
                new FireAction(() => {
                        if (!ItemOnGroundManager.getGroundItem(player.getUsername(), ItemIdentifiers.ASHES, pos)) {
                            ItemOnGroundManager.registerLocation(player, new Item(ItemIdentifiers.ASHES), pos);
                        }
                    })));

                //Step away from the fire..
                if (player.getLocation().equals(pos)) {
                    MovementQueue.clippedStep(player);
                }
            } else {
                //Delete logs from inventory when using a bonfire..
                player.getInventory().deleteNumber(this.log.getLogId(), 1);
            }

            //Add experience..
            player.getSkillManager().addExperiences(Skill.FIREMAKING, this.log.getExperience());

            //Send message..
            player.getPacketSender().sendMessage("The logs catch fire and begin to burn.");
        }
    }

    cyclesRequired(player: Player): number {
        if (this.bonfire) { //Cycle rate for adding to bonfire is constant.
            return 2;
        }
        let cycles = this.log.getCycles() + Misc.getRandom(2);
        cycles -= player.getSkillManager().getMaxLevel(Skill.FIREMAKING) * 0.1;
        if (cycles < 3) {
            cycles = 3;
        }
        return cycles;
    }

    hasRequirements(player: Player): boolean {
        //If we aren't adding logs to a fire - make sure player has a tinderbox..
        if (!this.bonfire) {
            if (!player.getInventory().contains(ItemIdentifiers.TINDERBOX)) {
                player.getPacketSender().sendMessage("You need a tinderbox to light fires.");
                return false;
            }
        }

        //Check if we've burnt the amount of logs on the bonfire.
        if (this.bonfire && this.bonfireAmount <= 0) {
            return false;
        }

        //If we aren't lighting a log on the ground, make sure we have at least one in our inventory.
        if (!this.groundLog) {
            if (!player.getInventory().contains(this.log.getLogId())) {
                player.getPacketSender().sendMessage("You've run out of logs.");
                return false;
            }
        }

        //If we're adding to a bonfire - make sure it still exists.
        //If we're not adding to a fire, make sure no object exists in our position.
        if (this.bonfire) {
            if (!ObjectManager.exists(ObjectIdentifiers.FIRE_5, this.bonfire.getLocation())) {
                return false;
            }
        } else {
            //Check if there's already an object where the player wants to light a fire..
            if (/*ClippedRegionManager.getObject(player.getPosition()).isPresent()
                    ||*/ ObjectManager.existsLocation(player.getLocation())) {
                player.getPacketSender().sendMessage("You cannot light a fire here. Try moving around a bit.");
                return false;
            }
        }

        return super.hasRequirements(player);
    }

    loopRequirements(): boolean {
        //We may have run out of logs
        //when using bonfire.
        if (this.bonfire) {
            return true;
        }

        return false;
    }

    allowFullInventory(): boolean {
        return true;
    }
}

export class LightableLog {
    NORMAL = { logId: 1511, level: 1, experience: 40, cycles: 7, firemakingRespawnTimer: 60 };
    ACHEY = { logId: 2862, level: 1, experience: 40, cycles: 7, firemakingRespawnTimer: 65 };
    OAK = { logId: 1521, level: 15, experience: 60, cycles: 8, firemakingRespawnTimer: 70 };
    WILLOW = { logId: 1519, level: 30, experience: 90, cycles: 9, firemakingRespawnTimer: 80 };
    TEAK = { logId: 6333, level: 35, experience: 105, cycles: 9, firemakingRespawnTimer: 80 };
    ARTIC_PINE = { logId: 10810, level: 42, experience: 125, cycles: 10, firemakingRespawnTimer: 80 };
    MAPLE = { logId: 1517, level: 45, experience: 135, cycles: 10, firemakingRespawnTimer: 85 };
    MAHOGANY = { logId: 6332, level: 50, experience: 157, cycles: 11, firemakingRespawnTimer: 85 };
    EUCALYPTUS = { logId: 12581, level: 58, experience: 193, cycles: 12, firemakingRespawnTimer: 85 };
    YEW = { logId: 1515, level: 60, experience: 202, cycles: 13, firemakingRespawnTimer: 90 };
    MAGIC = { logId: 1513, level: 75, experience: 303, cycles: 15, firemakingRespawnTimer: 100 };
    REDWOOD = { logId: 19669, level: 90, experience: 350, cycles: 18, firemakingRespawnTimer: 120 };

    private static lightableLogs: { [key: number]: LightableLog } = {};

    getExperience(): number {
        return this.experience;
    }

    getLogId(): number {
        return this.logId;
    }

    getLevel(): number {
        return this.level;
    }

    getCycles(): number {
        return this.cycles;
    }

    getRespawnTimer(): number {
        return this.respawnTimer;
    }

    public static getForItem(item: number): LightableLog {
        return LightableLog.lightableLogs[item] ? LightableLog.lightableLogs[item] : null;
    }

    constructor(private logId: number, private level: number, private experience: number, private cycles: number, private respawnTimer: number) {
        LightableLog.lightableLogs[logId] = this;
    }
}
