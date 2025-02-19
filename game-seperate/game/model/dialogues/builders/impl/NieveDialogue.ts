import { DynamicDialogueBuilder } from "../DynamicDialogueBuilder";
import { OptionDialogue } from "../../entries/impl/OptionDialogue";
import { ActionDialogue } from "../../entries/impl/ActionDialogue";
import { NpcDialogue } from "../../entries/impl/NpcDialogue";
import { EndDialogue } from "../../entries/impl/EndDialogue";
import { Player } from "../../../../entity/impl/player/Player";
import { DialogueOption } from "../../DialogueOption";
import { Skill } from "../../../Skill";
import { SkillManager } from "../../../../content/skill/SkillManager";
import { Slayer } from "../../../../content/skill/slayer/Slayer";
import { PlayerDialogue } from "../../entries/impl/PlayerDialogue";

import { DialogueOptionAction } from "../../DialogueOptionAction";
import { Action } from "../../../Action";

class BankerDialogueAction implements DialogueOptionAction{
    constructor(private readonly execFunc: Function){

    }
    executeOption(option: DialogueOption): void {
        this.execFunc()
    }

}

class NieveAction implements Action {
    constructor(private readonly execFunc: Function){

    }
    execute(): void {
        this.execFunc();
    }

}


export class NieveDialogue extends DynamicDialogueBuilder {
    public build(player: Player) {
        this.add(new NpcDialogue(0, 6797, "'Ello, and what are you after then?"));
        this.add(new OptionDialogue(1, new BankerDialogueAction((option) => {
            switch (option) {
                case DialogueOption.FIRST_OPTION:
                    player.getDialogueManager().startDialogue(2);
                    break;
                case DialogueOption.SECOND_OPTION:
                    player.getDialogueManager().startDialogue(8);
                    break;
                case DialogueOption.THIRD_OPTION:
                    player.getDialogueManager().startDialogue(11);
                    break;
                default:
                    player.getPacketSender().sendInterfaceRemoval();
                    break;
            }
        }), "I need another assignment.", "Have you any rewards for me, or anything to trade?",
            "Tell me about your skill cape, please.", "Er.... Nothing..."));

            this.add(new ActionDialogue(2, new NieveAction(() => {
                if (player.getSlayerTask() == null) {
                  if (Slayer.assigns(player)) {
                    this.add(new NpcDialogue(3, 6797, "You've been assigned to hunt " + player.getSlayerTask().getRemaining() + " " + player.getSlayerTask().getTask().toString() + ", come back when you're done."));
                    this.add(new PlayerDialogue(4, "Okay, thanks."));
                    this.add(new EndDialogue(5));
                    player.getDialogueManager().startDialog(this, 3);
                  }
                } else {
                  this.add(new NpcDialogue(3, 6797, "You're still hunting " + player.getSlayerTask().getTask().toString() + ". You need to kill " + player.getSlayerTask().getRemaining() + " more, come back when you're done."));
                  this.add(new PlayerDialogue(4, "Got any tips for me?"));
                  this.add(new NpcDialogue(5, 6797, "You should be able to find your task " + player.getSlayerTask().getTask().getHint() + ".")); // TODO: Hints
                  this.add(new PlayerDialogue(6, "Thanks!"));
                  this.add(new EndDialogue(7));
                  player.getDialogueManager().startDialog(this, 3);
                }
                return true;
              })));

        this.add(new PlayerDialogue(8, "Have you any rewards for me, or anything to trade?"), new NpcDialogue(9, 6797,
            "I have quite a few rewards you can earn, and a wide variety of Slayer equipment for sale."));
        this.add(new OptionDialogue(10, new BankerDialogueAction((option: number) => {
            switch (option) {
                case DialogueOption.FIRST_OPTION:
                    // TODO: Rewards
                    break;
                case DialogueOption.SECOND_OPTION:
                    // TODO: Trade
                    break;
                default:
                    player.getPacketSender().sendInterfaceRemoval();
                    break;
            }
        }), "Look at rewards.", "Look at shop.", "Cancel."));

        // Skill cape
        if (player.getSkillManager().getMaxLevel(Skill.SLAYER) == SkillManager.getMaxAchievingLevel(Skill.SLAYER)) {
            this.add(new NpcDialogue(11, 6797, ""));
        } else {
            this.add(new NpcDialogue(11, 6797, ""));
        }
    }
}

