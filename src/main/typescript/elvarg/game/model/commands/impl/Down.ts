import { PlayerRights } from '../../../model/rights/PlayerRights';
import { Command } from '../../../model/commands/Command';
import { Player } from '../../../entity/impl/player/Player';

export class Down implements Command {
    execute(player: Player, command: string, parts: string[]): void {
        let newLocation = player.getLocation().clone().setZ(player.getLocation().getZ() - 1);
        if (newLocation.getZ() < 0) {
            newLocation.setZ(0);
            player.getPacketSender().sendMessage("You cannot move to a negative plane!");
        }
        player.moveTo(newLocation);
    }

    canUse(player: Player): boolean {
        return (player.getRights() == PlayerRights.OWNER || player.getRights() == PlayerRights.DEVELOPER);
    }
}