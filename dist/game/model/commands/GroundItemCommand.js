"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroundItemCommand = void 0;
var PlayerRights_1 = require("../rights/PlayerRights");
var ItemOnGroundManager_1 = require("../../entity/impl/grounditem/ItemOnGroundManager");
var Item_1 = require("../Item");
var GroundItemCommand = /** @class */ (function () {
    function GroundItemCommand() {
    }
    GroundItemCommand.prototype.execute = function (player, command, parts) {
        ItemOnGroundManager_1.ItemOnGroundManager.registers(player, new Item_1.Item(995, 10000));
        player.getPacketSender().sendMessage("Spawned ground item..");
    };
    GroundItemCommand.prototype.canUse = function (player) {
        return player.getRights() === PlayerRights_1.PlayerRights.OWNER;
    };
    return GroundItemCommand;
}());
exports.GroundItemCommand = GroundItemCommand;
//# sourceMappingURL=GroundItemCommand.js.map