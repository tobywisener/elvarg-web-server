"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListSizesCommand = void 0;
var World_1 = require("../../../World");
var PlayerRights_1 = require("../../rights/PlayerRights");
var ListSizesCommand = /** @class */ (function () {
    function ListSizesCommand() {
    }
    ListSizesCommand.prototype.execute = function (player, command, parts) {
        player.getPacketSender().sendMessage("Players: ".concat(Array.from(World_1.World.getPlayers()).length, ", NPCs: ").concat(World_1.World.getNpcs().sizeReturn(), ", Objects: ").concat(World_1.World.getObjects().length, ", GroundItems: ").concat(World_1.World.getItems().length, "."));
    };
    ListSizesCommand.prototype.canUse = function (player) {
        return player.getRights() == PlayerRights_1.PlayerRights.DEVELOPER || player.getRights() == PlayerRights_1.PlayerRights.OWNER;
    };
    return ListSizesCommand;
}());
exports.ListSizesCommand = ListSizesCommand;
//# sourceMappingURL=ListSizesCommand.js.map