"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradeRequestPacketListener = void 0;
// import { World } from "../../../game/World";
// import { PlayerStatus } from "../../../game/model/PlayerStatus";
var TradeRequestPacketListener = /** @class */ (function () {
    function TradeRequestPacketListener() {
    }
    // execute(player: Player, packet: Packet) {
    TradeRequestPacketListener.prototype.execute = function (player, packet) {
        var index = packet.readLEShort();
        // if (index > World.getPlayers().sizeReturn() || index < 0) {
        //     return;
        // }
        // let target = World.getPlayers()[index];
        // if (target == null) {
        //     return;
        // }
        // if (!target.getLocation().isWithinDistance(player.getLocation(), 20)) {
        //     return;
        // }
        // if (player.getHitpoints() <= 0 || !player.isRegistered() || target.getHitpoints() <= 0 || !target.isRegistered()) {
        //     return;
        // }
        // player.getMovementQueue().walkToEntity(target, () => TradeRequestPacketListener.sendRequest(player, target));
    };
    // static sendRequest(player: Player, target: Player) {
    TradeRequestPacketListener.sendRequest = function (player, target) {
        if (player.busy()) {
            player.getPacketSender().sendMessage("You cannot do that right now.");
            return;
        }
        if (target.busy()) {
            var msg = "That player is currently busy.";
            // if (target.getStatus() == PlayerStatus.TRADING) {
            //     msg = "That player is currently trading with someone else.";
            // }
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