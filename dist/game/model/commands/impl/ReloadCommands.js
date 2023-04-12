"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CommandManager_1 = require("../CommandManager");
var PlayerRights_1 = require("../../rights/PlayerRights");
var ReloadCommands = /** @class */ (function () {
    function ReloadCommands() {
    }
    ReloadCommands.prototype.execute = function (player, command, parts) {
        CommandManager_1.CommandManager.loadCommands();
        player.getPacketSender().sendConsoleMessage("Reloaded");
    };
    ReloadCommands.prototype.canUse = function (player) {
        return player.getRights() == PlayerRights_1.PlayerRights.OWNER || player.getRights() == PlayerRights_1.PlayerRights.DEVELOPER;
    };
    return ReloadCommands;
}());
//# sourceMappingURL=ReloadCommands.js.map