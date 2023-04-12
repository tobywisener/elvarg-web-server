"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FloodCommand = void 0;
var PlayerRights_1 = require("../../../model/rights/PlayerRights");
var Server_1 = require("../../../../Server");
var FloodCommand = /** @class */ (function () {
    function FloodCommand() {
    }
    FloodCommand.prototype.execute = function (player, command, parts) {
        var amt = parseInt(parts[1]);
        Server_1.Server.getFlooder().login(amt);
    };
    FloodCommand.prototype.canUse = function (player) {
        var rights = player.getRights();
        return (rights == PlayerRights_1.PlayerRights.OWNER || rights == PlayerRights_1.PlayerRights.DEVELOPER);
    };
    return FloodCommand;
}());
exports.FloodCommand = FloodCommand;
//# sourceMappingURL=FloodCommand.js.map