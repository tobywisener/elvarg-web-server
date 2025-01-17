import { Command } from '../../../model/commands/Command';
import { Player } from '../../../entity/impl/player/Player';
import { PlayerRights } from '../../rights/PlayerRights';
import { World } from '../../../World';
import { NPC } from '../../../entity/impl/npc/NPC';

export class SpawnNPCCommand implements Command {
    execute(player: Player, command: string, parts: string[]) {
    let npc = NPC.create(parseInt(parts[1]), player.getLocation().clone());
    World.getAddNPCQueue().push(npc);
    if (player.getPrivateArea() != null) {
    player.getPrivateArea().add(npc);
    }
    }
    
    canUse(player: Player) {
        let rights = player.getRights();
        return (rights == PlayerRights.OWNER || rights == PlayerRights.DEVELOPER);
    }
}