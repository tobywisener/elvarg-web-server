import { Command } from "../Command";
import { Player } from "../../../entity/impl/player/Player";
import { Graphic } from "../../Graphic";
import { CombatFactory } from "../../../content/combat/CombatFactory";
import { Location } from "../../Location";
import { PlayerRights } from "../../rights/PlayerRights";

export class AttackRange implements Command {
    public static readonly PURPLE_GLOW = new Graphic(332,0);

    execute(player: Player, command: string, parts: string[]): void {
        // Player can type a fixed distance or use their current weapon's distance.
        let distance = parts.length == 2 ? parseInt(parts[1]) : CombatFactory.getMethod(player).attackDistance(player);

        let playerLocation = player.getLocation().clone();

        let startingLocation = player.getLocation().clone().translate(-(distance + 5), -(distance + 5),0);

        let endingLocation = player.getLocation().clone().translate((distance + 5), (distance + 5),0);

        let deltas = new Set<Location>();

        for (let x = startingLocation.getX(); x <= endingLocation.getX(); x++) {
            for (let y = startingLocation.getY(); y <= endingLocation.getY(); y++) {
                let currentTile: Location = new Location(x, y);
                if (currentTile.getDistance(playerLocation) != distance) {
                    continue;
                }

                let delta = Location.delta(playerLocation, currentTile);

                // This tile happens to be exactly {distance} squares from the player, add it.
                deltas.add(delta);
                player.getPacketSender().sendGraphic(AttackRange.PURPLE_GLOW, currentTile);
            }
        }

        if (player.getRights() == PlayerRights.DEVELOPER) {
            console.log("Deltas for distance of " + distance + ":");
            console.log(deltas);
        }

    }

    canUse(player: Player): boolean {
        let rights = player.getRights();
        return (rights == PlayerRights.OWNER || rights == PlayerRights.DEVELOPER);
    }
}