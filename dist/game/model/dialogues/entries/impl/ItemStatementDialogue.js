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
exports.ItemStatementDialogue = void 0;
var Dialogue_1 = require("../Dialogue");
var ItemStatementDialogue = exports.ItemStatementDialogue = /** @class */ (function (_super) {
    __extends(ItemStatementDialogue, _super);
    function ItemStatementDialogue(index, title, text, itemId, modelZoom) {
        var _this = _super.call(this, index) || this;
        _this.title = title;
        _this.text = text;
        _this.itemId = itemId;
        _this.modelZoom = modelZoom;
        return _this;
    }
    ItemStatementDialogue.prototype.send = function (player) {
        ItemStatementDialogue.send(player, this.title, this.text, this.itemId, this.modelZoom);
    };
    ItemStatementDialogue.send = function (player, title, statements, itemId, modelZoom) {
        var length = statements.length > 5 ? 5 : statements.length;
        var startDialogueChildId = ItemStatementDialogue.CHATBOX_INTERFACES[length - 1];
        var headChildId = startDialogueChildId - 2;
        player.getPacketSender().sendInterfaceModel(headChildId, itemId, modelZoom);
        player.getPacketSender().sendString(title, startDialogueChildId - 1);
        for (var i = 0; i < statements.length; i++) {
            player.getPacketSender().sendString(statements[i], startDialogueChildId + i);
        }
        player.getPacketSender().sendChatboxInterface(startDialogueChildId - 3);
    };
    ItemStatementDialogue.CHATBOX_INTERFACES = [4885, 4890, 4896, 4903];
    return ItemStatementDialogue;
}(Dialogue_1.Dialogue));
//# sourceMappingURL=ItemStatementDialogue.js.map