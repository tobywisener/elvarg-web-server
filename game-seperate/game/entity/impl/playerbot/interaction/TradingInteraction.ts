import { Player } from "../../player/Player";
import { PlayerBot } from "../PlayerBot";
import { HoldItems } from "../commands/HoldItems";
import { Item } from "../../../../model/Item";
import { ItemContainer } from "../../../../model/container/ItemContainer";

export class TradingInteraction {

    // The PlayerBot this trading interaction belongs to
    playerBot: PlayerBot;

    // Items which this bot is currently attempting to give in a trade
    tradingItems: Item[] = [];

    holdingItems: Map<Player, Item[]> = new Map<Player, Item[]>();

    constructor(playerBot: PlayerBot) {
        this.playerBot = playerBot;
    }

    // This method is called when a trade window opens between a Player and a PlayerBot
    public addItemsToTrade(container: ItemContainer, tradingWith: Player) {
        if (this.tradingItems.length > 0) {
            // Stage the items the bot is trying to give
            container.addItems(this.tradingItems, true);
        } else if (this.holdingItems.has(tradingWith)) {
            // Return the player back their items
            let storedItems = this.holdingItems.get(tradingWith);
            container.addItems(storedItems, true);
            this.playerBot.sendChat("Here's your stuff back, as promised");
        } else {
            // Ask the player to give us something
            this.playerBot.sendChat("Give me stuff to store for you, " + tradingWith.getUsername());
        }
    }

    public acceptTradeRequest(interact: Player) {
        if (this.playerBot.getInteractingWith() != null && this.playerBot.getInteractingWith() != interact) {
            this.playerBot.sendChat("Sorry, i'm busy rn with " + this.playerBot.getInteractingWith().getUsername() + ".");
            return;
        }

        this.playerBot.getTrading().requestTrade(interact);
    }

    public acceptTrade() {
        this.playerBot.getTrading().acceptTrade();
    }

    public receivedItems(itemsReceived: Item[], fromPlayer: Player) {
        let first = itemsReceived[0];
        this.playerBot.sendChat("Thanks for giving me some stuff. " + first.getDefinition().getName() + " x " + first.getAmount());

        // Store these items for the Player in memory
        this.holdingItems.set(fromPlayer, itemsReceived);

        // Clear the PlayerBot's inventory for someone else
        this.playerBot.getInventory().resetItems().refreshItems();

        if (this.playerBot.getActiveCommand() instanceof HoldItems) {
            this.playerBot.stopCommand();
        }
    }
}