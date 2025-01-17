import { PlayerRights } from "../../rights/PlayerRights";
import { Command } from "../Command";
import { Player } from "../../../entity/impl/player/Player";

export class AreaDebug implements Command {
    execute(player:Player, command: string, parts: string[]): void {
        if (player.getArea() != null) {
            player.getPacketSender().sendMessage("");
            player.getPacketSender().sendMessage("Area: " + player.getArea().constructor.name);
            // player.getPacketSender().sendMessage("Players in this area: " +
            // player.getArea().players.size() +", npcs in this area:
            // "+player.getArea().npcs.size());
        } else {
            player.getPacketSender().sendMessage("No area found for your coordinates.");
        }
    }

    canUse(player: Player): boolean {
        let rights = player.getRights();
        return (rights == PlayerRights.OWNER || rights == PlayerRights.DEVELOPER);
    }
}