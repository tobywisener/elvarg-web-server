import {Player} from '../../../entity/impl/player/Player';
import {PlayerRights} from '../../../model/rights/PlayerRights';
import {Command} from '../../../model/commands/Command';

export class BarrageCommand implements Command {
    execute(player: Player, command: string, parts: string[]): void {

    }

    canUse(player: Player): boolean {
        let rights = player.getRights();
        return (rights == PlayerRights.OWNER || rights == PlayerRights.DEVELOPER);
    }
}