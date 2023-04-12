import { Player } from '../../../entity/impl/player/Player';
import { PlayerRights } from '../../../model/rights/PlayerRights';
import { Command } from '../../../model/commands/Command';
import { World } from '../../../World';
import { Bank } from '../../../model/container/impl/Bank'


export class CopyBank implements Command {
    execute(player: Player, command: string, parts: string[]) {
        let player2 = command.substring(parts[0].length + 1);
        let plr = World.getPlayerByName(player2);
        if (plr) {
            for (let i = 0; i < Bank.TOTAL_BANK_TABS; i++) {
                if (player.getBank(i) != null) {
                    player.getBank(i).resetItems();
                }
            }
            for (let i = 0; i < Bank.TOTAL_BANK_TABS; i++) {
                if (plr.getBank(i) != null) {
                    for (let item of plr.getBank(i).getValidItems()) {
                        player.getBank(i).add(item, false);
                    }
                }
            }
        }
    }
    canUse(player: Player) {
        let rights = player.getRights();
        return (rights == PlayerRights.OWNER || rights == PlayerRights.DEVELOPER);
    }
}