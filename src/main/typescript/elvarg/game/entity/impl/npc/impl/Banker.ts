import { NPC } from "../NPC";
import { Player } from "../../player/Player";
import { BankerDialogue } from "../../../../model/dialogues/builders/impl/BankedDialogue"
import { NPCInteraction } from "../NPCInteraction";

class Banker implements NPCInteraction {
    firstOptionClick(player: Player, npc: NPC) {
        player.getDialogueManager().startDialogues(new BankerDialogue());
    }

    secondOptionClick(player: Player, npc: NPC) {
        player.getBank(player.currentBankTab).open();
    }

    thirdOptionClick(player: Player, npc: NPC) { }

    forthOptionClick(player: Player, npc: NPC) { }

    useItemOnNpc(player: Player, npc: NPC, itemId: number, slot: number) { }
}