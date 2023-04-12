"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpawnPermanentNPCCommand = void 0;
var PlayerRights_1 = require("../../rights/PlayerRights");
var NPC_1 = require("../../../entity/impl/npc/NPC");
var World_1 = require("../../../World");
var NpcDefinition_1 = require("../../../definition/NpcDefinition");
var NpcSpawnDefinition_1 = require("../../../definition/NpcSpawnDefinition");
var GameConstants_1 = require("../../../GameConstants");
var fs_extra_1 = require("fs-extra");
var Direction_1 = require("../../Direction");
var SpawnPermanentNPCCommand = /** @class */ (function () {
    function SpawnPermanentNPCCommand() {
    }
    SpawnPermanentNPCCommand.prototype.execute = function (player, command, parts) {
        try {
            var npcId = parseInt(parts[1]);
            var radius = parts.length > 2 ? parseInt(parts[1]) : 2;
            var npcDef = NpcDefinition_1.NpcDefinition.forId(npcId);
            var locationName = player.getArea() == null ? "Unknown area" : player.getArea().getName();
            var description = locationName + " " + npcDef.getName();
            this.write(npcId, player.getLocation().clone(), radius, description);
            player.getPacketSender().sendMessage("Permanently spawned " + description);
        }
        catch (e) {
            console.error(e);
        }
        var npc = NPC_1.NPC.create(parseInt(parts[1]), player.getLocation().clone());
        World_1.World.getAddNPCQueue().push(npc);
        if (player.getPrivateArea() != null) {
            player.getPrivateArea().add(npc);
        }
    };
    SpawnPermanentNPCCommand.prototype.canUse = function (player) {
        var rights = player.getRights();
        return (rights == PlayerRights_1.PlayerRights.OWNER || rights == PlayerRights_1.PlayerRights.DEVELOPER);
    };
    SpawnPermanentNPCCommand.prototype.write = function (npcId, npcLocation, npcRadius, description) {
        var gson = require('gson');
        var filePath = GameConstants_1.GameConstants.DEFINITIONS_DIRECTORY + 'npc_spawns.json';
        var reader = fs_extra_1.fs.readFileSync(filePath, 'utf8');
        var definitionArray = gson.fromJson(reader, NpcSpawnDefinition_1.NpcSpawnDefinition);
        if (!definitionArray) {
            return;
        }
        var writer = fs_extra_1.fs.createWriteStream(filePath);
        var list = definitionArray.concat([new NpcSpawnDefinition_1.NpcSpawnDefinition(npcId, npcLocation, Direction_1.Direction.SOUTH, 2, description)]);
        var finalArray = list;
        var builder = gson.newBuilder().setPrettyPrinting().create();
        builder.toJson(finalArray, writer);
        writer.close();
    };
    return SpawnPermanentNPCCommand;
}());
exports.SpawnPermanentNPCCommand = SpawnPermanentNPCCommand;
//# sourceMappingURL=SpawnPermanentNPCCommand.js.map