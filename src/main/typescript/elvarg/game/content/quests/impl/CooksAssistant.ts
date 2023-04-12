import { Quest } from '../Quest';
import { QuestHandler, Quests } from '../QuestHandler';
import { NPC } from '../../../entity/impl/npc/NPC';
import { Player } from '../../../entity/impl/player/Player';
import { Skill } from '../../../model/Skill';
import { DialogueExpression } from '../../../model/dialogues/DialogueExpression';
import { DialogueChainBuilder } from '../../../model/dialogues/builders/DialogueChainBuilder';
import { NpcIdentifiers } from '../../../../util/NpcIdentifiers';
import { NpcDialogue } from '../../../model/dialogues/entries/impl/NpcDialogue';
import { OptionDialogue } from '../../../model/dialogues/entries/impl/OptionDialogue';
import { PlayerDialogue } from '../../../model/dialogues/entries/impl/PlayerDialogue';
import { EndDialogue } from '../../../model/dialogues/entries/impl/EndDialogue';
import { DialogueOptionAction } from '../../../model/dialogues/DialogueOptionAction';
import { DialogueOption } from '../../../model/dialogues/DialogueOption';
import { DialogueAction } from '../../../model/dialogues/DialogueAction';

export class CooksAssistant implements Quest {

    private static EGG = 1944;
    private static MILK = 1927;
    private static FLOUR = 1933;

    private static NPC_COOK = NpcIdentifiers.COOK;

    dialogueBuilder: DialogueChainBuilder;

    questTabStringId(): number {
        return 7333;
    }

    questTabButtonId(): number {
        return 28165;
    }

    questPointsReward(): number { return 1; }

    completeStatus(): number { return 3; }

    constructor() {
        this.buildDialogues();
    }

    showQuestLog(player: Player, currentStatus: number | string) {
        Quests.clearQuestLogInterface(player);

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
                } else {
                    player.getPacketSender().sendString("@red@1 egg", 8149);
                }
                if (player.getInventory().contains(CooksAssistant.MILK)) {
                    player.getPacketSender().sendString("@str@1 bucket of milk", 8150);
                } else {
                    player.getPacketSender().sendString("@red@1 bucket of milk", 8150);
                }
                if (player.getInventory().contains(CooksAssistant.FLOUR)) {
                    player.getPacketSender().sendString("@str@1 heap of flour", 8151);
                } else {
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
    }

    firstClickNpc(player: Player, npc: NPC) {
        if (npc.getId() != CooksAssistant.NPC_COOK) {
            return false;
        }

        switch (Quests.getProgress(player)) {
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
    }

    private buildDialogues() {
        this.dialogueBuilder = new DialogueChainBuilder();
        this.dialogueBuilder.add(
            new NpcDialogue(0, CooksAssistant.NPC_COOK, "What am I to do?", DialogueExpression.SAD),
            new OptionDialogue(1, new CooksDialogueAction(() => ([
                ["What's wrong?", (player: any) => player.getDialogueManager().start(2)],
                ["Can you cook me a cake?", (player: any) => player.getDialogueManager().start(14)],
                ["You don't look very happy.", (player: any) => player.getDialogueManager().start(2)],
                ["Nice hat.", (player: any) => player.getDialogueManager().start(17)]
                ]))),
            new PlayerDialogue(2, "What's wrong?"),
            new NpcDialogue(3, CooksAssistant.NPC_COOK,
                "Oh dear, oh dear, oh dear, I'm in a terrible terrible" +
                "mess! It's the Duke's birthday today, and I should be" +
                "making him a lovely big birthday cake!", DialogueExpression.SAD),
            new NpcDialogue(4,CooksAssistant. NPC_COOK,
                "I've forgotten to buy the ingredients. I'll never get" +
                "them in time now. He'll sack me! What will I do? I have" +
                "four children and a goat to look after. Would you help" +
                "me? Please?", DialogueExpression.SAD),
            new OptionDialogue(5, new CooksDialogueAction((player) =>([
                ["I'm always happy to help a cook in distress.", (player) => {
                    Quests.COOKS_ASSISTANT.setProgress(player, 1);
                    player.getDialogueManager().start(6);
                }],
                ["I can't right now, Maybe later.", (player) => player.getDialogueManager().start(11)]
            ]))),

            new PlayerDialogue(6, "Yes, I'll help you.", DialogueExpression.HAPPY),
            new NpcDialogue(7, CooksAssistant.NPC_COOK, "Oh thank you, thank you. I need milk, an egg, and " +
                "flour. I'd be very grateful if you can get them for me.", DialogueExpression.HAPPY),
            new PlayerDialogue(8, "So where do I find these ingredients then?", DialogueExpression.DISTRESSED),
            new NpcDialogue(9, CooksAssistant.NPC_COOK, "You can find flour in any of the shops here." +
                "You can find eggs by killing chickens." +
                "You can find milk by using a bucket on a cow"),
            new EndDialogue(10),

            new PlayerDialogue(11, "I can't right now, Maybe later.", DialogueExpression.SAD),
            new NpcDialogue(12, CooksAssistant.NPC_COOK, "Oh please! Hurry then!", DialogueExpression.DISTRESSED),
            new EndDialogue(13),

            new PlayerDialogue(14, "Can you bake me a cake?", DialogueExpression.EVIL_LAUGH_SHORT),
            new NpcDialogue(15, CooksAssistant.NPC_COOK, "Does it look like I have the time?", DialogueExpression.ANGRY_1),
            new EndDialogue(16),

            new PlayerDialogue(17, "Nice hat!", DialogueExpression.EVIL_LAUGH_SHORT),
            new NpcDialogue(18, CooksAssistant.NPC_COOK, "I don't have time for your jibber-jabber!", DialogueExpression.ANGRY_1),
            new EndDialogue(19),

            new NpcDialogue(20, CooksAssistant.NPC_COOK, "How are you getting on with finding the ingredients?", DialogueExpression.DISTRESSED, new CooksAction((player) => {
                if (player.getInventory().contains(CooksAssistant.EGG) && player.getInventory().contains(CooksAssistant.MILK)
                    && player.getInventory().contains(CooksAssistant.FLOUR)) {
                    player.getDialogueManager().start(this.dialogueBuilder, 21);
                } else {
                    player.getDialogueManager().start(this.dialogueBuilder, 24);
                }
            })),

            new PlayerDialogue(21, "Here's all the ingredients!"),
            new NpcDialogue(22, CooksAssistant.NPC_COOK, "You brought me everything I need! I'm saved!", DialogueExpression.HAPPY, new CooksAction((player) => {
                player.getInventory().delete(CooksAssistant.EGG, 1);
                player.getInventory().delete(CooksAssistant.MILK, 1);
                player.getInventory().delete(CooksAssistant.FLOUR, 1);

                Quests.COOKS_ASSISTANT.setProgress(player, 2);
            })),
            new PlayerDialogue(24, "So do I get to go to the Duke's Party?"),
            new NpcDialogue(25, CooksAssistant.NPC_COOK, "I'm afraid not, only the big cheeses get to dine with the"
                + "Duke.", DialogueExpression.SLIGHTLY_SAD),
            new PlayerDialogue(26, "Well, maybe one day I'll be important enough to sit on" +
                "the Duke's table"),
            new NpcDialogue(27, CooksAssistant.NPC_COOK, "Maybe, but I won't be holding my breath.",DialogueExpression.LAUGHING, new CooksAction((player) => {
                Quests.COOKS_ASSISTANT.showRewardInterface(player, ["1 Quest Point", "500 Coins", "300 Cooking XP"], 326);
                player.getInventory().add(995, 500);
                player.getSkillManager().addExperience(Skill.COOKING, 300);
                player.getPacketSender().sendMessage("You completed " + Quests.COOKS_ASSISTANT.getName() + "!");
                //client.getActionSender().sendQuickSong(93, 0);
            })),

            new PlayerDialogue(24, "I don't have all the ingredients yet!", DialogueExpression.SAD),
            new EndDialogue(25)
        );
    }
}


class CooksDialogueAction implements DialogueOptionAction{
    constructor(private readonly execFunc: Function){

    }
    executeOption(option: DialogueOption): void {
        this.execFunc();
    }

}

class CooksAction implements DialogueAction{
    constructor(private readonly execFunc: Function){

    }
    execute(player: Player): void {
        this.execFunc();
    }
    
}