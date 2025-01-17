import { PlayerRights } from '../../../model/rights/PlayerRights';
import { Command } from '../../../model/commands/Command';
import { Player } from '../../../entity/impl/player/Player';
import { GameConstants } from '../../../GameConstants';


export class Save implements Command {
    execute(player: Player, command: string, parts: string[]) {
        GameConstants.PLAYER_PERSISTENCE.save(player);
        player.getPacketSender().sendMessage("Saved player.");
    }
    canUse(player: Player) {
        return (player.getRights() == PlayerRights.DEVELOPER || player.getRights() == PlayerRights.OWNER);
    }
}
