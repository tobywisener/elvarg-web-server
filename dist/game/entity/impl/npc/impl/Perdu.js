"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Perdu = void 0;
var ParduDialogue_1 = require("../../../../model/dialogues/builders/impl/ParduDialogue");
var Perdu = /** @class */ (function () {
    function Perdu() {
    }
    Perdu.prototype.firstOptionClick = function (player, npc) {
        player.getDialogueManager().startDialogues(new ParduDialogue_1.ParduDialogue());
    };
    Perdu.prototype.secondOptionClick = function (player, npc) {
    };
    Perdu.prototype.thirdOptionClick = function (player, npc) {
    };
    Perdu.prototype.forthOptionClick = function (player, npc) {
    };
    Perdu.prototype.useItemOnNpc = function (player, npc, itemId, slot) {
    };
    return Perdu;
}());
exports.Perdu = Perdu;
//# sourceMappingURL=Perdu.js.map