import { Player } from "../player/Player";
import { NPC } from "./NPC";

export class NPCInteraction {
    firstOptionClick(player: Player, npc: NPC): void{};
    secondOptionClick(player: Player, npc: NPC): void{};
    thirdOptionClick(player: Player, npc: NPC): void{};
    forthOptionClick(player: Player, npc: NPC): void{};
    useItemOnNpc(player: Player, npc: NPC, itemId: number, slot: number): void{};
}