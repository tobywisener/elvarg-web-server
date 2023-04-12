"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PlayerRights_1 = require("../../../model/rights/PlayerRights");
var ReloadItems = /** @class */ (function () {
    function ReloadItems() {
    }
    ReloadItems.prototype.execute = function (player, command, parts) {
        try {
            //new ItemDefinitionLoader().load();
            player.getPacketSender().sendMessage("Reloaded item defs");
        }
        catch (e) {
            console.log(e);
            player.getPacketSender().sendMessage("Error reloading item defs");
        }
    };
    ReloadItems.prototype.canUse = function (player) {
        return (player.getRights() == PlayerRights_1.PlayerRights.OWNER || player.getRights() == PlayerRights_1.PlayerRights.DEVELOPER);
    };
    return ReloadItems;
}());
//# sourceMappingURL=ReloadItems.js.map