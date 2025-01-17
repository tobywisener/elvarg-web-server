import { PlayerRights } from '../../../model/rights/PlayerRights';
import { Command } from '../../../model/commands/Command';
import { Player } from '../../../entity/impl/player/Player';
import { ShopDefinitionLoader } from '../../../definition/loader/impl/ShopDefinitionLoader';

class ReloadShops implements Command {
	execute(player: Player, command: string, parts: string[]) {
		try {
			new ShopDefinitionLoader().load();
			player.getPacketSender().sendConsoleMessage("Reloaded shops.");
		} catch (error) {
			console.log(error);
			player.getPacketSender().sendMessage("Error reloading shops.");
		}
	}

	canUse(player: Player) {
		return (player.rights === PlayerRights.OWNER || player.rights === PlayerRights.DEVELOPER);
	}
}