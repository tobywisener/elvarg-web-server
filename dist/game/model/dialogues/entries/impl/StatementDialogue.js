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
exports.StatementDialogue = void 0;
var Dialogue_1 = require("../Dialogue");
var Misc_1 = require("../../../../../util/Misc");
var StatementDialogue = exports.StatementDialogue = /** @class */ (function (_super) {
    __extends(StatementDialogue, _super);
    function StatementDialogue(index, text) {
        var _this = _super.call(this, index) || this;
        _this.text = text;
        return _this;
    }
    StatementDialogue.prototype.send = function (player) {
        StatementDialogue.send(player, this.text);
    };
    StatementDialogue.send = function (player, text) {
        var lines = Misc_1.Misc.wrapText(text, 60);
        var length = lines.length > 5 ? 5 : lines.length;
        var chatboxInterface = StatementDialogue.CHATBOX_INTERFACES[length - 1];
        for (var i = 0; i < length; i++) {
            player.getPacketSender().sendString(lines[i], (chatboxInterface + 1) + i);
        }
        player.getPacketSender().sendChatboxInterface(chatboxInterface);
    };
    StatementDialogue.sends = function (player, lines) {
        var length = lines.length > 5 ? 5 : lines.length;
        var chatboxInterface = StatementDialogue.CHATBOX_INTERFACES[length - 1];
        for (var i = 0; i < length; i++) {
            player.getPacketSender().sendString(lines[i], (chatboxInterface + 1) + i);
        }
        player.getPacketSender().sendChatboxInterface(chatboxInterface);
    };
    StatementDialogue.CHATBOX_INTERFACES = [356, 359, 363, 368, 374];
    return StatementDialogue;
}(Dialogue_1.Dialogue));
//# sourceMappingURL=StatementDialogue.js.map