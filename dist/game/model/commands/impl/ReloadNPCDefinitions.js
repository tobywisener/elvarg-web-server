"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReloadNPCDefinitions = void 0;
var PlayerRights_1 = require("../../../model/rights/PlayerRights");
var ReloadNPCDefinitions = /** @class */ (function () {
    function ReloadNPCDefinitions() {
    }
    ReloadNPCDefinitions.prototype.execute = function (player, command, parts) {
        try {
            // new NpcDefinitionLoader().load();
            player.getPacketSender().sendConsoleMessage("Reloaded npc defs.");
        }
        catch (e) {
            console.log(e);
            player.getPacketSender().sendMessage("Error reloading npc defs.");
        }
    };
    ReloadNPCDefinitions.prototype.canUse = function (player) {
        return (player.getRights() == PlayerRights_1.PlayerRights.OWNER || player.getRights() == PlayerRights_1.PlayerRights.DEVELOPER);
    };
    return ReloadNPCDefinitions;
}());
exports.ReloadNPCDefinitions = ReloadNPCDefinitions;
//# sourceMappingURL=ReloadNPCDefinitions.js.map