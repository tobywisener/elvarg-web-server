import { Command } from "../Command";
import { Player } from "../../../entity/impl/player/Player";
import { World } from "../../../World";
import { PlayerRights } from "../../rights/PlayerRights";
import { GameConstants } from "../../../GameConstants";

export class MutePlayer implements Command {
    execute(player: Player, command: string, parts: string[]) {
    let player2 = command.substring(parts[0].length + 1);
    let plr = World.getPlayerByName(player2);
    

    if (!GameConstants.PLAYER_PERSISTENCE.exists(player2) && !plr) {
            player.getPacketSender().sendMessage("Player " + player2 + " does not exist.");
            return;
        }
    }
    
    canUse(player: Player) {
        let rights = player.getRights();
        return (rights == PlayerRights.OWNER || rights == PlayerRights.DEVELOPER);
    }
}