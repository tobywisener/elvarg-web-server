import { CombatFactory, CanAttackResponse } from "../../../content/combat/CombatFactory";
import { CombatMethod } from "../../../content/combat/method/CombatMethod";
import { NpcDefinition } from "../../../definition/NpcDefinition"
import { Player } from "../player/Player";
import { AreaManager } from "../../../model/areas/AreaManager";
import { PrivateArea } from "../../../model/areas/impl/PrivateArea";
import { Misc } from "../../../../util/Misc";
import { NPC } from "./NPC";

export class NpcAggression {
    public static NPC_TOLERANCE_SECONDS = 600; // 10 mins (Accurate to OSRS)

    public static process(player: Player) {
        // Make sure we can attack the player
        if (CombatFactory.inCombat(player) && !AreaManager.inMulti(player)) {
            return;
        }

        NpcAggression.runAggression(player, player.getLocalNpcs());

        if (player.getArea() instanceof PrivateArea) {
            NpcAggression.runAggression(player, (player.getArea() as PrivateArea).getNpcs());
        }
    }

    private static runAggression(player: Player, npcs: NPC[]) {
        for (let npc of npcs) {
            if (npc == null) {
                continue;
            }

            // Get the NPC's current definition (taking into account possible transformation)
            let npcDefinition: NpcDefinition = npc.getCurrentDefinition();
            if (npcDefinition == null || npc.getHitpoints() <= 0
                || !npcDefinition.isAggressive()
                || npc.getPrivateArea() != player.getPrivateArea()) {
                // Make sure the npc is available to attack the player.
                continue;
            }

            if (npcDefinition.buildsAggressionTolerance() && player.getAggressionTolerance().finished()
                && (player.getArea() == null || !player.getArea().overridesNpcAggressionTolerance(player, npc.getId()))) {
                // If Player has obtained tolerance to this NPC, don't be aggressive.
                return;
            }

            if (CombatFactory.inCombat(npc)) {
                if (AreaManager.inMulti(npc) && player.getLocalPlayers().length > 0) {
                    // Randomly attack different players if they're a team.
                    if (Misc.getRandom(9) <= 2) {
                        // Get a random player from the player's local players list.
                        let randomPlayer = player.getLocalPlayers()[Misc.getRandom(player.getLocalPlayers().length - 1)];

                        // Attack the new player if they're a valid target.
                        if (CombatFactory.validTarget(npc, randomPlayer)) {
                            npc.getCombat().attack(randomPlayer);
                            break;
                        }
                    }
                }

                // Don't process tolerance if NPC is already in combat.
                continue;
            }

            if (!npc.isAggressiveTo(player)) {
                // Ensure the NPC can be aggressive to this player.
                continue;
            }

            // Make sure we have the proper distance to attack the player.
            let distanceToPlayer = npc.getSpawnPosition().getDistance(player.getLocation());

            // Get the npc's combat method
            let method: CombatMethod = CombatFactory.getMethod(npc);

            // Get the max distance this npc can attack from.
            // We should always attack if we're at least 3 tiles from the player.
            let aggressionDistance = npc.aggressionDistance();

            if (distanceToPlayer < npcDefinition.getCombatFollowDistance() && distanceToPlayer <= aggressionDistance) {
                if (CombatFactory.canAttack(npc, method, player) == CanAttackResponse.CAN_ATTACK) {
                    npc.getCombat().attack(player);
                    break;
                }
            }
        }
    }
}