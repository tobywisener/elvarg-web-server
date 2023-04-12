import { PlayerRights } from '../../../model/rights/PlayerRights';
import { Command } from '../../../model/commands/Command';
import { Player } from '../../../entity/impl/player/Player';

export class InfiniteHealth implements Command {
    execute(player: Player, command: string, parts: string[]) {
        player.setInfiniteHealth(!player.hasInfiniteHealth());
        player.getPacketSender().sendMessage(`Invulnerable: ${player.hasInfiniteHealth()}`);
    }

    canUse(player: Player) {
        return player.getRights() === PlayerRights.OWNER || player.getRights() === PlayerRights.DEVELOPER;
    }
}