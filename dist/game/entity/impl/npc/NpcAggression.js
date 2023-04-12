"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NpcAggression = void 0;
var CombatFactory_1 = require("../../../content/combat/CombatFactory");
var AreaManager_1 = require("../../../model/areas/AreaManager");
var PrivateArea_1 = require("../../../model/areas/impl/PrivateArea");
var Misc_1 = require("../../../../util/Misc");
var NpcAggression = exports.NpcAggression = /** @class */ (function () {
    function NpcAggression() {
    }
    NpcAggression.process = function (player) {
        // Make sure we can attack the player
        if (CombatFactory_1.CombatFactory.inCombat(player) && !AreaManager_1.AreaManager.inMulti(player)) {
            return;
        }
        NpcAggression.runAggression(player, player.getLocalNpcs());
        if (player.getArea() instanceof PrivateArea_1.PrivateArea) {
            NpcAggression.runAggression(player, player.getArea().getNpcs());
        }
    };
    NpcAggression.runAggression = function (player, npcs) {
        var e_1, _a;
        try {
            for (var npcs_1 = __values(npcs), npcs_1_1 = npcs_1.next(); !npcs_1_1.done; npcs_1_1 = npcs_1.next()) {
                var npc = npcs_1_1.value;
                if (npc == null) {
                    continue;
                }
                // Get the NPC's current definition (taking into account possible transformation)
                var npcDefinition = npc.getCurrentDefinition();
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
                if (CombatFactory_1.CombatFactory.inCombat(npc)) {
                    if (AreaManager_1.AreaManager.inMulti(npc) && player.getLocalPlayers().length > 0) {
                        // Randomly attack different players if they're a team.
                        if (Misc_1.Misc.getRandom(9) <= 2) {
                            // Get a random player from the player's local players list.
                            var randomPlayer = player.getLocalPlayers()[Misc_1.Misc.getRandom(player.getLocalPlayers().length - 1)];
                            // Attack the new player if they're a valid target.
                            if (CombatFactory_1.CombatFactory.validTarget(npc, randomPlayer)) {
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
                var distanceToPlayer = npc.getSpawnPosition().getDistance(player.getLocation());
                // Get the npc's combat method
                var method = CombatFactory_1.CombatFactory.getMethod(npc);
                // Get the max distance this npc can attack from.
                // We should always attack if we're at least 3 tiles from the player.
                var aggressionDistance = npc.aggressionDistance();
                if (distanceToPlayer < npcDefinition.getCombatFollowDistance() && distanceToPlayer <= aggressionDistance) {
                    if (CombatFactory_1.CombatFactory.canAttack(npc, method, player) == CombatFactory_1.CanAttackResponse.CAN_ATTACK) {
                        npc.getCombat().attack(player);
                        break;
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (npcs_1_1 && !npcs_1_1.done && (_a = npcs_1.return)) _a.call(npcs_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    NpcAggression.NPC_TOLERANCE_SECONDS = 600; // 10 mins (Accurate to OSRS)
    return NpcAggression;
}());
//# sourceMappingURL=NpcAggression.js.map