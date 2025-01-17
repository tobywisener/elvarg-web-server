import { DynamicDialogueBuilder } from "../DynamicDialogueBuilder";
import { OptionDialogue } from "../../entries/impl/OptionDialogue";
import { NpcIdentifiers } from "../../../../../util/NpcIdentifiers";
import { ActionDialogue } from "../../entries/impl/ActionDialogue";
import { NpcDialogue } from "../../entries/impl/NpcDialogue";
import { Player } from "../../../../entity/impl/player/Player";
import { DialogueOption } from "../../DialogueOption";
import { BrokenItem } from "../../../BrokenItem";
import { DialogueOptionAction } from "../../DialogueOptionAction";
import { Action } from "../../../Action";

class BankerDialogueAction implements DialogueOptionAction{
    constructor(private readonly execFunc: Function){
    }
    executeOption(option: DialogueOption): void {
        this.execFunc()
    }

}

class ParduAction implements Action {
    constructor(private readonly execFunc: Function){

    }
    execute(): void {
        this.execFunc();
    }

}

export class ParduDialogue extends DynamicDialogueBuilder {
    public build(player: Player) {
        let allBrokenItemCost = BrokenItem.getRepairCost(player);
        if (allBrokenItemCost == 0) {
            this.add(new NpcDialogue(0, NpcIdentifiers.PERDU, "Hello! Seems like you have no broken items."));
            return;
        }
        this.add(new NpcDialogue(0, NpcIdentifiers.PERDU, "Hello would you like that I fix all your broken item for " +allBrokenItemCost+" blood money?"));

        this.add(new OptionDialogue(1, new BankerDialogueAction((option: number) => {
            switch (option) {
            case DialogueOption.FIRST_OPTION:
                player.getDialogueManager().startDialogue(2);
                break;
            default:
                player.getPacketSender().sendInterfaceRemoval();
                break;
            }
        }), "Yes Please", "No, thanks..."));

        this.add(new ActionDialogue(2, new ParduAction(() => {
            let isSuccess = BrokenItem.repair(player);
            if (isSuccess) {
                this.add(new NpcDialogue(3, NpcIdentifiers.PERDU, "All items repaired!"));
                player.getDialogueManager().startDialog(this, 3);
            } else {
                this.add(new NpcDialogue(3, NpcIdentifiers.PERDU, "You dont have enough blood money for me to fix your items..."));
                player.getDialogueManager().startDialog(this, 3);
            }
        })));
    }
}