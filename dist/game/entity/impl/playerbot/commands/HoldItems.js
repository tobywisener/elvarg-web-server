"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HoldItems = void 0;
var CommandType_1 = require("./CommandType");
var HoldItems = /** @class */ (function () {
    function HoldItems() {
    }
    HoldItems.prototype.triggers = function () {
        return ["hold items", "hold my items", "hold my stuff", "keep my things", "store items", "store my items"];
    };
    HoldItems.prototype.start = function (playerBot, args) {
        if (playerBot.getTradingInteraction().holdingItems.has(playerBot.getInteractingWith())) {
            // Player bots can only store one set of items for a given player
            playerBot.sendChat("Sorry, " + playerBot.getInteractingWith().getUsername() + ", I'm already holding items for you.");
            playerBot.stopCommand();
            return;
        }
        playerBot.sendChat("Sure, just trade me your items.");
        playerBot.getInteractingWith().getPacketSender().sendMessage("Warning: These items will be lost if the server restarts.");
        playerBot.getTrading().requestTrade(playerBot.getInteractingWith());
    };
    HoldItems.prototype.stop = function (playerBot) {
    };
    HoldItems.prototype.supportedTypes = function () {
        return [CommandType_1.CommandType.PUBLIC_CHAT];
    };
    return HoldItems;
}());
exports.HoldItems = HoldItems;
//# sourceMappingURL=HoldItems.js.map