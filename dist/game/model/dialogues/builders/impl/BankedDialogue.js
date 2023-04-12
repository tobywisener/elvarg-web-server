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
exports.BankerDialogue = void 0;
var NpcIdentifiers_1 = require("../../../../../util/NpcIdentifiers");
var OptionDialogue_1 = require("../../../../model/dialogues/entries/impl/OptionDialogue");
var DynamicDialogueBuilder_1 = require("../../../../model/dialogues/builders/DynamicDialogueBuilder");
var NpcDialogue_1 = require("../../../../model/dialogues/entries/impl/NpcDialogue");
var DialogueOption_1 = require("../../DialogueOption");
var BankerDialogue = /** @class */ (function (_super) {
    __extends(BankerDialogue, _super);
    function BankerDialogue() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BankerDialogue.prototype.build = function (player) {
        this.add(new NpcDialogue_1.NpcDialogue(0, NpcIdentifiers_1.NpcIdentifiers.BANKER, "Hello would you like to open the bank?"));
        this.add(new OptionDialogue_1.OptionDialogue(1, new BankerDialogueAction(function (option) {
            switch (option) {
                case DialogueOption_1.DialogueOption.FIRST_OPTION:
                    player.getBank(player.getCurrentBankTab()).open();
                    break;
                default:
                    player.getPacketSender().sendInterfaceRemoval();
                    break;
            }
        }), "Yes Please", "No, thanks..."));
    };
    return BankerDialogue;
}(DynamicDialogueBuilder_1.DynamicDialogueBuilder));
exports.BankerDialogue = BankerDialogue;
var BankerDialogueAction = /** @class */ (function () {
    function BankerDialogueAction(execFunc) {
        this.execFunc = execFunc;
    }
    BankerDialogueAction.prototype.executeOption = function (option) {
        this.execFunc();
    };
    return BankerDialogueAction;
}());
//# sourceMappingURL=BankedDialogue.js.map