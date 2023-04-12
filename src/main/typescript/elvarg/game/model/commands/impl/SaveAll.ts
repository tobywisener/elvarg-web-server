import { Player } from "../../../entity/impl/player/Player";
import { Command } from "../Command";
import { World } from "../../../World";
import { PlayerRights } from "../../rights/PlayerRights";

class SaveAll implements Command {
    execute(player: Player, command: string, parts: string[]) {
        World.savePlayers();
        player.getPacketSender().sendMessage("Saved all players.");
    }

    canUse(player: Player) {
        return (player.getRights() == PlayerRights.DEVELOPER || player.getRights() == PlayerRights.OWNER || player.getRights() == PlayerRights.ADMINISTRATOR);
    }
}