import { PlayerRights } from '../../../model/rights/PlayerRights';
import { Command } from '../../../model/commands/Command';
import { Player } from '../../../entity/impl/player/Player';
import { NpcDropDefinitionLoader } from '../../../definition/loader/impl/NpcDropDefinitionLoader';

class ReloadDrops implements Command {
    execute(player: Player, command: string, parts: string[]): void {
        try {
            new NpcDropDefinitionLoader().load();
            player.getPacketSender().sendConsoleMessage("Reloaded drops.");
        } catch (e) {
            console.log(e);
            player.getPacketSender().sendMessage("Error reloading npc drops.");
        }
    }

    canUse(player: Player): boolean {
        const rights = player.getRights();
        return rights == PlayerRights.OWNER || rights == PlayerRights.DEVELOPER;
    }
}