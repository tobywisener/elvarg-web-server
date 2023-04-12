import { PlayerRights } from '../../../model/rights/PlayerRights';
import { Command } from '../../../model/commands/Command';
import { Player } from '../../../entity/impl/player/Player';

export class ReloadNPCDefinitions implements Command {
    execute(player: Player, command: string, parts: string[]) {
        try {
            // new NpcDefinitionLoader().load();
            player.getPacketSender().sendConsoleMessage("Reloaded npc defs.");
        } catch (e) {
            console.log(e)
            player.getPacketSender().sendMessage("Error reloading npc defs.");
        }
    }

    canUse(player: Player) {
        return (player.getRights() == PlayerRights.OWNER || player.getRights() == PlayerRights.DEVELOPER);
    }
}