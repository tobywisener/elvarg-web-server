import { PlayerRights } from '../../../model/rights/PlayerRights';
import { Command } from '../../../model/commands/Command';
import { Player } from '../../../entity/impl/player/Player';

export class CWarInterfaceCommand implements Command {
    execute(player: Player, command: string, parts: string[]) {
        try {
            player.getPacketSender().sendInterface(11169);
            let x = parseInt(parts[1]);
            let y = parseInt(parts[2]);
            player.getPacketSender().sendInterfaceComponentMoval(x, y, 11332);
            player.getPacketSender().sendMessage(`Sending RedX to X=${x}, Y=${y}`);
        } catch (e) {
            console.log(e);
        }
    }

    canUse(player: Player) {
        return player.getRights() == PlayerRights.DEVELOPER;
    }
}