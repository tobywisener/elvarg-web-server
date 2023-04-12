"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.NpcDialogue = void 0;
var Dialogue_1 = require("../Dialogue");
var DialogueExpression_1 = require("../../DialogueExpression");
var Misc_1 = require("../../../../../util/Misc");
var NpcDefinition_1 = require("../../../../definition/NpcDefinition");
var NpcDialogue = exports.NpcDialogue = /** @class */ (function (_super) {
    __extends(NpcDialogue, _super);
    function NpcDialogue(index, npcId, text, expression, continueAction) {
        var _this = _super.call(this, index) || this;
        _this.npcId = npcId;
        _this.text = text;
        _this.expression = expression || DialogueExpression_1.DialogueExpression.CALM;
        if (continueAction) {
            _this.setContinueAction(continueAction);
        }
        return _this;
    }
    NpcDialogue.prototype.send = function (player) {
        NpcDialogue.send(player, this.npcId, this.text, this.expression);
    };
    NpcDialogue.send = function (player, npcId, text, expression) {
        var lines = Misc_1.Misc.wrapText(text, 53);
        var length = lines.length;
        if (length > 5) {
            length = 5;
        }
        var startDialogueChildId = NpcDialogue.CHATBOX_INTERFACES[length - 1];
        var headChildId = startDialogueChildId - 2;
        player.getPacketSender().sendNpcHeadOnInterface(npcId, headChildId);
        player.getPacketSender().sendInterfaceAnimation(headChildId, expression.getExpression());
        player.getPacketSender().sendString(NpcDefinition_1.NpcDefinition.forId(npcId) != null ? NpcDefinition_1.NpcDefinition.forId(npcId).getName().replace("_", " ") : "", startDialogueChildId - 1);
        for (var i = 0; i < length; i++) {
            player.getPacketSender().sendString(lines[i], startDialogueChildId + i);
        }
        player.getPacketSender().sendChatboxInterface(startDialogueChildId - 3);
    };
    NpcDialogue.sendStatement = function (player, npcId, lines, expression) {
        var _a, _b;
        var length = Math.min(lines.length, 5);
        var startDialogueChildId = NpcDialogue.CHATBOX_INTERFACES[length - 1];
        var headChildId = startDialogueChildId - 2;
        player.getPacketSender().sendNpcHeadOnInterface(npcId, headChildId);
        player.getPacketSender().sendInterfaceAnimation(headChildId, expression.getExpression());
        player.getPacketSender().sendString(((_b = (_a = NpcDefinition_1.NpcDefinition.forId(npcId)) === null || _a === void 0 ? void 0 : _a.getName()) === null || _b === void 0 ? void 0 : _b.replace("_", " ")) || "", startDialogueChildId - 1);
        for (var i = 0; i < length; i++) {
            player.getPacketSender().sendString(lines[i], startDialogueChildId + i);
        }
        player.getPacketSender().sendChatboxInterface(startDialogueChildId - 3);
    };
    NpcDialogue.CHATBOX_INTERFACES = [4885, 4890, 4896, 4903];
    return NpcDialogue;
}(Dialogue_1.Dialogue));
//# sourceMappingURL=NpcDialogue.js.map