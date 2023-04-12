"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecCommand = void 0;
var PlayerRights_1 = require("../../../model/rights/PlayerRights");
var CombatSpecial_1 = require("../../../content/combat/CombatSpecial");
var SpecCommand = /** @class */ (function () {
    function SpecCommand() {
    }
    SpecCommand.prototype.execute = function (player, command, parts) {
        var amt = 100;
        if (parts.length > 1)
            amt = parseInt(parts[1]);
        player.setSpecialPercentage(amt);
        CombatSpecial_1.CombatSpecial.updateBar(player);
    };
    SpecCommand.prototype.canUse = function (player) {
        var rights = player.getRights();
        return (rights == PlayerRights_1.PlayerRights.OWNER || rights == PlayerRights_1.PlayerRights.DEVELOPER);
    };
    return SpecCommand;
}());
exports.SpecCommand = SpecCommand;
//# sourceMappingURL=SpecCommand.js.map