import { NPCInteraction } from "./NPCInteraction";
import { NPC } from "./NPC";
import { Player } from "../player/Player";

export class NPCInteractionSystem {
    private static NPC_INTERACT_MAP: Map<number, NPCInteraction>;

    public static handleFirstOption(player: Player, npc: NPC): boolean {
    if (!(npc instanceof NPCInteraction)) {
        return false;
    }

    npc.firstOptionClick(player, npc);
    return true;
}

public static handleSecondOption(player: Player, npc: NPC): boolean {
    if (!(npc instanceof NPCInteraction)) {
        return false;
    }

    npc.secondOptionClick(player, npc);
    return true;
}

public static handleThirdOption(player: Player, npc: NPC): boolean {
    if (!(npc instanceof NPCInteraction)) {
        return false;
    }

    npc.thirdOptionClick(player, npc);
    return true;
}

public static handleForthOption(player: Player, npc: NPC): boolean {
    if (!(npc instanceof NPCInteraction)) {
        return false;
    }

    npc.forthOptionClick(player, npc);
    return true;
}

public static handleUseItem(player: Player, npc: NPC, itemId: number, slot: number): boolean {
    if (!(npc instanceof NPCInteraction)) {
        return false;
    }

    npc.useItemOnNpc(player, npc, itemId, slot);
    return true;
}
}