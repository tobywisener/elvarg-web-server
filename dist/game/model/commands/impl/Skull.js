"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skull = void 0;
var CombatFactory_1 = require("../../../content/combat/CombatFactory");
var SkullType_1 = require("../../SkullType");
var Skull = /** @class */ (function () {
    function Skull() {
    }
    Skull.prototype.execute = function (player, command, parts) {
        if (CombatFactory_1.CombatFactory.inCombat(player)) {
            player.getPacketSender().sendMessage("You cannot change that during combat!");
            return;
        }
        if (parts[0].includes("red")) {
            CombatFactory_1.CombatFactory.skull(player, SkullType_1.SkullType.RED_SKULL, (60 * 30)); // Should be 30 mins
        }
        else {
            CombatFactory_1.CombatFactory.skull(player, SkullType_1.SkullType.WHITE_SKULL, 300); // Should be 5 mins
        }
    };
    Skull.prototype.canUse = function (player) {
        return true;
    };
    return Skull;
}());
exports.Skull = Skull;
//# sourceMappingURL=Skull.js.map