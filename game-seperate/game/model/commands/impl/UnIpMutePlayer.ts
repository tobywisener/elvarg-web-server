import { Command } from '../../../model/commands/Command';
import { Player } from '../../../entity/impl/player/Player';
import { PlayerRights } from '../../rights/PlayerRights';
import { World } from '../../../World';
import { CombatFactory } from '../../../content/combat/CombatFactory';

export class UnIpMutePlayer implements Command {
    execute(player: Player, command: string, parts: string[]) {
    let player2 = command.substring(parts[0].length + 1);
    let plr = World.getPlayerByName(player2);
    
        if (!plr) {
            player.getPacketSender().sendMessage(`Player ${player2} is not online.`);
            return;
        }
    
        if (CombatFactory.inCombat(plr)) {
            player.getPacketSender().sendMessage(`Player ${player2} is in combat!`);
            return;
        }
    }
    
    canUse(player: Player) {
        let rights = player.getRights();
        return (rights == PlayerRights.OWNER || rights == PlayerRights.DEVELOPER);
    }
}