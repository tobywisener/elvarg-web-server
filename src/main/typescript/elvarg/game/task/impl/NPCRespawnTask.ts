import { Task } from "../Task";
import { NPC } from "../../entity/impl/npc/NPC";
import { World } from "../../World";

export class NPCRespawnTask extends Task {
    private npc: NPC;
    constructor(npc: NPC, ticks: number) {
    super(ticks);
    this.npc = npc;
    }
    
    public execute() {
        // Register the new entity..
        World.getAddNPCQueue().push(this.npc.clone());
    
        // Stop the task
        this.stop();
    }
}