import { PlayerRights } from '../../../model/rights/PlayerRights';
import { Command } from '../../../model/commands/Command';
import { Player } from '../../../entity/impl/player/Player';
import { TaskManager } from '../../../task/TaskManager';

export class TaskDebug implements Command {
    execute(player: Player, command: string, parts: string[]) {
        player.getPacketSender().sendMessage("Active tasks :" + TaskManager.getTaskAmount() + ".");
    }
    canUse(player: Player): boolean {
        let rights = player.getRights();
        return (rights == PlayerRights.OWNER || rights == PlayerRights.DEVELOPER);
    }
}