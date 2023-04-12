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
exports.SpellBookDialogue = void 0;
var DynamicDialogueBuilder_1 = require("../DynamicDialogueBuilder");
var OptionDialogue_1 = require("../../entries/impl/OptionDialogue");
var DialogueOption_1 = require("../../DialogueOption");
var MagicSpellbook_1 = require("../../../MagicSpellbook");
var SpellDialogueAction = /** @class */ (function () {
    function SpellDialogueAction(execFunc) {
        this.execFunc = execFunc;
    }
    SpellDialogueAction.prototype.executeOption = function (option) {
        this.execFunc();
    };
    return SpellDialogueAction;
}());
var SpellBookDialogue = /** @class */ (function (_super) {
    __extends(SpellBookDialogue, _super);
    function SpellBookDialogue() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SpellBookDialogue.prototype.build = function (player) {
        this.add(new OptionDialogue_1.OptionDialogue(0, new SpellDialogueAction(function (option) {
            switch (option) {
                case DialogueOption_1.DialogueOption.FIRST_OPTION:
                    player.getPacketSender().sendInterfaceRemoval();
                    MagicSpellbook_1.MagicSpellbook.changeSpellbook(player, MagicSpellbook_1.MagicSpellbook.NORMAL);
                    break;
                case DialogueOption_1.DialogueOption.SECOND_OPTION:
                    player.getPacketSender().sendInterfaceRemoval();
                    MagicSpellbook_1.MagicSpellbook.changeSpellbook(player, MagicSpellbook_1.MagicSpellbook.ANCIENT);
                    break;
                case DialogueOption_1.DialogueOption.THIRD_OPTION:
                    player.getPacketSender().sendInterfaceRemoval();
                    MagicSpellbook_1.MagicSpellbook.changeSpellbook(player, MagicSpellbook_1.MagicSpellbook.LUNAR);
                    break;
                default:
                    player.getPacketSender().sendInterfaceRemoval();
                    break;
            }
        }), "Normal", "Ancient", "Lunar"));
    };
    return SpellBookDialogue;
}(DynamicDialogueBuilder_1.DynamicDialogueBuilder));
exports.SpellBookDialogue = SpellBookDialogue;
//# sourceMappingURL=SpellBookDialogue.js.map