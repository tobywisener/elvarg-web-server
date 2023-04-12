import { Player } from "../../../entity/impl/player/Player";
import { ItemContainer } from "../ItemContainer";
import { StackType } from "../StackType";


export class Inventory extends ItemContainer {

    public static readonly INTERFACE_ID: number = 3214;
    
    constructor(player: Player) {
        super(player);
    }
    
    public capacity(): number {
        return 28;
    }
    
    public stackType(): StackType {
        return StackType.DEFAULT;
    }
    
    public refreshItems(): ItemContainer {
        this.getPlayer().getPacketSender().sendItemContainer(this, Inventory.INTERFACE_ID);
        return this.refreshItems();
    }
    
    public full(itemId?: number): ItemContainer {
        this.getPlayer().getPacketSender().sendMessage("Not enough space in your inventory.");
        return this;
    }
}