"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimationCommand = void 0;
var Animation_1 = require("../../Animation");
var PlayerRights_1 = require("../../../model/rights/PlayerRights");
var AnimationCommand = /** @class */ (function () {
    function AnimationCommand() {
    }
    AnimationCommand.prototype.execute = function (player, command, parts) {
        var anim = parseInt(parts[1]);
        player.performAnimation(new Animation_1.Animation(anim));
    };
    AnimationCommand.prototype.canUse = function (player) {
        var rights = player.getRights();
        return (rights == PlayerRights_1.PlayerRights.OWNER || rights == PlayerRights_1.PlayerRights.DEVELOPER);
    };
    return AnimationCommand;
}());
exports.AnimationCommand = AnimationCommand;
//# sourceMappingURL=AnimationCommand.js.map