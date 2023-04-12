"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var World_1 = require("../../../World");
var PlayerRights_1 = require("../../rights/PlayerRights");
var NpcSpawnDefinitionLoader_1 = require("../../../definition/loader/impl/NpcSpawnDefinitionLoader");
var ReloadNPCSpawns = /** @class */ (function () {
    function ReloadNPCSpawns() {
    }
    ReloadNPCSpawns.prototype.execute = function (player, command, parts) {
        try {
            World_1.World.getNpcs().clear();
            new NpcSpawnDefinitionLoader_1.NpcSpawnDefinitionLoader().load();
            player.getPacketSender().sendConsoleMessage("Reloaded npc spawns.");
        }
        catch (e) {
            console.error(e);
            player.getPacketSender().sendMessage("Error reloading npc spawns.");
        }
    };
    ReloadNPCSpawns.prototype.canUse = function (player) {
        return player.getRights() === PlayerRights_1.PlayerRights.OWNER || player.getRights() === PlayerRights_1.PlayerRights.DEVELOPER;
    };
    return ReloadNPCSpawns;
}());
//# sourceMappingURL=ReloadNPCSpawns.js.map