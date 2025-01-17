import { Command } from "../Command";
import { Player } from "../../../entity/impl/player/Player";

const INAPPROPRIATE_TITLES = ["nigger", "ass", "boobs"];

export class Title implements Command {
    execute(player: Player, command: string, parts: string[]) {
        if (INAPPROPRIATE_TITLES.some(title => parts[1].toLowerCase().includes(title))) {
            player.getPacketSender().sendMessage("You're not allowed to have that in your title.");
            return;
        }
        player.setLoyaltyTitle("@blu@" + parts[1]);
    }

    canUse(player: Player): boolean {
        return true;
    }
}