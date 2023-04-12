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
exports.NieveDialogue = void 0;
var DynamicDialogueBuilder_1 = require("../DynamicDialogueBuilder");
var OptionDialogue_1 = require("../../entries/impl/OptionDialogue");
var ActionDialogue_1 = require("../../entries/impl/ActionDialogue");
var NpcDialogue_1 = require("../../entries/impl/NpcDialogue");
var EndDialogue_1 = require("../../entries/impl/EndDialogue");
var DialogueOption_1 = require("../../DialogueOption");
var Skill_1 = require("../../../Skill");
var SkillManager_1 = require("../../../../content/skill/SkillManager");
var Slayer_1 = require("../../../../content/skill/slayer/Slayer");
var PlayerDialogue_1 = require("../../entries/impl/PlayerDialogue");
var BankerDialogueAction = /** @class */ (function () {
    function BankerDialogueAction(execFunc) {
        this.execFunc = execFunc;
    }
    BankerDialogueAction.prototype.executeOption = function (option) {
        this.execFunc();
    };
    return BankerDialogueAction;
}());
var NieveAction = /** @class */ (function () {
    function NieveAction(execFunc) {
        this.execFunc = execFunc;
    }
    NieveAction.prototype.execute = function () {
        this.execFunc();
    };
    return NieveAction;
}());
var NieveDialogue = /** @class */ (function (_super) {
    __extends(NieveDialogue, _super);
    function NieveDialogue() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NieveDialogue.prototype.build = function (player) {
        var _this = this;
        this.add(new NpcDialogue_1.NpcDialogue(0, 6797, "'Ello, and what are you after then?"));
        this.add(new OptionDialogue_1.OptionDialogue(1, new BankerDialogueAction(function (option) {
            switch (option) {
                case DialogueOption_1.DialogueOption.FIRST_OPTION:
                    player.getDialogueManager().startDialogue(2);
                    break;
                case DialogueOption_1.DialogueOption.SECOND_OPTION:
                    player.getDialogueManager().startDialogue(8);
                    break;
                case DialogueOption_1.DialogueOption.THIRD_OPTION:
                    player.getDialogueManager().startDialogue(11);
                    break;
                default:
                    player.getPacketSender().sendInterfaceRemoval();
                    break;
            }
        }), "I need another assignment.", "Have you any rewards for me, or anything to trade?", "Tell me about your skill cape, please.", "Er.... Nothing..."));
        this.add(new ActionDialogue_1.ActionDialogue(2, new NieveAction(function () {
            if (player.getSlayerTask() == null) {
                if (Slayer_1.Slayer.assigns(player)) {
                    _this.add(new NpcDialogue_1.NpcDialogue(3, 6797, "You've been assigned to hunt " + player.getSlayerTask().getRemaining() + " " + player.getSlayerTask().getTask().toString() + ", come back when you're done."));
                    _this.add(new PlayerDialogue_1.PlayerDialogue(4, "Okay, thanks."));
                    _this.add(new EndDialogue_1.EndDialogue(5));
                    player.getDialogueManager().startDialog(_this, 3);
                }
            }
            else {
                _this.add(new NpcDialogue_1.NpcDialogue(3, 6797, "You're still hunting " + player.getSlayerTask().getTask().toString() + ". You need to kill " + player.getSlayerTask().getRemaining() + " more, come back when you're done."));
                _this.add(new PlayerDialogue_1.PlayerDialogue(4, "Got any tips for me?"));
                _this.add(new NpcDialogue_1.NpcDialogue(5, 6797, "You should be able to find your task " + player.getSlayerTask().getTask().getHint() + ".")); // TODO: Hints
                _this.add(new PlayerDialogue_1.PlayerDialogue(6, "Thanks!"));
                _this.add(new EndDialogue_1.EndDialogue(7));
                player.getDialogueManager().startDialog(_this, 3);
            }
            return true;
        })));
        this.add(new PlayerDialogue_1.PlayerDialogue(8, "Have you any rewards for me, or anything to trade?"), new NpcDialogue_1.NpcDialogue(9, 6797, "I have quite a few rewards you can earn, and a wide variety of Slayer equipment for sale."));
        this.add(new OptionDialogue_1.OptionDialogue(10, new BankerDialogueAction(function (option) {
            switch (option) {
                case DialogueOption_1.DialogueOption.FIRST_OPTION:
                    // TODO: Rewards
                    break;
                case DialogueOption_1.DialogueOption.SECOND_OPTION:
                    // TODO: Trade
                    break;
                default:
                    player.getPacketSender().sendInterfaceRemoval();
                    break;
            }
        }), "Look at rewards.", "Look at shop.", "Cancel."));
        // Skill cape
        if (player.getSkillManager().getMaxLevel(Skill_1.Skill.SLAYER) == SkillManager_1.SkillManager.getMaxAchievingLevel(Skill_1.Skill.SLAYER)) {
            this.add(new NpcDialogue_1.NpcDialogue(11, 6797, ""));
        }
        else {
            this.add(new NpcDialogue_1.NpcDialogue(11, 6797, ""));
        }
    };
    return NieveDialogue;
}(DynamicDialogueBuilder_1.DynamicDialogueBuilder));
exports.NieveDialogue = NieveDialogue;
//# sourceMappingURL=NieveDialogue.js.map