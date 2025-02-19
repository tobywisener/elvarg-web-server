import { Player } from '../../../entity/impl/player/Player';
import { PlayerRights } from '../../../model/rights/PlayerRights';
import { Command } from '../../../model/commands/Command';

export class ConfigCommand implements Command {
    execute(player: Player, command: string, parts: string[]) {
        player.getPacketSender().sendConfig(parseInt(parts[1]), parseInt(parts[2]));
        player.getPacketSender().sendMessage("Sent config");
    }

    canUse(player: Player): boolean {
        let rights = player.getRights();
        return (rights == PlayerRights.OWNER || rights == PlayerRights.DEVELOPER);
    }
}