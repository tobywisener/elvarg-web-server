"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpawnNPCCommand = void 0;
var PlayerRights_1 = require("../../rights/PlayerRights");
var World_1 = require("../../../World");
var NPC_1 = require("../../../entity/impl/npc/NPC");
var SpawnNPCCommand = /** @class */ (function () {
    function SpawnNPCCommand() {
    }
    SpawnNPCCommand.prototype.execute = function (player, command, parts) {
        var npc = NPC_1.NPC.create(parseInt(parts[1]), player.getLocation().clone());
        World_1.World.getAddNPCQueue().push(npc);
        if (player.getPrivateArea() != null) {
            player.getPrivateArea().add(npc);
        }
    };
    SpawnNPCCommand.prototype.canUse = function (player) {
        var rights = player.getRights();
        return (rights == PlayerRights_1.PlayerRights.OWNER || rights == PlayerRights_1.PlayerRights.DEVELOPER);
    };
    return SpawnNPCCommand;
}());
exports.SpawnNPCCommand = SpawnNPCCommand;
//# sourceMappingURL=SpawnNPCCommand.js.map