
import { Player } from "../../../game/entity/impl/player/Player";
import { WildernessArea } from "../../../game/model/areas/impl/WildernessArea";
import { GameConstants } from "../../../game/GameConstants";
import { ItemDefinition } from "../../../game/definition/ItemDefinition";
import { Bank } from "../../../game/model/container/impl/Bank";
import { Packet } from "../Packet";
import { EnteredAmountAction } from "../../../game/model/EnteredAmountAction";

export class SpawnItemPacketListener {
    static spawn(player: Player, item: number, amount: number, toBank: boolean) {
        if (amount < 0) {
            return;
        } else if (amount > Number.MAX_SAFE_INTEGER) {
            amount = Number.MAX_SAFE_INTEGER;
        }

        if (player.busy() || player.getArea() instanceof WildernessArea) {
            player.getPacketSender().sendMessage("You cannot do that right now.");
            return;
        }

        let spawnable = Array.from(GameConstants.ALLOWED_SPAWNS).includes(item);
        let def = ItemDefinition.forId(item);
        if (!def || !spawnable) {
            player.getPacketSender().sendMessage("This item is currently unavailable.");
            return;
        }

        if (toBank) {
            player.getBank(Bank.getTabForItem(player, item)).adds(item, amount);
        } else {
            if (amount > player.getInventory().getFreeSlots()) {
                amount = player.getInventory().getFreeSlots();
            }

            if (amount <= 0) {
                player.getInventory().full();
                return;
            }

            player.getInventory().adds(item, amount);
        }

        player.getPacketSender().sendMessage(`Spawned ${def.getName()} to ${toBank ? "bank" : "inventory"}.`);
    }

    execute(player: Player, packet: Packet) {
        let item = packet.readInt();
        let spawnX = packet.readByte() == 1;
        let toBank = packet.readByte() == 1;
        let def = ItemDefinition.forId(item);
        if (!def) {
            player.getPacketSender().sendMessage("This item is currently unavailable.");
            return;
        }
        if (spawnX) {
            player.setEnteredAmountAction(new SpawnEntered((amount) => {
                SpawnItemPacketListener.spawn(player, item, amount, toBank);
            }));
            player.getPacketSender().sendEnterAmountPrompt(`How many ${def.getName()} would you like to spawn?`);
        } else {
            SpawnItemPacketListener.spawn(player, item, 1, toBank);
        }
    }
}

class SpawnEntered implements EnteredAmountAction{
    constructor(private readonly execFunc: Function){
        
    }
    execute(amount: number): void {
        this.execFunc();
    }
    
}