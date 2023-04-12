"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PlayerRights_1 = require("../../../model/rights/PlayerRights");
var NpcDropDefinitionLoader_1 = require("../../../definition/loader/impl/NpcDropDefinitionLoader");
var ReloadDrops = /** @class */ (function () {
    function ReloadDrops() {
    }
    ReloadDrops.prototype.execute = function (player, command, parts) {
        try {
            new NpcDropDefinitionLoader_1.NpcDropDefinitionLoader().load();
            player.getPacketSender().sendConsoleMessage("Reloaded drops.");
        }
        catch (e) {
            console.log(e);
            player.getPacketSender().sendMessage("Error reloading npc drops.");
        }
    };
    ReloadDrops.prototype.canUse = function (player) {
        var rights = player.getRights();
        return rights == PlayerRights_1.PlayerRights.OWNER || rights == PlayerRights_1.PlayerRights.DEVELOPER;
    };
    return ReloadDrops;
}());
//# sourceMappingURL=ReloadDrops.js.map