"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Empty = /** @class */ (function () {
    function Empty() {
    }
    Empty.prototype.execute = function (player, command, parts) {
        player.getSkillManager().stopSkillable();
        player.getInventory().resetItems().refreshItems();
    };
    Empty.prototype.canUse = function (player) {
        return true;
    };
    return Empty;
}());
//# sourceMappingURL=Empty.js.map