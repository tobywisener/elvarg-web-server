import { NPC } from "../NPC";
import { Player } from "../../player/Player";
import {Ids} from "../../../../model/Ids"
import {ParduDialogue} from "../../../../model/dialogues/builders/impl/ParduDialogue"
import {NPCInteraction} from "../NPCInteraction"
import {NpcIdentifiers} from "../../../../../util/NpcIdentifiers"


export class Perdu implements NPCInteraction {
    
    public firstOptionClick(player: Player, npc: NPC): void {
        player.getDialogueManager().startDialogues(new ParduDialogue());
    }

    public secondOptionClick(player: Player, npc: NPC): void {
    }

    public thirdOptionClick(player: Player, npc: NPC): void {
    }

    public forthOptionClick(player: Player, npc: NPC): void {
    }

    public useItemOnNpc(player: Player, npc: NPC, itemId: number, slot: number): void {
    }
}
