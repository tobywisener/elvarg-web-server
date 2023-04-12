"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Runes = void 0;
var PlayerRights_1 = require("../../../model/rights/PlayerRights");
var Runes = /** @class */ (function () {
    function Runes() {
    }
    Runes.prototype.execute = function (player, command, parts) {
        var runes = [554, 555, 556, 557, 558, 559, 560, 561, 562, 563, 564, 565];
        runes.forEach(function (rune) {
            player.getInventory().adds(rune, 1000);
        });
    };
    Runes.prototype.canUse = function (player) {
        return (player.getRights() === PlayerRights_1.PlayerRights.OWNER || player.getRights() === PlayerRights_1.PlayerRights.DEVELOPER);
    };
    return Runes;
}());
exports.Runes = Runes;
//# sourceMappingURL=Runes.js.map