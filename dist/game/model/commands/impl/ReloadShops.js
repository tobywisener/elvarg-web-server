"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PlayerRights_1 = require("../../../model/rights/PlayerRights");
var ShopDefinitionLoader_1 = require("../../../definition/loader/impl/ShopDefinitionLoader");
var ReloadShops = /** @class */ (function () {
    function ReloadShops() {
    }
    ReloadShops.prototype.execute = function (player, command, parts) {
        try {
            new ShopDefinitionLoader_1.ShopDefinitionLoader().load();
            player.getPacketSender().sendConsoleMessage("Reloaded shops.");
        }
        catch (error) {
            console.log(error);
            player.getPacketSender().sendMessage("Error reloading shops.");
        }
    };
    ReloadShops.prototype.canUse = function (player) {
        return (player.rights === PlayerRights_1.PlayerRights.OWNER || player.rights === PlayerRights_1.PlayerRights.DEVELOPER);
    };
    return ReloadShops;
}());
//# sourceMappingURL=ReloadShops.js.map