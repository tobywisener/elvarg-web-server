"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmblemTrader = void 0;
var ShopManager_1 = require("../../../../model/container/shop/ShopManager");
var EmblemTraderDialogue_1 = require("../../../../model/dialogues/builders/impl/EmblemTraderDialogue");
var ShopIdentifiers_1 = require("../../../../../util/ShopIdentifiers");
var EmblemTrader = /** @class */ (function () {
    function EmblemTrader() {
    }
    EmblemTrader.prototype.firstOptionClick = function (player, npc) {
        player.getDialogueManager().startDialogues(new EmblemTraderDialogue_1.EmblemTraderDialogue());
    };
    EmblemTrader.prototype.secondOptionClick = function (player, npc) {
        ShopManager_1.ShopManager.opens(player, ShopIdentifiers_1.ShopIdentifiers.PVP_SHOP);
    };
    EmblemTrader.prototype.thirdOptionClick = function (player, npc) {
        player.getDialogueManager().startDialog(new EmblemTraderDialogue_1.EmblemTraderDialogue(), 2);
    };
    EmblemTrader.prototype.forthOptionClick = function (player, npc) {
        player.getDialogueManager().startDialog(new EmblemTraderDialogue_1.EmblemTraderDialogue(), 5);
    };
    EmblemTrader.prototype.useItemOnNpc = function (player, npc, itemId, slot) {
    };
    return EmblemTrader;
}());
exports.EmblemTrader = EmblemTrader;
//# sourceMappingURL=EmblemTrader.js.map