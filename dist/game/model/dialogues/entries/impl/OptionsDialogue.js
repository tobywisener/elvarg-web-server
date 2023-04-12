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
exports.OptionsDialogue = void 0;
var Dialogue_1 = require("../Dialogue");
var OptionsDialogue = exports.OptionsDialogue = /** @class */ (function (_super) {
    __extends(OptionsDialogue, _super);
    function OptionsDialogue(index, title, optionsMap) {
        var _this = _super.call(this, index) || this;
        _this.title = title;
        _this.optionsMap = optionsMap;
        return _this;
    }
    OptionsDialogue.prototype.execute = function (optionIndex, player) {
        if (this.optionsMap == null || player == null) {
            return;
        }
        this.getDialogueActionByIndex(optionIndex).execute(player);
    };
    OptionsDialogue.prototype.getDialogueActionByIndex = function (index) {
        var keys = Object.keys(this.optionsMap);
        var key = keys[index];
        return this.optionsMap[key];
    };
    OptionsDialogue.prototype.send = function (player) {
        var keys = Object.keys(this.optionsMap);
        OptionsDialogue.send(player, this.title, keys);
    };
    OptionsDialogue.send = function (player, title, options) {
        var firstChildId = OptionsDialogue.CHATBOX_INTERFACES[options.length - 1];
        player.getPacketSender().sendString(title, firstChildId - 1);
        for (var i = 0; i < options.length; i++) {
            player.getPacketSender().sendString(options[i], firstChildId + i);
        }
        player.getPacketSender().sendChatboxInterface(firstChildId - 2);
    };
    OptionsDialogue.CHATBOX_INTERFACES = [13760, 2461, 2471, 2482, 2494];
    return OptionsDialogue;
}(Dialogue_1.Dialogue));
//# sourceMappingURL=OptionsDialogue.js.map