import { Command } from "../Command";
import { Player } from "../../../entity/impl/player/Player";
import { DamageFormulas } from "../../../content/combat/formula/DamageFormulas";
import { World } from "../../../World";

export class MaxHit implements Command {
    execute(player: Player, command: string, parts: string[]) {
        let playerName = parts.length == 2 ? parts[1] : null;
        if (playerName) {
            let p2 = World.getPlayerByName(playerName);
            if (p2) {
                let otherPlayer = p2;
                let maxHit = DamageFormulas.calculateMaxMeleeHit(otherPlayer);
                player.getPacketSender().sendMessage(`${playerName}'s current max hit is: ${maxHit}`);
            } else {
                player.getPacketSender().sendMessage(`Cannot find player: ${playerName}`);
            }
            return;
        }
        let maxHit = DamageFormulas.calculateMaxMeleeHit(player);
        player.getPacketSender().sendMessage(`Your current max hit is: ${maxHit}`);
    }
    canUse(player: Player) {
        return true;
    }
}