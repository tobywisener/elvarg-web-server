"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradeRequestPacketListener = void 0;
var World_1 = require("../../../game/World");
var PlayerStatus_1 = require("../../../game/model/PlayerStatus");
var TradeRequestPacketListener = /** @class */ (function () {
    function TradeRequestPacketListener() {
    }
    TradeRequestPacketListener.prototype.execute = function (player, packet) {
        var index = packet.readLEShort();
        if (index > World_1.World.getPlayers().sizeReturn() || index < 0) {
            return;
        }
        var target = World_1.World.getPlayers()[index];
        if (target == null) {
            return;
        }
        if (!target.getLocation().isWithinDistance(player.getLocation(), 20)) {
            return;
        }
        if (player.getHitpoints() <= 0 || !player.isRegistered() || target.getHitpoints() <= 0 || !target.isRegistered()) {
            return;
        }
        player.getMovementQueue().walkToEntity(target, function () { return TradeRequestPacketListener.sendRequest(player, target); });
    };
    TradeRequestPacketListener.sendRequest = function (player, target) {
        if (player.busy()) {
            player.getPacketSender().sendMessage("You cannot do that right now.");
            return;
        }
        if (target.busy()) {
            var msg = "That player is currently busy.";
            if (target.getStatus() == PlayerStatus_1.PlayerStatus.TRADING) {
                msg = "That player is currently trading with someone else.";
            }
            player.getPacketSender().sendMessage(msg);
            return;
        }
        if (player.getArea() != null) {
            if (!player.getArea().canTrade(player, target)) {
                player.getPacketSender().sendMessage("You cannot trade here.");
                return;
            }
        }
        if (player.getLocalPlayers().indexOf(target) !== -1) {
            player.getTrading().requestTrade(target);
        }
    };
    return TradeRequestPacketListener;
}());
exports.TradeRequestPacketListener = TradeRequestPacketListener;
//# sourceMappingURL=TradeRequestPacketListener.js.map