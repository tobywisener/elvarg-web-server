import { PlayerRights } from '../../../model/rights/PlayerRights';
import { Command } from '../../../model/commands/Command';
import { Player } from '../../../entity/impl/player/Player';
import { PlayerPunishment } from '../../../../util/PlayerPunishment';

export class ReloadPunishments implements Command {
    execute(player: Player, command: string, parts: string[]): void {
        PlayerPunishment.init();
        player.getPacketSender().sendConsoleMessage("Reloaded");
    }

    canUse(player: Player): boolean {
        const rights = player.getRights();
        return (rights === PlayerRights.OWNER || rights === PlayerRights.DEVELOPER);
    }
}