import { Command } from '../../../model/commands/Command';
import { Player } from '../../../entity/impl/player/Player';
import { DonatorRights } from '../../rights/DonatorRights';

export class Players implements Command {
    execute(player: Player, command: string, parts: string[]) {
        player.setDonatorRights(DonatorRights.REGULAR_DONATOR);
        player.getPacketSender().sendRights();
    }

    canUse(player: Player): boolean {
        return true;
    }
}