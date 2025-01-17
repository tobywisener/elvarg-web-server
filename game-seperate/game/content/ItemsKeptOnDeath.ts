import { Emblem } from "./combat/bountyhunter/Emblem";
import { Player } from "../entity/impl/player/Player";
import { Item } from "../model/Item";
import { SkullType } from "../model/SkullType";
import { Misc } from "../../util/Misc";
import { PrayerHandler } from "./PrayerHandler";

export class ItemsKeptOnDeath {
    public static open(player: Player) {
        ItemsKeptOnDeath.clearInterfaceData(player); //To prevent sending multiple layers of items.
        ItemsKeptOnDeath.sendInterfaceData(player); //Send info on the interface.
        player.getPacketSender().sendInterface(17100); //Open the interface.
    }

    public static sendInterfaceData(player: Player) {

        player.getPacketSender().sendString( "" + ItemsKeptOnDeath.getAmountToKeep(player), 17107);

        const toKeep = ItemsKeptOnDeath.getItemsToKeep(player);
        for (let i = 0; i < toKeep.length; i++) {
            player.getPacketSender().sendItemOnInterface(17108 + i, toKeep[i].getId(), 0, 1);
        }

        let toSend = 17112;
        for (let item of [...player.getInventory().getItems(), ...player.getEquipment().getItems()]) {
            if (item == null || item.getId() <= 0 || item.getAmount() <= 0 || !item.getDefinition().isTradeable() || toKeep.includes(item)) {
                continue;
            }
            player.getPacketSender().sendItemOnInterface(toSend, item.getId(), 0, item.getAmount());
            toSend++;
        }
    }

    public static clearInterfaceData(player: Player) {
        for (let i = 17108; i <= 17152; i++)
            player.getPacketSender().clearItemOnInterface(i);
    }

    static getItemsToKeep(player: Player): Item[] {
        let items: Item[] = [];
        for (let item of [...player.getInventory().getItems(), ...player.getEquipment().getItems()]) {
            if (item == null || item.getId() <= 0 || item.getAmount() <= 0 || !item.getDefinition().isTradeable()) {
                continue;
            }

            //Dont keep emblems
            if (item.getId() == Emblem.MYSTERIOUS_EMBLEM_1.id ||
                item.getId() == Emblem.MYSTERIOUS_EMBLEM_2.id ||
                item.getId() == Emblem.MYSTERIOUS_EMBLEM_3.id ||
                item.getId() == Emblem.MYSTERIOUS_EMBLEM_4.id ||
                item.getId() == Emblem.MYSTERIOUS_EMBLEM_5.id ||
                item.getId() == Emblem.MYSTERIOUS_EMBLEM_6.id ||
                item.getId() == Emblem.MYSTERIOUS_EMBLEM_7.id ||
                item.getId() == Emblem.MYSTERIOUS_EMBLEM_8.id ||
                item.getId() == Emblem.MYSTERIOUS_EMBLEM_9.id ||
                item.getId() == Emblem.MYSTERIOUS_EMBLEM_10.id) {
                continue;
            }

            items.push(item);
        }
        items.sort((item: Item, item2: Item) => {
            const value1 = item.getDefinition().getValue();
            const value2 = item2.getDefinition().getValue();
            if (value1 == value2) {
              return 0;
            } else if (value1 > value2) {
              return -1;
            } else {
              return 1;
            }
          });
        let toKeep: Item[];
        const amountToKeep = ItemsKeptOnDeath.getAmountToKeep(player);
        for (let i = 0; i < amountToKeep && i < items.length; i++) {
            toKeep.unshift(items[i]);
        }
        return toKeep;
    }

    public static getAmountToKeep(player: Player) {
        if (player.getSkullTimer() > 0) {
            if (player.getSkullType() == SkullType.RED_SKULL) {
                return 0;
            }
        }
        return (player.getSkullTimer() > 0 ? 0 : 3) + (PrayerHandler.isActivated(player, PrayerHandler.PROTECT_ITEM) ? 1 : 0);
    }
}
