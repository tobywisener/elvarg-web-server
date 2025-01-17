import { Command } from '../../../model/commands/Command';
import { Player } from '../../../entity/impl/player/Player';


export class Store implements Command {
    execute(player: Player, command: string, parts: string[]) {
        player.getPacketSender().sendURL("http://www.deadlypkers.net");
    }
    canUse(player: Player): boolean {
        return true;
    }
}