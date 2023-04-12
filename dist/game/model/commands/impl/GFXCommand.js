"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GFXCommand = void 0;
var PlayerRights_1 = require("../../../model/rights/PlayerRights");
var Graphic_1 = require("../../Graphic");
var GFXCommand = /** @class */ (function () {
    function GFXCommand() {
    }
    GFXCommand.prototype.execute = function (player, command, parts) {
        var gfx = parseInt(parts[1]);
        player.performGraphic(new Graphic_1.Graphic(gfx, 0));
    };
    GFXCommand.prototype.canUse = function (player) {
        return player.getRights() == PlayerRights_1.PlayerRights.OWNER || player.getRights() == PlayerRights_1.PlayerRights.DEVELOPER;
    };
    return GFXCommand;
}());
exports.GFXCommand = GFXCommand;
//# sourceMappingURL=GFXCommand.js.map