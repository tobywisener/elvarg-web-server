import { Command } from '../../../model/commands/Command';
import { Player } from '../../../entity/impl/player/Player';
import { PlayerRights } from '../../rights/PlayerRights';
import { World } from '../../../World';


class TeleToMe implements Command {
    execute(player: Player, command: string, parts: string[]) {
        let plr = World.getPlayerByName(command.substring(parts[0].length + 1));
        if (plr) {
            plr.moveTo(player.getLocation());
        }
    }
    canUse(player: Player): boolean {
        let rights = player.getRights();
        return (rights == PlayerRights.OWNER || rights == PlayerRights.DEVELOPER);
    }
}