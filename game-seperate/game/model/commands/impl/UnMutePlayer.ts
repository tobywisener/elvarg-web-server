import { Command } from '../../../model/commands/Command';
import { Player } from '../../../entity/impl/player/Player';
import { PlayerRights } from '../../rights/PlayerRights';
import { World } from '../../../World';
import { GameConstants } from '../../../GameConstants';
import { PlayerPunishment } from '../../../../util/PlayerPunishment';

export class UnMutePlayer implements Command {
    execute(player: Player, command: string, parts: string[]) {
        let player2 = command.substring(parts[0].length + 1);
        let plr = World.getPlayerByName(player2);

        if (!GameConstants.PLAYER_PERSISTENCE.exists(player2) && !plr) {
            player.getPacketSender().sendMessage(`Player ${player2} does not exist.`);
            return;
        }

        if (!PlayerPunishment.muted(player2)) {
            player.getPacketSender().sendMessage(`Player ${player2} does not have an active mute.`);
            return;
        }
    }

    canUse(player: Player) {
        let rights = player.getRights();
        return (rights == PlayerRights.OWNER || rights == PlayerRights.DEVELOPER);
    }
}