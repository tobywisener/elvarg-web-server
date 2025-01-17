import { Command } from "../Command";
import { CommandManager } from "../CommandManager";
import { Player } from "../../../entity/impl/player/Player";
import { PlayerRights } from "../../rights/PlayerRights";

class ReloadCommands implements Command {
    execute(player: Player, command: string, parts: string[]) {
        CommandManager.loadCommands();
        player.getPacketSender().sendConsoleMessage("Reloaded");
    }

    canUse(player: Player) {
        return player.getRights() == PlayerRights.OWNER || player.getRights() == PlayerRights.DEVELOPER;
    }
}