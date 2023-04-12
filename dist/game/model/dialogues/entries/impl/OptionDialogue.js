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
exports.OptionDialogue = void 0;
var Dialogue_1 = require("../Dialogue");
var OptionDialogue = exports.OptionDialogue = /** @class */ (function (_super) {
    __extends(OptionDialogue, _super);
    function OptionDialogue(index, action) {
        var options = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            options[_i - 2] = arguments[_i];
        }
        var _this = _super.call(this, index) || this;
        _this.options = options;
        return _this;
    }
    OptionDialogue.prototype.execute = function (option) {
        if (this.action == null) {
            return;
        }
        this.action.executeOption(option);
    };
    OptionDialogue.prototype.send = function (player) {
        OptionDialogue.send(player, this.title, this.options);
    };
    OptionDialogue.send = function (player, title, options) {
        var firstChildId = OptionDialogue.CHATBOX_INTERFACES[options.length - 1];
        player.getPacketSender().sendString(title, firstChildId - 1);
        for (var i = 0; i < options.length; i++) {
            player.getPacketSender().sendString(options[i], firstChildId + i);
        }
        player.getPacketSender().sendChatboxInterface(firstChildId - 2);
    };
    OptionDialogue.CHATBOX_INTERFACES = [13760, 2461, 2471, 2482, 2494];
    return OptionDialogue;
}(Dialogue_1.Dialogue));
//# sourceMappingURL=OptionDialogue.js.map