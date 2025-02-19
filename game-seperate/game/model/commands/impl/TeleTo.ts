import { Command } from '../../../model/commands/Command';
import { Player } from '../../../entity/impl/player/Player';
import { PlayerRights } from '../../rights/PlayerRights';
import { Location } from '../../Location';

class TeleTo implements Command {
    execute(player: Player, command: string, parts: string[]) {
        let x = parseInt(parts[1]);
        let y = parseInt(parts[2]);
        let z = 0;
        if (parts.length == 4) {
            z = parseInt(parts[3]);
        }
        player.moveTo(new Location(x, y));
    }
    canUse(player: Player): boolean {
        let rights = player.getRights();
        return (rights == PlayerRights.OWNER || rights == PlayerRights.DEVELOPER);
    }
}