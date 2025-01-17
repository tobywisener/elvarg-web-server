import { Skillable } from "../Skillable";
import { Task } from "../../../../task/Task";
import { Player } from "../../../../entity/impl/player/Player";
import { Animation } from "../../../../model/Animation";
import { TaskManager } from "../../../../task/TaskManager";

class DefaultSkillableTask extends Task{
    constructor(delay: number, private player: Player, private c: boolean){
        super(4, true)
    }

    execute(): void {}
}

export abstract class DefaultSkillable implements Skillable {
    public tasks: Task[] = [];
  
    public cancel(player: Player): void {
        // Stop all tasks..
        const i = this.tasks.values();
        for (const task of i) {
            task.stop();
            this.tasks.splice(this.tasks.indexOf(task), 1);
        }
    
        // Reset animation..
        player.performAnimation(Animation.DEFAULT_RESET_ANIMATION);
    }
  
    hasRequirements(player: Player): boolean {
      // Check inventory slots..
      if (!this.allowFullInventory()) {
        if (player.getInventory().getFreeSlots() === 0) {
          player.getInventory().full();
          return false;
        }
      }
  
      // Check if busy..
      if (player.busy()) {
        return false;
      }
  
      return true;
    }
  
    startAnimationLoop(player: Player): void {}
  
    cyclesRequired(player: Player): number {
      return 0;
    }
  
    onCycle(player: Player): void {}
  
    finishedCycle(player: Player): void {}
  
    public getTasks(): Array<Task> {
      return Array.from(this.tasks);
    }
  
    public start(player: Player) {
      this.startAnimationLoop(player);
  
      // Start main process task..
      let task = new DefaultSkillableTask(1, player, true);
      let cycle = 0;
  
      task.execute = () => {
        // Make sure we still have the requirements to keep skilling..
        if (this.loopRequirements()) {
          if (!this.hasRequirements(player)) {
            this.cancel(player);
            return;
          }
        }
  
        // Every cycle, call the method..
        this.onCycle(player);
  
        // Sequence the skill, reward players
        // with items once the right amount
        // of cycles have passed.
        if (cycle++ >= this.cyclesRequired(player)) {
          this.finishedCycle(player);
          cycle = 0;
        }
      };
  
      // Submit it..
      TaskManager.submit(task);
  
      // Add to our list of tasks..
      this.tasks.push(task);
    }
  
    public abstract loopRequirements(): boolean;
  
    public abstract allowFullInventory(): boolean;
}