import { PlayerRights } from '../../../model/rights/PlayerRights';
import { Command } from '../../../model/commands/Command';
import { Player } from '../../../entity/impl/player/Player';

export class Noclip implements Command {
    execute(player: Player, command: string, parts: string[]): void {
        player.getPacketSender().sendEnableNoclip();
        player.getPacketSender().sendConsoleMessage("Noclip enabled.");
    }

    canUse(player: Player): boolean {
        return player.getRights() === PlayerRights.OWNER || player.getRights() === PlayerRights.DEVELOPER;
    }
}