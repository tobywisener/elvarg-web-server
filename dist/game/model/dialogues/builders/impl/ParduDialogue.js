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
exports.ParduDialogue = void 0;
var DynamicDialogueBuilder_1 = require("../DynamicDialogueBuilder");
var OptionDialogue_1 = require("../../entries/impl/OptionDialogue");
var NpcIdentifiers_1 = require("../../../../../util/NpcIdentifiers");
var ActionDialogue_1 = require("../../entries/impl/ActionDialogue");
var NpcDialogue_1 = require("../../entries/impl/NpcDialogue");
var DialogueOption_1 = require("../../DialogueOption");
var BrokenItem_1 = require("../../../BrokenItem");
var BankerDialogueAction = /** @class */ (function () {
    function BankerDialogueAction(execFunc) {
        this.execFunc = execFunc;
    }
    BankerDialogueAction.prototype.executeOption = function (option) {
        this.execFunc();
    };
    return BankerDialogueAction;
}());
var ParduAction = /** @class */ (function () {
    function ParduAction(execFunc) {
        this.execFunc = execFunc;
    }
    ParduAction.prototype.execute = function () {
        this.execFunc();
    };
    return ParduAction;
}());
var ParduDialogue = /** @class */ (function (_super) {
    __extends(ParduDialogue, _super);
    function ParduDialogue() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ParduDialogue.prototype.build = function (player) {
        var _this = this;
        var allBrokenItemCost = BrokenItem_1.BrokenItem.getRepairCost(player);
        if (allBrokenItemCost == 0) {
            this.add(new NpcDialogue_1.NpcDialogue(0, NpcIdentifiers_1.NpcIdentifiers.PERDU, "Hello! Seems like you have no broken items."));
            return;
        }
        this.add(new NpcDialogue_1.NpcDialogue(0, NpcIdentifiers_1.NpcIdentifiers.PERDU, "Hello would you like that I fix all your broken item for " + allBrokenItemCost + " blood money?"));
        this.add(new OptionDialogue_1.OptionDialogue(1, new BankerDialogueAction(function (option) {
            switch (option) {
                case DialogueOption_1.DialogueOption.FIRST_OPTION:
                    player.getDialogueManager().startDialogue(2);
                    break;
                default:
                    player.getPacketSender().sendInterfaceRemoval();
                    break;
            }
        }), "Yes Please", "No, thanks..."));
        this.add(new ActionDialogue_1.ActionDialogue(2, new ParduAction(function () {
            var isSuccess = BrokenItem_1.BrokenItem.repair(player);
            if (isSuccess) {
                _this.add(new NpcDialogue_1.NpcDialogue(3, NpcIdentifiers_1.NpcIdentifiers.PERDU, "All items repaired!"));
                player.getDialogueManager().startDialog(_this, 3);
            }
            else {
                _this.add(new NpcDialogue_1.NpcDialogue(3, NpcIdentifiers_1.NpcIdentifiers.PERDU, "You dont have enough blood money for me to fix your items..."));
                player.getDialogueManager().startDialog(_this, 3);
            }
        })));
    };
    return ParduDialogue;
}(DynamicDialogueBuilder_1.DynamicDialogueBuilder));
exports.ParduDialogue = ParduDialogue;
//# sourceMappingURL=ParduDialogue.js.map