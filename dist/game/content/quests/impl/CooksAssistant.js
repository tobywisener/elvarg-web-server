"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CooksAssistant = void 0;
var QuestHandler_1 = require("../QuestHandler");
var Skill_1 = require("../../../model/Skill");
var DialogueExpression_1 = require("../../../model/dialogues/DialogueExpression");
var DialogueChainBuilder_1 = require("../../../model/dialogues/builders/DialogueChainBuilder");
var NpcIdentifiers_1 = require("../../../../util/NpcIdentifiers");
var NpcDialogue_1 = require("../../../model/dialogues/entries/impl/NpcDialogue");
var OptionDialogue_1 = require("../../../model/dialogues/entries/impl/OptionDialogue");
var PlayerDialogue_1 = require("../../../model/dialogues/entries/impl/PlayerDialogue");
var EndDialogue_1 = require("../../../model/dialogues/entries/impl/EndDialogue");
var CooksAssistant = exports.CooksAssistant = /** @class */ (function () {
    function CooksAssistant() {
        this.buildDialogues();
    }
    CooksAssistant.prototype.questTabStringId = function () {
        return 7333;
    };
    CooksAssistant.prototype.questTabButtonId = function () {
        return 28165;
    };
    CooksAssistant.prototype.questPointsReward = function () { return 1; };
    CooksAssistant.prototype.completeStatus = function () { return 3; };
    CooksAssistant.prototype.showQuestLog = function (player, currentStatus) {
        QuestHandler_1.Quests.clearQuestLogInterface(player);
        player.getPacketSender().sendString('@dre@Cooks Assistant', 8144);
        player.getPacketSender().sendString("", 8145);
        switch (currentStatus) {
            case 'NOT_STARTED':
                player.getPacketSender().sendString("Cook's Assistant", 8144);
                player.getPacketSender().sendString("I can start this quest by speaking to the Cook in the", 8147);
                player.getPacketSender().sendString("Lumbridge Castle kitchen.", 8148);
                player.getPacketSender().sendString("", 8149);
                player.getPacketSender().sendString("There are no minimum requirements.", 8150);
                break;
            case 1:
                player.getPacketSender().sendString("Cook's Assistant", 8144);
                player.getPacketSender().sendString("@str@I've talked to the cook.", 8147);
                player.getPacketSender().sendString("He wants me to gather the following materials:", 8148);
                if (player.getInventory().contains(CooksAssistant.EGG)) {
                    player.getPacketSender().sendString("@str@1 egg", 8149);
                }
                else {
                    player.getPacketSender().sendString("@red@1 egg", 8149);
                }
                if (player.getInventory().contains(CooksAssistant.MILK)) {
                    player.getPacketSender().sendString("@str@1 bucket of milk", 8150);
                }
                else {
                    player.getPacketSender().sendString("@red@1 bucket of milk", 8150);
                }
                if (player.getInventory().contains(CooksAssistant.FLOUR)) {
                    player.getPacketSender().sendString("@str@1 heap of flour", 8151);
                }
                else {
                    player.getPacketSender().sendString("@red@1 pot of flour", 8151);
                }
                break;
            case 2:
                player.getPacketSender().sendString("Cook's Assistant", 8144);
                player.getPacketSender().sendString("@str@I talked to the cook.", 8147);
                player.getPacketSender().sendString("@str@I gave the cook his items.", 8148);
                player.getPacketSender().sendString("I should go speak to the cook.", 8149);
                break;
            case 3:
                player.getPacketSender().sendString("Cook's Assistant", 8144);
                player.getPacketSender().sendString("@str@I talked to the cook.", 8147);
                player.getPacketSender().sendString("@str@I gave him his items.", 8148);
                player.getPacketSender().sendString("@red@     QUEST COMPLETE", 8150);
                player.getPacketSender().sendString("As a reward, I gained 300 Cooking Experience.", 8151);
                break;
        }
        player.getPacketSender().sendInterface(8134);
    };
    CooksAssistant.prototype.firstClickNpc = function (player, npc) {
        if (npc.getId() != CooksAssistant.NPC_COOK) {
            return false;
        }
        switch (QuestHandler_1.Quests.getProgress(player)) {
            case 0:
                player.getDialogueManager().startDialog(this.dialogueBuilder, 0);
                break;
            case 1:
                player.getDialogueManager().startDialog(this.dialogueBuilder, 20);
                break;
            case 2:
                player.getDialogueManager().startDialog(this.dialogueBuilder, 24);
                break;
            case 3:
                // If player has completed this quest, we shouldn't be handling the dialogue anymore
                return false;
        }
        return true;
    };
    CooksAssistant.prototype.buildDialogues = function () {
        var _this = this;
        this.dialogueBuilder = new DialogueChainBuilder_1.DialogueChainBuilder();
        this.dialogueBuilder.add(new NpcDialogue_1.NpcDialogue(0, CooksAssistant.NPC_COOK, "What am I to do?", DialogueExpression_1.DialogueExpression.SAD), new OptionDialogue_1.OptionDialogue(1, new CooksDialogueAction(function () { return ([
            ["What's wrong?", function (player) { return player.getDialogueManager().start(2); }],
            ["Can you cook me a cake?", function (player) { return player.getDialogueManager().start(14); }],
            ["You don't look very happy.", function (player) { return player.getDialogueManager().start(2); }],
            ["Nice hat.", function (player) { return player.getDialogueManager().start(17); }]
        ]); })), new PlayerDialogue_1.PlayerDialogue(2, "What's wrong?"), new NpcDialogue_1.NpcDialogue(3, CooksAssistant.NPC_COOK, "Oh dear, oh dear, oh dear, I'm in a terrible terrible" +
            "mess! It's the Duke's birthday today, and I should be" +
            "making him a lovely big birthday cake!", DialogueExpression_1.DialogueExpression.SAD), new NpcDialogue_1.NpcDialogue(4, CooksAssistant.NPC_COOK, "I've forgotten to buy the ingredients. I'll never get" +
            "them in time now. He'll sack me! What will I do? I have" +
            "four children and a goat to look after. Would you help" +
            "me? Please?", DialogueExpression_1.DialogueExpression.SAD), new OptionDialogue_1.OptionDialogue(5, new CooksDialogueAction(function (player) { return ([
            ["I'm always happy to help a cook in distress.", function (player) {
                    QuestHandler_1.Quests.COOKS_ASSISTANT.setProgress(player, 1);
                    player.getDialogueManager().start(6);
                }],
            ["I can't right now, Maybe later.", function (player) { return player.getDialogueManager().start(11); }]
        ]); })), new PlayerDialogue_1.PlayerDialogue(6, "Yes, I'll help you.", DialogueExpression_1.DialogueExpression.HAPPY), new NpcDialogue_1.NpcDialogue(7, CooksAssistant.NPC_COOK, "Oh thank you, thank you. I need milk, an egg, and " +
            "flour. I'd be very grateful if you can get them for me.", DialogueExpression_1.DialogueExpression.HAPPY), new PlayerDialogue_1.PlayerDialogue(8, "So where do I find these ingredients then?", DialogueExpression_1.DialogueExpression.DISTRESSED), new NpcDialogue_1.NpcDialogue(9, CooksAssistant.NPC_COOK, "You can find flour in any of the shops here." +
            "You can find eggs by killing chickens." +
            "You can find milk by using a bucket on a cow"), new EndDialogue_1.EndDialogue(10), new PlayerDialogue_1.PlayerDialogue(11, "I can't right now, Maybe later.", DialogueExpression_1.DialogueExpression.SAD), new NpcDialogue_1.NpcDialogue(12, CooksAssistant.NPC_COOK, "Oh please! Hurry then!", DialogueExpression_1.DialogueExpression.DISTRESSED), new EndDialogue_1.EndDialogue(13), new PlayerDialogue_1.PlayerDialogue(14, "Can you bake me a cake?", DialogueExpression_1.DialogueExpression.EVIL_LAUGH_SHORT), new NpcDialogue_1.NpcDialogue(15, CooksAssistant.NPC_COOK, "Does it look like I have the time?", DialogueExpression_1.DialogueExpression.ANGRY_1), new EndDialogue_1.EndDialogue(16), new PlayerDialogue_1.PlayerDialogue(17, "Nice hat!", DialogueExpression_1.DialogueExpression.EVIL_LAUGH_SHORT), new NpcDialogue_1.NpcDialogue(18, CooksAssistant.NPC_COOK, "I don't have time for your jibber-jabber!", DialogueExpression_1.DialogueExpression.ANGRY_1), new EndDialogue_1.EndDialogue(19), new NpcDialogue_1.NpcDialogue(20, CooksAssistant.NPC_COOK, "How are you getting on with finding the ingredients?", DialogueExpression_1.DialogueExpression.DISTRESSED, new CooksAction(function (player) {
            if (player.getInventory().contains(CooksAssistant.EGG) && player.getInventory().contains(CooksAssistant.MILK)
                && player.getInventory().contains(CooksAssistant.FLOUR)) {
                player.getDialogueManager().start(_this.dialogueBuilder, 21);
            }
            else {
                player.getDialogueManager().start(_this.dialogueBuilder, 24);
            }
        })), new PlayerDialogue_1.PlayerDialogue(21, "Here's all the ingredients!"), new NpcDialogue_1.NpcDialogue(22, CooksAssistant.NPC_COOK, "You brought me everything I need! I'm saved!", DialogueExpression_1.DialogueExpression.HAPPY, new CooksAction(function (player) {
            player.getInventory().delete(CooksAssistant.EGG, 1);
            player.getInventory().delete(CooksAssistant.MILK, 1);
            player.getInventory().delete(CooksAssistant.FLOUR, 1);
            QuestHandler_1.Quests.COOKS_ASSISTANT.setProgress(player, 2);
        })), new PlayerDialogue_1.PlayerDialogue(24, "So do I get to go to the Duke's Party?"), new NpcDialogue_1.NpcDialogue(25, CooksAssistant.NPC_COOK, "I'm afraid not, only the big cheeses get to dine with the"
            + "Duke.", DialogueExpression_1.DialogueExpression.SLIGHTLY_SAD), new PlayerDialogue_1.PlayerDialogue(26, "Well, maybe one day I'll be important enough to sit on" +
            "the Duke's table"), new NpcDialogue_1.NpcDialogue(27, CooksAssistant.NPC_COOK, "Maybe, but I won't be holding my breath.", DialogueExpression_1.DialogueExpression.LAUGHING, new CooksAction(function (player) {
            QuestHandler_1.Quests.COOKS_ASSISTANT.showRewardInterface(player, ["1 Quest Point", "500 Coins", "300 Cooking XP"], 326);
            player.getInventory().add(995, 500);
            player.getSkillManager().addExperience(Skill_1.Skill.COOKING, 300);
            player.getPacketSender().sendMessage("You completed " + QuestHandler_1.Quests.COOKS_ASSISTANT.getName() + "!");
            //client.getActionSender().sendQuickSong(93, 0);
        })), new PlayerDialogue_1.PlayerDialogue(24, "I don't have all the ingredients yet!", DialogueExpression_1.DialogueExpression.SAD), new EndDialogue_1.EndDialogue(25));
    };
    CooksAssistant.EGG = 1944;
    CooksAssistant.MILK = 1927;
    CooksAssistant.FLOUR = 1933;
    CooksAssistant.NPC_COOK = NpcIdentifiers_1.NpcIdentifiers.COOK;
    return CooksAssistant;
}());
var CooksDialogueAction = /** @class */ (function () {
    function CooksDialogueAction(execFunc) {
        this.execFunc = execFunc;
    }
    CooksDialogueAction.prototype.executeOption = function (option) {
        this.execFunc();
    };
    return CooksDialogueAction;
}());
var CooksAction = /** @class */ (function () {
    function CooksAction(execFunc) {
        this.execFunc = execFunc;
    }
    CooksAction.prototype.execute = function (player) {
        this.execFunc();
    };
    return CooksAction;
}());
//# sourceMappingURL=CooksAssistant.js.map