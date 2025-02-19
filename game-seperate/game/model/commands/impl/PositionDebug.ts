import { PlayerRights } from '../../../model/rights/PlayerRights';
import { Command } from '../../../model/commands/Command';
import { Player } from '../../../entity/impl/player/Player';

export class PositionDebug implements Command {

    execute(player: Player, command: string, parts: string[]) {
        player.getPacketSender().sendMessage(player.getLocation().toString());
    }

    canUse(player: Player): boolean {
        const rights = player.getRights();
        return (rights == PlayerRights.OWNER || rights == PlayerRights.DEVELOPER);
    }
}