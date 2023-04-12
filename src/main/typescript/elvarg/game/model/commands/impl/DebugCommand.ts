import { PlayerRights } from '../../../model/rights/PlayerRights';
import { Command } from '../../../model/commands/Command';
import { Player } from '../../../entity/impl/player/Player';
import { RegionManager } from '../../../collision/RegionManager';

export class DebugCommand implements Command {
    execute(player: Player, command: string, parts: string[]) {
        console.log(RegionManager.wallsExist(player.getLocation().clone(), player.getPrivateArea()));
    }

    canUse(player: Player) {
        return (player.getRights() == PlayerRights.DEVELOPER);
    }
}