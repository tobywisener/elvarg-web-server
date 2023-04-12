import { Command } from "../Command";
import { World } from "../../../World";
import { Player } from "../../../entity/impl/player/Player";
import { PlayerRights } from "../../rights/PlayerRights";

export class IpMutePlayer implements Command {
    execute(player: Player, command: string, parts: string[]) {
    let player2 = World.getPlayerByName(command.substring(parts[0].length + 1));
    
    if (!player2) {
            player.getPacketSender().sendMessage("Player " + player2 + " is not online.");
            return;
        }
    
    }
    
    canUse(player: Player) {
        return (player.getRights() == PlayerRights.OWNER || player.getRights() == PlayerRights.DEVELOPER);
    }
}