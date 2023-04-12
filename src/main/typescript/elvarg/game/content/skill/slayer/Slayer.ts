import { Player } from "../../../entity/impl/player/Player";
import { SlayerTask } from '../slayer/SlayerTask'
import { SlayerMaster } from '../slayer/SlayerMaster'
import { Skill } from "../../../model/Skill";
import { Misc } from "../../../../util/Misc";
import { ActiveSlayerTask } from "./ActiveSlayerTask";
import { NPC } from "../../../entity/impl/npc/NPC";

export class Slayer {

    public static assigns(player: Player): boolean {
        let master: SlayerMaster = SlayerMaster.TURAEL;
        /*for (const m of SlayerMaster.MASTERS) {
          if (!m.canAssign(player)) {
            continue;
          }
          master = m;
        }*/
        return this.assign(player, master);
      }

    private static assign(player: Player, master: SlayerMaster): boolean {
        if (player.getSlayerTask() != null) {
            player.getPacketSender().sendInterfaceRemoval().sendMessage("You already have a Slayer task.");
            return false;
        }

        // Get the tasks we can assign
        let possibleTasks: SlayerTask[] = [];
        let totalWeight = 0;
        for (const task of SlayerTask.VALUES) {
            // Check if player has unlocked this task
            if (!task.isUnlocked(player)) {
                continue;
            }

            // Check if player has the slayer level required for this task
            if (player.getSkillManager().getMaxLevel(Skill.SLAYER) < task.getSlayerLevel()) {
                continue;
            }

            // Check if this master is able to give out the task
            let correctMaster = false;
            for (const assignedBy of task.getMasters()) {
                if (master == assignedBy) {
                    correctMaster = true;
                    break;
                }
            }
            if (!correctMaster) {
                continue;
            }

            possibleTasks.push(task);
            totalWeight += task.getWeight();
        }
        if (possibleTasks.length == 0) {
            player.getPacketSender().sendInterfaceRemoval().sendMessage("Nieve was unable to give you a Slayer task. Please try again later.");
            return false;
        }

        // Shuffle them and choose a random one based on the weighting system
        Misc.randomElements(possibleTasks);
        let toAssign: SlayerTask | null = null;
        for (const task of possibleTasks) {
            if (Misc.getRandom(totalWeight) <= task.getWeight()) {
                toAssign = task;
                break;
            }
        }
        if (toAssign == null) {
            toAssign = possibleTasks[0];
        }

        // Assign the new task
        player.setSlayerTask(
            new ActiveSlayerTask(
                master,
                toAssign,
                Misc.randomInclusive(toAssign.getMinimumAmount(), toAssign.getMaximumAmount())
            )
        );
        return true;
    }

    public static killed(player: Player, npc: NPC) {
        if (player.getSlayerTask() == null) {
            return;
        }
        if (npc.getDefinition() == null || npc.getDefinition().getName() == null) {
            return;
        }
        let isTask = false;
        const killedNpcName = npc.getDefinition().getName().toLowerCase();
        for (const npcName of player.getSlayerTask().getTask().getNpcNames()) {
            if (npcName === killedNpcName) {
                isTask = true;
                break;
            }
        }
        if (!isTask) {
            return;
        }

        // Add experience and decrease task count
        player.getSkillManager().addExperiences(Skill.SLAYER, npc.getDefinition().getHitpoints());
        player.getSlayerTask().setRemaining(player.getSlayerTask().getRemaining() - 1);

        // Handle completion of task
        if (player.getSlayerTask().getRemaining() == 0) {
            let rewardPoints = player.getSlayerTask().getMaster().getBasePoints();

            // Increase consecutive tasks
            player.setConsecutiveTasks(player.getConsecutiveTasks() + 1);

            // Check for bonus points after completing consecutive tasks
            for (let consecutive of player.getSlayerTask().getMaster().getConsecutiveTaskPoints()) {
                let requiredTasks: number = consecutive[0];
                let bonusPoints: number = consecutive[1];
                if (player.getConsecutiveTasks() % requiredTasks === 0) {
                    rewardPoints = bonusPoints;
                    break;
                }
            }

            // Increase points
            player.setSlayerPoints(player.getSlayerPoints() + rewardPoints);
            player.getPacketSender().sendMessage("You have succesfully completed @dre@" + player.getConsecutiveTasks() + "@bla@ slayer tasks in a row.");
            player.getPacketSender().sendMessage("You earned @dre@" + rewardPoints + "@bla@ Slayer " + (rewardPoints == 1 ? "point" : "points") + ", your new total is now @dre@" + player.getSlayerPoints() + ".");

            // Reset task
            player.setSlayerTask(null);
        }
    }
}
