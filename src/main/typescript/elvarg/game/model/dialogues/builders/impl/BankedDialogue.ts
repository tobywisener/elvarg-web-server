import { NpcIdentifiers } from "../../../../../util/NpcIdentifiers";
import { OptionDialogue } from '../../../../model/dialogues/entries/impl/OptionDialogue'
import { Player } from "../../../../entity/impl/player/Player";
import { DynamicDialogueBuilder } from '../../../../model/dialogues/builders/DynamicDialogueBuilder'
import { NpcDialogue } from '../../../../model/dialogues/entries/impl/NpcDialogue'
import { DialogueOption } from "../../DialogueOption";
import { DialogueOptionAction } from "../../DialogueOptionAction";


export class BankerDialogue extends DynamicDialogueBuilder {

    build(player: Player) {
        this.add(new NpcDialogue(0, NpcIdentifiers.BANKER, "Hello would you like to open the bank?"));

        this.add(new OptionDialogue(1, new BankerDialogueAction((option) => {
            switch (option) {
                case DialogueOption.FIRST_OPTION:
                    player.getBank(player.getCurrentBankTab()).open();
                    break;
                default:
                    player.getPacketSender().sendInterfaceRemoval();
                    break;
            }
        }), "Yes Please", "No, thanks..."));
    }
}

class BankerDialogueAction implements DialogueOptionAction{
    constructor(private readonly execFunc: Function){

    }
    executeOption(option: DialogueOption): void {
        this.execFunc()
    }

}