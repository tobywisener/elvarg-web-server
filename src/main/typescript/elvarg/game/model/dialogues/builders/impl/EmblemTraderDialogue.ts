import { DynamicDialogueBuilder } from "../DynamicDialogueBuilder";
import { OptionDialogue } from "../../entries/impl/OptionDialogue";
import { ShopIdentifiers } from "../../../../../util/ShopIdentifiers";
import { NpcIdentifiers } from "../../../../../util/NpcIdentifiers";
import { BountyHunter } from "../../../../content/combat/bountyhunter/BountyHunter";
import { ActionDialogue } from "../../entries/impl/ActionDialogue";
import { ShopManager } from "../../../container/shop/ShopManager";
import { NpcDialogue } from "../../entries/impl/NpcDialogue";
import { EndDialogue } from "../../entries/impl/EndDialogue";
import { DialogueExpression } from "../../DialogueExpression";
import { SkullType } from "../../../SkullType";
import { CombatFactory } from "../../../../content/combat/CombatFactory";
import { Player } from "../../../../entity/impl/player/Player";
import { DialogueOption } from "../../DialogueOption";
import { DialogueOptionAction } from "../../DialogueOptionAction";

class BankerDialogueAction implements DialogueOptionAction{
    constructor(private readonly execFunc: Function){

    }
    executeOption(option: DialogueOption): void {
        this.execFunc()
    }

}

export class EmblemTraderDialogue extends DynamicDialogueBuilder {

    public build(player: Player) {
        this.add(new OptionDialogue(0, new BankerDialogueAction((option) => {
            switch (option) {
                case DialogueOption.FIRST_OPTION:
                    ShopManager.opens(player, ShopIdentifiers.PVP_SHOP);
                    break;
                case DialogueOption.SECOND_OPTION:
                    player.getDialogueManager().startDialogue(2);
                    break;
                case DialogueOption.THIRD_OPTION:
                    player.getDialogueManager().startDialogue(5);
                    break;
                default:
                    player.getPacketSender().sendInterfaceRemoval();
                    break;
            }
        }), "I Would like to see your goods", "Could I sell my emblems please?", "Give me a skull!", "Eh.. Nothing..."));

        () => {
            let value = BountyHunter.getValueForEmblems(player, true);
            if (value == 0) {
              this.add(new NpcDialogue(3, NpcIdentifiers.EMBLEM_TRADER, "Don't come to me with no emblems.. Go and fight!!", DialogueExpression.ANGRY_1));
              this.add(new EndDialogue(4));
              player.getDialogueManager().startDialog(this, 3);
            } else {
              this.add(new NpcDialogue(3, NpcIdentifiers.EMBLEM_TRADER, "Nice! You earned yourself " + value + " blood money!"));
              this.add(new EndDialogue(4));
              player.getDialogueManager().startDialog(this, 3);
            }
        }

        this.add(new OptionDialogue(5, new BankerDialogueAction((option: number) => {
            switch (option) {
                case DialogueOption.FIRST_OPTION:
                    CombatFactory.skull(player, SkullType.WHITE_SKULL, 300);
                    this.add(new NpcDialogue(6, NpcIdentifiers.EMBLEM_TRADER, "Here you go! Now have some fun!", DialogueExpression.LAUGHING));
                    player.getDialogueManager().startDialog(this, 6);
                    break;
                case DialogueOption.SECOND_OPTION:
                    CombatFactory.skull(player, SkullType.RED_SKULL, 300);
                    this.add(new NpcDialogue(6, NpcIdentifiers.EMBLEM_TRADER, "Here you go! Don't cry if you die!!", DialogueExpression.LAUGHING));
                    player.getDialogueManager().startDialog(this, 6);
                    break;
                default:
                    player.getPacketSender().sendInterfaceRemoval();
                    break;
            }
        }), "Give me white skull!", "Give me red skull! (No item protect)", "Nothing..."));
    }
}