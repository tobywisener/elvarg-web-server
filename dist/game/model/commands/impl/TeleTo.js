"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PlayerRights_1 = require("../../rights/PlayerRights");
var Location_1 = require("../../Location");
var TeleTo = /** @class */ (function () {
    function TeleTo() {
    }
    TeleTo.prototype.execute = function (player, command, parts) {
        var x = parseInt(parts[1]);
        var y = parseInt(parts[2]);
        var z = 0;
        if (parts.length == 4) {
            z = parseInt(parts[3]);
        }
        player.moveTo(new Location_1.Location(x, y));
    };
    TeleTo.prototype.canUse = function (player) {
        var rights = player.getRights();
        return (rights == PlayerRights_1.PlayerRights.OWNER || rights == PlayerRights_1.PlayerRights.DEVELOPER);
    };
    return TeleTo;
}());
//# sourceMappingURL=TeleTo.js.map