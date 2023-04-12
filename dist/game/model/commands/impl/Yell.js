"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Yell = void 0;
var World_1 = require("../../../World");
var PlayerPunishment_1 = require("../../../../util/PlayerPunishment");
var Misc_1 = require("../../../../util/Misc");
var Yell = /** @class */ (function () {
    function Yell() {
    }
    Yell.getYellPrefix = function (player) {
        if (player.getRights().getYellTag() !== "") {
            return player.getRights().getYellTag();
        }
        return this.getYellDelay(player);
    };
    Yell.getYellDelay = function (player) {
        if (player.isStaff()) {
            return 0;
        }
        return this.getYellDelay(player);
    };
    Yell.prototype.execute = function (player, command, parts) {
        if (PlayerPunishment_1.PlayerPunishment.muted(player.getUsername()) || PlayerPunishment_1.PlayerPunishment.IPMuted(player.getHostAddress())) {
            player.getPacketSender().sendMessage("You are muted and cannot yell.");
            return;
        }
        if (!player.getYellDelay().finished()) {
            player.getPacketSender().sendMessage("You must wait another ".concat(player.getYellDelay().secondsRemaining(), " seconds to do that."));
            return;
        }
        var yellMessage = command.substring(4, command.length);
        if (Misc_1.Misc.blockedWord(yellMessage)) {
            return;
        }
        var spriteId = player.getRights().getSpriteId();
        var sprite = (spriteId == -1 ? "" : "<img=".concat(spriteId, ">"));
        var yell = ("".concat(Yell.getYellPrefix(player), " ").concat(sprite, " ").concat(player.getUsername(), ": ").concat(yellMessage));
        World_1.World.getPlayers().forEach(function (e) { return e.getPacketSender().sendSpecialMessage(player.getUsername(), 21, yell); });
        var yellDelay = Yell.getYellDelay(player);
        if (yellDelay > 0) {
            player.getYellDelay().start(yellDelay);
        }
    };
    Yell.prototype.canUse = function (player) {
        if (player.isStaff() || player.isDonator()) {
            return true;
        }
        return false;
    };
    return Yell;
}());
exports.Yell = Yell;
//# sourceMappingURL=Yell.js.map