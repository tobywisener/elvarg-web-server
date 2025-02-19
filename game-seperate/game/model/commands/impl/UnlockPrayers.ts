import { Command } from '../../../model/commands/Command';
import { Player } from '../../../entity/impl/player/Player';
import { PlayerRights } from '../../rights/PlayerRights';

export class UnlockPrayers implements Command {
    execute(player: Player, command: string, parts: string[]) {
        let type = parseInt(parts[1]);
        if (type == 0) {
            player.setPreserveUnlocked(true);
        } else if (type == 1) {
            player.setRigourUnlocked(true);
        } else if (type == 2) {
            player.setAuguryUnlocked(true);
        }
        player.getPacketSender().sendConfig(709, player.isPreserveUnlocked() ? 1 : 0);
        player.getPacketSender().sendConfig(711, player.isRigourUnlocked() ? 1 : 0);
        player.getPacketSender().sendConfig(713, player.getAuguryUnlocked() ? 1 : 0);
    }

    canUse(player: Player) {
        let rights = player.getRights();
        return (rights == PlayerRights.OWNER || rights == PlayerRights.DEVELOPER);
    }
}