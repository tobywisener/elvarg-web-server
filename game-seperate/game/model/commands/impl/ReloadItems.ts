import { PlayerRights } from '../../../model/rights/PlayerRights';
import { Command } from '../../../model/commands/Command';
import { Player } from '../../../entity/impl/player/Player';

class ReloadItems implements Command {
    execute(player: Player, command: string, parts: string[]) {
        try {
            //new ItemDefinitionLoader().load();
            player.getPacketSender().sendMessage("Reloaded item defs");
        } catch (e) {
            console.log(e);
            player.getPacketSender().sendMessage("Error reloading item defs");
        }
    }

    canUse(player: Player) {
        return (player.getRights() == PlayerRights.OWNER || player.getRights() == PlayerRights.DEVELOPER);
    }
}