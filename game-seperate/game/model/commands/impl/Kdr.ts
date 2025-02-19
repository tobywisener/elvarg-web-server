import { Command } from '../../../model/commands/Command';
import { Player } from '../../../entity/impl/player/Player';


export class Kdr implements Command {
    execute(player: Player, command: string, parts: string[]) {
    player.forceChat("I currently have " + player.getKillDeathRatio() + " kdr!");
    }
    canUse(player: Player) {
    return true;
    }
}