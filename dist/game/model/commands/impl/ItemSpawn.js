"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PlayerRights_1 = require("../../../model/rights/PlayerRights");
var Item_1 = require("../../Item");
var ItemSpawn = /** @class */ (function () {
    function ItemSpawn() {
    }
    ItemSpawn.prototype.execute = function (player, command, parts) {
        var amount = 1;
        if (parts.length > 2) {
            amount = parseInt(parts[2]);
        }
        player.getInventory().addItem(new Item_1.Item(parseInt(parts[1]), amount));
    };
    ItemSpawn.prototype.canUse = function (player) {
        var rights = player.getRights();
        return (rights == PlayerRights_1.PlayerRights.OWNER || rights == PlayerRights_1.PlayerRights.DEVELOPER);
    };
    return ItemSpawn;
}());
//# sourceMappingURL=ItemSpawn.js.map