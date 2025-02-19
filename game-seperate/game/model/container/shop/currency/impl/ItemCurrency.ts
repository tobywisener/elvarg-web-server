import { ShopCurrency } from '../../../../../model/container/shop/currency/ShopCurrency'
import { ItemDefinition } from '../../../../../definition/ItemDefinition';
import { Player } from '../../../../../entity/impl/player/Player';

export class ItemCurrency implements ShopCurrency {
    itemDefinition: ItemDefinition;
    itemId: number;

    constructor(itemId: number) {
        this.itemId = itemId;
    }

    getItemDefinition(): ItemDefinition {
        if (!this.itemDefinition) {
            this.itemDefinition = ItemDefinition.forId(this.itemId);
        }
        return this.itemDefinition;
    }

    getName(): string {
        return this.getItemDefinition().getName();
    }

    getAmountForPlayer(player: Player): number {
        return player.getInventory().getAmount(this.itemDefinition.getId());
    }

    decrementForPlayer(player: Player, amount: number) {
        player.getInventory().deleteNumber(this.itemDefinition.getId(), amount);
    }

    incrementForPlayer(player: Player, amount: number) {
        player.getInventory().adds(this.itemDefinition.getId(), amount);
    }
}