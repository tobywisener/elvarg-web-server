import { Command } from "../Command";
import { World } from "../../../World";
import { Player } from "../../../entity/impl/player/Player";
import { PlayerRights } from "../../rights/PlayerRights";


export class ListSizesCommand implements Command {
    execute(player: Player, command: string, parts: string[]): void {
    player.getPacketSender().sendMessage(`Players: ${Array.from(World.getPlayers()).length}, NPCs: ${World.getNpcs().sizeReturn()}, Objects: ${World.getObjects().length}, GroundItems: ${World.getItems().length}.`);
    }

    canUse(player: Player): boolean {
        return player.getRights() == PlayerRights.DEVELOPER || player.getRights() == PlayerRights.OWNER;
    }
}