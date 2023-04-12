"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BankedDialogue_1 = require("../../../../model/dialogues/builders/impl/BankedDialogue");
var Banker = /** @class */ (function () {
    function Banker() {
    }
    Banker.prototype.firstOptionClick = function (player, npc) {
        player.getDialogueManager().startDialogues(new BankedDialogue_1.BankerDialogue());
    };
    Banker.prototype.secondOptionClick = function (player, npc) {
        player.getBank(player.currentBankTab).open();
    };
    Banker.prototype.thirdOptionClick = function (player, npc) { };
    Banker.prototype.forthOptionClick = function (player, npc) { };
    Banker.prototype.useItemOnNpc = function (player, npc, itemId, slot) { };
    return Banker;
}());
//# sourceMappingURL=Banker.js.map