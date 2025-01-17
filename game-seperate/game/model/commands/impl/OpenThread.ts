
import { Command } from '../../../model/commands/Command';
import { Player } from '../../../entity/impl/player/Player';

export class OpenThread implements Command {
    async execute(player: Player, command: string, parts: string[]) {
        if (parts.length !== 2) {
            player.getPacketSender().sendMessage("Please enter a valid command.");
            return;
        }
        let ID = parseInt(parts[1]);
        try {
            let url = new URL("https://www.deadlypkers.net/server_data/fetch_thread_link.php?ID=" + ID);
            let con = await fetch(url.toString());
            let data = await con.text();
            if (data) {
                player.getPacketSender().sendURL(data);
            }
        } catch (error) {
            console.log(error);
        }
    }
    canUse(player: Player) {
        return true;
    }
}
