import {Player} from '../../../entity/impl/player/Player';
import {PlayerRights} from '../../../model/rights/PlayerRights';
import {Command} from '../../../model/commands/Command';
import { GameConstants } from '../../../GameConstants';
import {World} from '../../../World';
import {PlayerPunishment} from '../../../../util/PlayerPunishment';

export class BanPlayer implements Command {
    execute(player: Player, command: string, parts: string[]): void {
        let player2 = command.substring(parts[0].length + 1);
        let plr = World.getPlayerByName(player2);

        if (!GameConstants.PLAYER_PERSISTENCE.exists(player2) && !plr) {
            player.getPacketSender().sendMessage(`Player ${player2} is not a valid online player.`);
            return;
        }

        if (PlayerPunishment.banned(player2)) {
            player.getPacketSender().sendMessage(`Player ${player2} already has an active ban.`);
            if (plr) {
                plr.requestLogout();
            }
            return;
        }
    }

    canUse(player: Player): boolean {
        let rights = player.getRights();
        return (rights == PlayerRights.OWNER || rights == PlayerRights.DEVELOPER);
    }
}