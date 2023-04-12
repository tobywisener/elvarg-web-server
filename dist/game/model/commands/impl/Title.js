"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Title = void 0;
var INAPPROPRIATE_TITLES = ["nigger", "ass", "boobs"];
var Title = /** @class */ (function () {
    function Title() {
    }
    Title.prototype.execute = function (player, command, parts) {
        if (INAPPROPRIATE_TITLES.some(function (title) { return parts[1].toLowerCase().includes(title); })) {
            player.getPacketSender().sendMessage("You're not allowed to have that in your title.");
            return;
        }
        player.setLoyaltyTitle("@blu@" + parts[1]);
    };
    Title.prototype.canUse = function (player) {
        return true;
    };
    return Title;
}());
exports.Title = Title;
//# sourceMappingURL=Title.js.map