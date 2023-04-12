import { PacketExecutor } from "../PacketExecutor";
import { Packet } from "../Packet";
import { Player } from "../../../game/entity/impl/player/Player";
import { Item } from "../../../game/model/Item";
import { Sound } from "../../../game/Sound";
import { Inventory } from "../../../game/model/container/impl/Inventory";
import { ItemOnGroundManager } from "../../../game/entity/impl/grounditem/ItemOnGroundManager";
import { WildernessArea } from "../../../game/model/areas/impl/WildernessArea";
import { Sounds } from "../../../game/Sounds";
import { PetHandler } from '../../../game/content/PetHandler'
import { PlayerRights } from "../../../game/model/rights/PlayerRights";

export class DropItemPacketListener implements PacketExecutor {

    public static destroyItemInterface(player: Player, item: Item) {
        player.setDestroyItem(item.getId());
        let info: { [key: string]: string }[] = [    { "Are you sure you want to discard this item?": "14174" },    { "Yes.": "14175" },    { "No.": "14176" },    { "": "14177" },    { "This item will vanish once it hits the floor.": "14182" },    { "You cannot get it back if discarded.": "14183" },    { [item.getDefinition().getName()]: "14184" }];
        player.getPacketSender().sendItemOnInterfaces(14171, item.getId(),item.getAmount());
        for (let i = 0; i < info.length; i++)
            player.getPacketSender().sendString( info[i][0], parseInt(info[i][1]));
        player.getPacketSender().sendChatboxInterface(14170);
    }

    public execute(player: Player, packet: Packet) {
        let id = packet.readUnsignedShortA();
        let interface_id = packet.readUnsignedShort();
        let itemSlot = packet.readUnsignedShortA();

        if (player == null || player.getHitpoints() <= 0) {
            return;
        }

        if (interface_id != Inventory.INTERFACE_ID) {
            return;
        }

        if (player.getHitpoints() <= 0)
            return;

        if (itemSlot < 0 || itemSlot >= player.getInventory().capacity())
            return;

        if (player.busy()) {
            player.getPacketSender().sendInterfaceRemoval();
        }

        let item = player.getInventory().getItems()[itemSlot];
        if (item == null)
            return;
        if (item.getId() != id || item.getAmount() <= 0) {
            return;
        }

        if (player.getRights() == PlayerRights.DEVELOPER) {
            player.getPacketSender().sendMessage("Drop item: " + item.getId().toString() + ".");
        }

        player.getPacketSender().sendInterfaceRemoval();

        // Stop skilling..
        player.getSkillManager().stopSkillable();

        // Check if we're dropping a pet..
        if (PetHandler.drop(player, id, false)) {
            Sounds.sendSound(player, Sound.DROP_ITEM);
            return;
        }

        if (item.getDefinition().isDropable()) {
            // Items dropped in the Wilderness should go global immediately.
            if (player.getArea() instanceof WildernessArea) {
                ItemOnGroundManager.registerGlobal(player, item);
            } else {
                ItemOnGroundManager.registers(player, item);
            }

            player.getInventory().setItem(itemSlot, new Item(-1, 0)).refreshItems();

            Sounds.sendSound(player, Sound.DROP_ITEM);
        } else {
            DropItemPacketListener.destroyItemInterface(player, item);
        }
    }
}
