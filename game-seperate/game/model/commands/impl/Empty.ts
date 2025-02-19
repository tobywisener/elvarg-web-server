import { PlayerRights } from '../../../model/rights/PlayerRights';
import { Command } from '../../../model/commands/Command';
import { Player } from '../../../entity/impl/player/Player';

class Empty implements Command {
    execute(player: Player, command: string, parts: string[]) {
        player.getSkillManager().stopSkillable();
        player.getInventory().resetItems().refreshItems();
    }

    canUse(player: Player) {
        return true;
    }
}