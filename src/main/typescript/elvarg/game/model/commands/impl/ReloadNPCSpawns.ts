import { World } from "../../../World";
import { Command } from "../Command";
import { Player } from "../../../entity/impl/player/Player";
import { PlayerRights } from "../../rights/PlayerRights";
import { NpcSpawnDefinitionLoader } from "../../../definition/loader/impl/NpcSpawnDefinitionLoader";

class ReloadNPCSpawns implements Command {
    execute(player: Player, command: string, parts: string[]): void {
        try {
            World.getNpcs().clear();
			new NpcSpawnDefinitionLoader().load();
			player.getPacketSender().sendConsoleMessage("Reloaded npc spawns.");
		} catch (e) {
			console.error(e);
			player.getPacketSender().sendMessage("Error reloading npc spawns.");
		}
    }

    canUse(player: Player): boolean {
        return player.getRights() === PlayerRights.OWNER || player.getRights() === PlayerRights.DEVELOPER;
    }
}