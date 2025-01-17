import { ItemOnGround } from "../../entity/impl/grounditem/ItemOnGround";
import { ItemOnGroundManager } from "../../entity/impl/grounditem/ItemOnGroundManager";
import { Task } from "../Task";

export class GroundItemRespawnTask extends Task {
    /**
    * The {@link ItemOnGround} which is going to respawn.
    */
    private item: ItemOnGround;
    
    constructor(item: ItemOnGround, ticks: number) {
        super(ticks);
        this.item = item;
    }
    
    execute() {
        // Register the new entity..
        ItemOnGroundManager.register(this.item.clone());
    
        // Stop the task
        this.stop();
    }
}