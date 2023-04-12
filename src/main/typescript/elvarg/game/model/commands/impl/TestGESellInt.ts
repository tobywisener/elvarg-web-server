import { Command } from '../../../model/commands/Command';
import { Player } from '../../../entity/impl/player/Player';
import { PlayerRights } from '../../rights/PlayerRights';
import { ItemDefinition } from '../../../definition/ItemDefinition';

export class TestGESellInt implements Command {
    execute(player: Player, command: string, parts: string[]) {
        player.getPacketSender().
            sendItemOnInterfaces(24780, parseInt(parts[1]), 1).
            sendString(ItemDefinition.forId(parseInt(parts[1])).getName(), 24769).
            sendString(ItemDefinition.forId(parseInt(parts[1])).getExamine(), 24770);
    }
    canUse(player: Player): boolean {
        let rights = player.getRights();
        return (rights == PlayerRights.OWNER || rights == PlayerRights.DEVELOPER);
    }
}