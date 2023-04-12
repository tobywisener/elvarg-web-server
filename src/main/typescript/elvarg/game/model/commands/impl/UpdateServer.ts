import { Command } from '../../../model/commands/Command';
import { Player } from '../../../entity/impl/player/Player';
import { Server } from '../../../../Server';
import { World } from '../../../World';
import { TaskManager } from '../../../task/TaskManager';
import { Task } from '../../../task/Task';
import { ClanChatManager } from '../../../content/clan/ClanChatManager';
import { PlayerRights } from '../../rights/PlayerRights';

export class UpdateTask extends Task {
    constructor(p: number, private readonly execFunc) {
        super(p)
    }

    execute(): void {
        this.execFunc();
        this.stop();
    }
}

export class UpdateServer implements Command {
    execute(player: Player, command: string, parts: string[]) {
        let time = parseInt(parts[1]);
        if (time > 0) {
            Server.setUpdating(true);
            for (let players of World.getPlayers()) {
                if (!players) {
                    continue;
                }
                players.getPacketSender().sendSystemUpdate(time);
            }
            TaskManager.submit(new UpdateTask(time, () => {
                for (const player of World.getPlayers()) {
                    if (player != null) {
                        player.requestLogout();
                    }
                }
                ClanChatManager.save();
                Server.getLogger().info("Update task finished!");
            })
            );
        }
    }
    canUse(player: Player) {
        let rights = player.getRights();
        return (rights == PlayerRights.OWNER || rights == PlayerRights.DEVELOPER);
    }
}