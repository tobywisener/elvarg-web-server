import { Player } from '../../entity/impl/player/Player';
import { NPC } from '../../entity/impl/npc/NPC';
export interface Quest {
    questTabButtonId(): number;
    questTabStringId(): number;
    completeStatus(): number;
    questPointsReward(): number;
    showQuestLog(player: Player, currentStatus: number): void;
    firstClickNpc(player: Player, npc: NPC): boolean;
}
