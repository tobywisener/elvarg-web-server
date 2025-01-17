import { Sound } from "../../../../Sound";
import { Sounds } from "../../../../Sounds";
import { ItemOnGroundManager } from "../../../impl/grounditem/ItemOnGroundManager"
import { NPC } from "../NPC";
import { NPCInteraction } from "../NPCInteraction";
import { Player } from "../../player/Player";
import { Animation } from "../../../../model/Animation"
import { Ids } from "../../../../model/Ids"
import { Item } from "../../../../model/Item"
import { Task } from "../../../../task/Task";
import { TaskManager } from "../../../../task/TaskManager";
import { NpcIdentifiers } from "../../../../../util/NpcIdentifiers"
import { ItemIdentifiers } from "../../../../../util/ItemIdentifiers"

class SheepTask extends Task{
    constructor(n: NPC, private readonly execFunc: Function){
        super(3, false)
    }

    execute(): void {
       this.execFunc();
    }

}

class TaskSheep extends Task{
    constructor(n: NPC, private readonly execFunc: Function){
        super(13, false)
    }

    execute(): void {
       this.execFunc();
       this.stop()
    }

}


export class Sheep extends NPC implements NPCInteraction  {
    private static readonly SHEARING = new Animation(893);
    private static readonly SHEEP_EATING = new Animation(5335);
    private static readonly ITEM_WOOL = new Item(ItemIdentifiers.WOOL);

    public firstOptionClick(player: Player, npc: NPC): void {
        this.shear(player, npc);
    }

    public secondOptionClick(player: Player, npc: NPC): void {
    }

    public thirdOptionClick(player: Player, npc: NPC): void {
    }

    public forthOptionClick(player: Player, npc: NPC): void {
    }

    public useItemOnNpc(player: Player, npc: NPC, itemId: number, slot: number): void {
        if (itemId !== ItemIdentifiers.SHEARS) {
            return;
        }

        this.shear(player, npc);
    }

    /**
     * Function to handle shearing of sheep.
     *
     * @param player
     */
    public shear(player: Player, npc: NPC) {
        if (!player.getInventory().contains(ItemIdentifiers.SHEARS)) {
            player.getPacketSender().sendMessage("You need a set of shears to do this.");
            return;
        }

        player.performAnimation(Sheep.SHEARING);
        Sounds.sendSound(player, Sound.CUTTING);



        TaskManager.submit(new SheepTask(npc, () => {
            npc.setNpcTransformationId(this.getSheepTransformId(npc));
            npc.forceChat("Baa!");

            if (player.getInventory().getFreeSlots() > 0) {
                player.getInventory().addItem(Sheep.ITEM_WOOL);
            } else {
                ItemOnGroundManager.registers(player, Sheep.ITEM_WOOL);
                player.getPacketSender().sendMessage("You did not have enough inventory space so the Wool was dropped on the ground.");
            }
        }));

        TaskManager.submit(new TaskSheep(npc, () => {npc.performAnimation(Sheep.SHEEP_EATING);
            npc.setNpcTransformationId(npc.getRealId());
            })
        )
    }

    private getSheepTransformId(npc: NPC): number {
        switch (npc.getId()) {
            case NpcIdentifiers.SHEEP_FULL_BLACK_HEAD:
                return NpcIdentifiers.SHEEP_BALD_BLACK_HEAD;
            case NpcIdentifiers.SHEEP_BALD_BLACK_HEAD:
                return NpcIdentifiers.SHEEP_FULL_BLACK_HEAD;
            case NpcIdentifiers.SHEEP_FULL_GREY_HEAD:
                return NpcIdentifiers.SHEEP_BALD_GREY_HEAD;
            case NpcIdentifiers.SHEEP_BALD_GREY_HEAD:
                return NpcIdentifiers.SHEEP_FULL_GREY_HEAD;
            case NpcIdentifiers.SHEEP_FULL_WHITE_HEAD:
                return NpcIdentifiers.SHEEP_BALD_WHITE_HEAD;
            case NpcIdentifiers.SHEEP_BALD_WHITE_HEAD:
                return NpcIdentifiers.SHEEP_FULL_WHITE_HEAD;
            case NpcIdentifiers.SHEEP_FULL_YELLOW_GREY_HEAD:
                return NpcIdentifiers.SHEEP_BALD_YELLOW_GREY_HEAD;
            case NpcIdentifiers.SHEEP_FULL_YELLOW_BLACK_HEAD:
                return NpcIdentifiers.SHEEP_BALD_YELLOW_BLACK_HEAD;
            default:
                return -1;
        }


    }
}