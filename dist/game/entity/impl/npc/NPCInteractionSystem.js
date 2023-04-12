"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NPCInteractionSystem = void 0;
var NPCInteraction_1 = require("./NPCInteraction");
var NPCInteractionSystem = /** @class */ (function () {
    function NPCInteractionSystem() {
    }
    NPCInteractionSystem.handleFirstOption = function (player, npc) {
        if (!(npc instanceof NPCInteraction_1.NPCInteraction)) {
            return false;
        }
        npc.firstOptionClick(player, npc);
        return true;
    };
    NPCInteractionSystem.handleSecondOption = function (player, npc) {
        if (!(npc instanceof NPCInteraction_1.NPCInteraction)) {
            return false;
        }
        npc.secondOptionClick(player, npc);
        return true;
    };
    NPCInteractionSystem.handleThirdOption = function (player, npc) {
        if (!(npc instanceof NPCInteraction_1.NPCInteraction)) {
            return false;
        }
        npc.thirdOptionClick(player, npc);
        return true;
    };
    NPCInteractionSystem.handleForthOption = function (player, npc) {
        if (!(npc instanceof NPCInteraction_1.NPCInteraction)) {
            return false;
        }
        npc.forthOptionClick(player, npc);
        return true;
    };
    NPCInteractionSystem.handleUseItem = function (player, npc, itemId, slot) {
        if (!(npc instanceof NPCInteraction_1.NPCInteraction)) {
            return false;
        }
        npc.useItemOnNpc(player, npc, itemId, slot);
        return true;
    };
    return NPCInteractionSystem;
}());
exports.NPCInteractionSystem = NPCInteractionSystem;
//# sourceMappingURL=NPCInteractionSystem.js.map