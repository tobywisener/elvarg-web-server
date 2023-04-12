import { Command } from '../../model/commands/Command';
import { Player } from '../../entity/impl/player/Player';
import { PlayerRights } from '../rights/PlayerRights';
import { ItemOnGroundManager } from '../../entity/impl/grounditem/ItemOnGroundManager';
import { Item } from '../Item';
export class GroundItemCommand implements Command {
    execute(player: Player, command: string, parts: string[]) {
        ItemOnGroundManager.registers(player, new Item(995, 10000));
        player.getPacketSender().sendMessage("Spawned ground item..");
    }
    canUse(player: Player) {
        return player.getRights() === PlayerRights.OWNER;
    }
}