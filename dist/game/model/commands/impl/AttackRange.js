"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttackRange = void 0;
var Graphic_1 = require("../../Graphic");
var CombatFactory_1 = require("../../../content/combat/CombatFactory");
var Location_1 = require("../../Location");
var PlayerRights_1 = require("../../rights/PlayerRights");
var AttackRange = exports.AttackRange = /** @class */ (function () {
    function AttackRange() {
    }
    AttackRange.prototype.execute = function (player, command, parts) {
        // Player can type a fixed distance or use their current weapon's distance.
        var distance = parts.length == 2 ? parseInt(parts[1]) : CombatFactory_1.CombatFactory.getMethod(player).attackDistance(player);
        var playerLocation = player.getLocation().clone();
        var startingLocation = player.getLocation().clone().translate(-(distance + 5), -(distance + 5), 0);
        var endingLocation = player.getLocation().clone().translate((distance + 5), (distance + 5), 0);
        var deltas = new Set();
        for (var x = startingLocation.getX(); x <= endingLocation.getX(); x++) {
            for (var y = startingLocation.getY(); y <= endingLocation.getY(); y++) {
                var currentTile = new Location_1.Location(x, y);
                if (currentTile.getDistance(playerLocation) != distance) {
                    continue;
                }
                var delta = Location_1.Location.delta(playerLocation, currentTile);
                // This tile happens to be exactly {distance} squares from the player, add it.
                deltas.add(delta);
                player.getPacketSender().sendGraphic(AttackRange.PURPLE_GLOW, currentTile);
            }
        }
        if (player.getRights() == PlayerRights_1.PlayerRights.DEVELOPER) {
            console.log("Deltas for distance of " + distance + ":");
            console.log(deltas);
        }
    };
    AttackRange.prototype.canUse = function (player) {
        var rights = player.getRights();
        return (rights == PlayerRights_1.PlayerRights.OWNER || rights == PlayerRights_1.PlayerRights.DEVELOPER);
    };
    AttackRange.PURPLE_GLOW = new Graphic_1.Graphic(332, 0);
    return AttackRange;
}());
//# sourceMappingURL=AttackRange.js.map