import { Player } from '../entity/impl/player/Player';
import { Bank } from '../model/container/impl/Bank';


const INTERFACE_ID = 4465;
export class DepositBox {

    public static open(player: Player) {
        player.getPacketSender().sendInterface(INTERFACE_ID);
        this.refresh(player);
    }

    private static refresh(player: Player) {
        player.getPacketSender().clearItemOnInterface(7423);
        player.getPacketSender().sendItemContainer(player.getInventory(), 7423);
        player.getPacketSender().sendInterfaceSet(4465, 192);
    }

    public static deposit(player: Player, slotId: number, itemId: number, amount: number) {
        /** Item in requested Slot **/
        const inventoryItem = player.getInventory().forSlot(slotId);

        if (inventoryItem == null) {
            /** No Item for slot **/
            return;
        }

        /** When depositing over your current item amount **/
        if (player.getInventory().getAmount(itemId) < amount) {
            amount = player.getInventory().getAmount(itemId);
        }

        const item_for_slot = inventoryItem.getId();

        if (item_for_slot != itemId) {
            /** Contains a different itemId **/
            console.log("different item. invItem=" + item_for_slot + " itemIdOnInter=" + itemId);
            return;
        }

        /** If containers 0 amount of the item **/
        if (amount <= 0)
            return;

        /** Adds item to the bank **/
        Bank.deposits(player, itemId, slotId, amount);
        /** Refreshes interface / Inventory **/
        this.refresh(player);
    }
}