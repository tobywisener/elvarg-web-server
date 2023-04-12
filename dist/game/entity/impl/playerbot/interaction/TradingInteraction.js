"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradingInteraction = void 0;
var HoldItems_1 = require("../commands/HoldItems");
var TradingInteraction = /** @class */ (function () {
    function TradingInteraction(playerBot) {
        // Items which this bot is currently attempting to give in a trade
        this.tradingItems = [];
        this.holdingItems = new Map();
        this.playerBot = playerBot;
    }
    // This method is called when a trade window opens between a Player and a PlayerBot
    TradingInteraction.prototype.addItemsToTrade = function (container, tradingWith) {
        if (this.tradingItems.length > 0) {
            // Stage the items the bot is trying to give
            container.addItems(this.tradingItems, true);
        }
        else if (this.holdingItems.has(tradingWith)) {
            // Return the player back their items
            var storedItems = this.holdingItems.get(tradingWith);
            container.addItems(storedItems, true);
            this.playerBot.sendChat("Here's your stuff back, as promised");
        }
        else {
            // Ask the player to give us something
            this.playerBot.sendChat("Give me stuff to store for you, " + tradingWith.getUsername());
        }
    };
    TradingInteraction.prototype.acceptTradeRequest = function (interact) {
        if (this.playerBot.getInteractingWith() != null && this.playerBot.getInteractingWith() != interact) {
            this.playerBot.sendChat("Sorry, i'm busy rn with " + this.playerBot.getInteractingWith().getUsername() + ".");
            return;
        }
        this.playerBot.getTrading().requestTrade(interact);
    };
    TradingInteraction.prototype.acceptTrade = function () {
        this.playerBot.getTrading().acceptTrade();
    };
    TradingInteraction.prototype.receivedItems = function (itemsReceived, fromPlayer) {
        var first = itemsReceived[0];
        this.playerBot.sendChat("Thanks for giving me some stuff. " + first.getDefinition().getName() + " x " + first.getAmount());
        // Store these items for the Player in memory
        this.holdingItems.set(fromPlayer, itemsReceived);
        // Clear the PlayerBot's inventory for someone else
        this.playerBot.getInventory().resetItems().refreshItems();
        if (this.playerBot.getActiveCommand() instanceof HoldItems_1.HoldItems) {
            this.playerBot.stopCommand();
        }
    };
    return TradingInteraction;
}());
exports.TradingInteraction = TradingInteraction;
//# sourceMappingURL=TradingInteraction.js.map