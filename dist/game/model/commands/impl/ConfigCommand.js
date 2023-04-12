"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigCommand = void 0;
var PlayerRights_1 = require("../../../model/rights/PlayerRights");
var ConfigCommand = /** @class */ (function () {
    function ConfigCommand() {
    }
    ConfigCommand.prototype.execute = function (player, command, parts) {
        player.getPacketSender().sendConfig(parseInt(parts[1]), parseInt(parts[2]));
        player.getPacketSender().sendMessage("Sent config");
    };
    ConfigCommand.prototype.canUse = function (player) {
        var rights = player.getRights();
        return (rights == PlayerRights_1.PlayerRights.OWNER || rights == PlayerRights_1.PlayerRights.DEVELOPER);
    };
    return ConfigCommand;
}());
exports.ConfigCommand = ConfigCommand;
//# sourceMappingURL=ConfigCommand.js.map