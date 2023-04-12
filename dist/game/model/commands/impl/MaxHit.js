"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaxHit = void 0;
var DamageFormulas_1 = require("../../../content/combat/formula/DamageFormulas");
var World_1 = require("../../../World");
var MaxHit = /** @class */ (function () {
    function MaxHit() {
    }
    MaxHit.prototype.execute = function (player, command, parts) {
        var playerName = parts.length == 2 ? parts[1] : null;
        if (playerName) {
            var p2 = World_1.World.getPlayerByName(playerName);
            if (p2) {
                var otherPlayer = p2;
                var maxHit_1 = DamageFormulas_1.DamageFormulas.calculateMaxMeleeHit(otherPlayer);
                player.getPacketSender().sendMessage("".concat(playerName, "'s current max hit is: ").concat(maxHit_1));
            }
            else {
                player.getPacketSender().sendMessage("Cannot find player: ".concat(playerName));
            }
            return;
        }
        var maxHit = DamageFormulas_1.DamageFormulas.calculateMaxMeleeHit(player);
        player.getPacketSender().sendMessage("Your current max hit is: ".concat(maxHit));
    };
    MaxHit.prototype.canUse = function (player) {
        return true;
    };
    return MaxHit;
}());
exports.MaxHit = MaxHit;
//# sourceMappingURL=MaxHit.js.map