import { PlayerRights } from "../../rights/PlayerRights";
import { Command } from "../Command";
import { World } from "../../../World";
import { Player } from "../../../entity/impl/player/Player";

export class IpBanPlayer implements Command {
    execute(player: Player, command: string, parts: string[]) {
        let player2 = command.substring(parts[0].length + 1);
        let plr = World.getPlayerByName(player2);

        if (!plr) {
            player.getPacketSender().sendMessage("Player " + player2 + " is not online.");
            return;
        }
    }

    canUse(player: Player): boolean {
        let rights = player.getRights();
        return (rights == PlayerRights.OWNER || rights == PlayerRights.DEVELOPER);
    }
}