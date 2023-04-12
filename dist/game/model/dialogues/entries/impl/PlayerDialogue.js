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
exports.PlayerDialogue = void 0;
var Dialogue_1 = require("../Dialogue");
var Misc_1 = require("../../../../../util/Misc");
var PlayerDialogue = exports.PlayerDialogue = /** @class */ (function (_super) {
    __extends(PlayerDialogue, _super);
    function PlayerDialogue(index, text, expression) {
        var _this = _super.call(this, index) || this;
        _this.text = text;
        _this.expression = expression;
        return _this;
    }
    PlayerDialogue.prototype.send = function (player) {
        PlayerDialogue.send(player, this.text, this.expression);
    };
    PlayerDialogue.send = function (player, text, expression) {
        var lines = Misc_1.Misc.wrapText(text, 53);
        var length = lines.length;
        if (length > 5) {
            length = 5;
        }
        var startDialogueChildId = PlayerDialogue.CHATBOX_INTERFACES[length - 1];
        var headChildId = startDialogueChildId - 2;
        player.getPacketSender().sendPlayerHeadOnInterface(headChildId);
        player.getPacketSender().sendInterfaceAnimation(headChildId, expression.getExpression());
        player.getPacketSender().sendString(player.getUsername(), startDialogueChildId - 1);
        for (var i = 0; i < length; i++) {
            player.getPacketSender().sendString(lines[i], startDialogueChildId + i);
        }
        player.getPacketSender().sendChatboxInterface(startDialogueChildId - 3);
    };
    PlayerDialogue.CHATBOX_INTERFACES = [971, 976, 982, 989];
    return PlayerDialogue;
}(Dialogue_1.Dialogue));
//# sourceMappingURL=PlayerDialogue.js.map