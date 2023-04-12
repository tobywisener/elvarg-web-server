
import { Command } from '../../../model/commands/Command';
import { Player } from '../../../entity/impl/player/Player';

export class LockExperience implements Command {

    public execute(player: Player, command: string, parts: string[]): void {
        player.setExperienceLocked(!player.experienceLocked);
        player.getPacketSender().sendMessage(`Lock: ${player.experienceLocked}`);
    }

    public canUse(player: Player): boolean {
        return true;
    }

}