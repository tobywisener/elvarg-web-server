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
exports.EmblemTraderDialogue = void 0;
var DynamicDialogueBuilder_1 = require("../DynamicDialogueBuilder");
var OptionDialogue_1 = require("../../entries/impl/OptionDialogue");
var ShopIdentifiers_1 = require("../../../../../util/ShopIdentifiers");
var NpcIdentifiers_1 = require("../../../../../util/NpcIdentifiers");
var BountyHunter_1 = require("../../../../content/combat/bountyhunter/BountyHunter");
var ShopManager_1 = require("../../../container/shop/ShopManager");
var NpcDialogue_1 = require("../../entries/impl/NpcDialogue");
var EndDialogue_1 = require("../../entries/impl/EndDialogue");
var DialogueExpression_1 = require("../../DialogueExpression");
var SkullType_1 = require("../../../SkullType");
var CombatFactory_1 = require("../../../../content/combat/CombatFactory");
var DialogueOption_1 = require("../../DialogueOption");
var BankerDialogueAction = /** @class */ (function () {
    function BankerDialogueAction(execFunc) {
        this.execFunc = execFunc;
    }
    BankerDialogueAction.prototype.executeOption = function (option) {
        this.execFunc();
    };
    return BankerDialogueAction;
}());
var EmblemTraderDialogue = /** @class */ (function (_super) {
    __extends(EmblemTraderDialogue, _super);
    function EmblemTraderDialogue() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EmblemTraderDialogue.prototype.build = function (player) {
        var _this = this;
        this.add(new OptionDialogue_1.OptionDialogue(0, new BankerDialogueAction(function (option) {
            switch (option) {
                case DialogueOption_1.DialogueOption.FIRST_OPTION:
                    ShopManager_1.ShopManager.opens(player, ShopIdentifiers_1.ShopIdentifiers.PVP_SHOP);
                    break;
                case DialogueOption_1.DialogueOption.SECOND_OPTION:
                    player.getDialogueManager().startDialogue(2);
                    break;
                case DialogueOption_1.DialogueOption.THIRD_OPTION:
                    player.getDialogueManager().startDialogue(5);
                    break;
                default:
                    player.getPacketSender().sendInterfaceRemoval();
                    break;
            }
        }), "I Would like to see your goods", "Could I sell my emblems please?", "Give me a skull!", "Eh.. Nothing..."));
        (function () {
            var value = BountyHunter_1.BountyHunter.getValueForEmblems(player, true);
            if (value == 0) {
                _this.add(new NpcDialogue_1.NpcDialogue(3, NpcIdentifiers_1.NpcIdentifiers.EMBLEM_TRADER, "Don't come to me with no emblems.. Go and fight!!", DialogueExpression_1.DialogueExpression.ANGRY_1));
                _this.add(new EndDialogue_1.EndDialogue(4));
                player.getDialogueManager().startDialog(_this, 3);
            }
            else {
                _this.add(new NpcDialogue_1.NpcDialogue(3, NpcIdentifiers_1.NpcIdentifiers.EMBLEM_TRADER, "Nice! You earned yourself " + value + " blood money!"));
                _this.add(new EndDialogue_1.EndDialogue(4));
                player.getDialogueManager().startDialog(_this, 3);
            }
        });
        this.add(new OptionDialogue_1.OptionDialogue(5, new BankerDialogueAction(function (option) {
            switch (option) {
                case DialogueOption_1.DialogueOption.FIRST_OPTION:
                    CombatFactory_1.CombatFactory.skull(player, SkullType_1.SkullType.WHITE_SKULL, 300);
                    _this.add(new NpcDialogue_1.NpcDialogue(6, NpcIdentifiers_1.NpcIdentifiers.EMBLEM_TRADER, "Here you go! Now have some fun!", DialogueExpression_1.DialogueExpression.LAUGHING));
                    player.getDialogueManager().startDialog(_this, 6);
                    break;
                case DialogueOption_1.DialogueOption.SECOND_OPTION:
                    CombatFactory_1.CombatFactory.skull(player, SkullType_1.SkullType.RED_SKULL, 300);
                    _this.add(new NpcDialogue_1.NpcDialogue(6, NpcIdentifiers_1.NpcIdentifiers.EMBLEM_TRADER, "Here you go! Don't cry if you die!!", DialogueExpression_1.DialogueExpression.LAUGHING));
                    player.getDialogueManager().startDialog(_this, 6);
                    break;
                default:
                    player.getPacketSender().sendInterfaceRemoval();
                    break;
            }
        }), "Give me white skull!", "Give me red skull! (No item protect)", "Nothing..."));
    };
    return EmblemTraderDialogue;
}(DynamicDialogueBuilder_1.DynamicDialogueBuilder));
exports.EmblemTraderDialogue = EmblemTraderDialogue;
//# sourceMappingURL=EmblemTraderDialogue.js.map