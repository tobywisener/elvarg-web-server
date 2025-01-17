import { PlayerRights } from '../../../model/rights/PlayerRights';
import { Command } from '../../../model/commands/Command';
import { Player } from '../../../entity/impl/player/Player';
import { Item } from '../../Item';

class ItemSpawn implements Command {
    execute(player: Player, command: string, parts: string[]): void {
        let amount = 1;
        if (parts.length > 2) {
            amount = parseInt(parts[2]);
        }
        player.getInventory().addItem(new Item(parseInt(parts[1]), amount));
    }
    canUse(player: Player): boolean {
        let rights = player.getRights();
        return (rights == PlayerRights.OWNER || rights == PlayerRights.DEVELOPER);
    }
}