import { Player } from "../../../game/entity/impl/player/Player";
import { Packet } from "../Packet";
import { PlayerRights } from "../../../game/model/rights/PlayerRights";
import { PacketExecutor } from "../PacketExecutor";
import { ItemOnGroundManager, OperationType } from "../../../game/entity/impl/grounditem/ItemOnGroundManager";
import { ItemDefinition } from "../../../game/definition/ItemDefinition";
import { Sound } from "../../../game/Sound";
import { Sounds } from "../../../game/Sounds";
import { Location } from "../../../game/model/Location";
import { ItemOnGround } from "../../../game/entity/impl/grounditem/ItemOnGround";

export class PickupItemPacketListener implements PacketExecutor {
    execute(player: Player, packet: Packet) {
        const y = packet.readLEShort();
        const itemId = packet.readShort();
        const x = packet.readLEShort();
        const position = new Location(x, y, player.getLocation().getZ());

        if (player.getRights() == PlayerRights.DEVELOPER) {
            player.getPacketSender().sendMessage("Pick up item: " + itemId + ". " + position.toString());
        }

        if (player.busy() || !player.getLastItemPickup().elapsed()) {
            // If player is busy or last item was picked up less than 0.3 seconds ago
            return;
        }

        player.getMovementQueue().walkToGroundItem(position, () => this.takeItem(player, itemId, position));
    }

    private takeItem(player: Player, itemId: number, position: Location) {
        let x = position.getX(), y = position.getY();

        if (Math.abs(player.getLocation().getX() - x) > 25 || Math.abs(player.getLocation().getY() - y) > 25) {
            player.getMovementQueue().reset();
            return;
        }

        // Check if we can hold it..
        if (!(player.getInventory().getFreeSlots() > 0 || (player.getInventory().getFreeSlots() == 0
            && ItemDefinition.forId(itemId).isStackable() && player.getInventory().contains(itemId)))) {
            player.getInventory().full();
            return;
        }

        let item: ItemOnGround | undefined = ItemOnGroundManager.getGroundItem(player.getUsername(), itemId, position);
        let deregister = true;
        if (item) {
            if (player.getInventory().getAmount(item.getItem().getId()) + item.getItem().getAmount() > Number.MAX_SAFE_INTEGER || player.getInventory().getAmount(item.getItem().getId()) + item.getItem().getAmount() <= 0) {
                let playerCanHold = Number.MAX_SAFE_INTEGER - player.getInventory().getAmount(item.getItem().getId());
                if (playerCanHold <= 0) {
                    player.getPacketSender().sendMessage("You cannot hold that more of that item.");
                    return;
                } else {
                    let currentAmount: number = item.getItem().getAmount();
                    item.setOldAmount(currentAmount);
                    item.getItem().decrementAmountBy(playerCanHold);
                    ItemOnGroundManager.perform(item, OperationType.ALTER);
                    deregister = false;
                }
            }
            if (deregister) {
                ItemOnGroundManager.deregister(item);
            }
            player.getInventory().addItem(item.getItem());
            Sounds.sendSound(player, Sound.PICK_UP_ITEM);
            player.getLastItemPickup().reset();
        }
    }
}

