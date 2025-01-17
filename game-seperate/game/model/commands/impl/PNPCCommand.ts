import { PlayerRights } from '../../../model/rights/PlayerRights';
import { Command } from '../../../model/commands/Command';
import { Player } from '../../../entity/impl/player/Player';

export class PNPCCommand implements Command {
    execute(player: Player, command: string, parts: string[]): void {
        player.setNpcTransformationId(parseInt(parts[1]));
    }

    canUse(player: Player): boolean {
        return player.getRights() === PlayerRights.OWNER || player.getRights() === PlayerRights.DEVELOPER;
    }
}