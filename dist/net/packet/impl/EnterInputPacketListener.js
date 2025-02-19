"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnterInputPacketListener = void 0;
// import { Player } from "../../../game/entity/impl/player/Player";
var ByteBufUtils_1 = require("../../../net/ByteBufUtils");
var PacketConstants_1 = require("../../../net/packet/PacketConstants");
var EnterInputPacketListener = /** @class */ (function () {
    function EnterInputPacketListener() {
    }
    // execute(player: Player, packet: Packet) {
    EnterInputPacketListener.prototype.execute = function (player, packet) {
        if (player == null || player.getHitpoints() <= 0) {
            return;
        }
        switch (packet.getOpcode()) {
            case PacketConstants_1.PacketConstants.ENTER_SYNTAX_OPCODE:
                var name_1 = ByteBufUtils_1.ByteBufUtils.readString(packet.getBuffer());
                if (name_1 == null)
                    return;
                if (player.getEnteredSyntaxAction() != null) {
                    player.getEnteredSyntaxAction().execute(name_1);
                    player.setEnteredSyntaxAction(null);
                }
                break;
            case PacketConstants_1.PacketConstants.ENTER_AMOUNT_OPCODE:
                var amount = packet.readInt();
                if (amount <= 0)
                    return;
                if (player.getEnteredAmountAction() != null) {
                    player.getEnteredAmountAction().execute(amount);
                    player.setEnteredAmountAction(null);
                }
                break;
        }
    };
    return EnterInputPacketListener;
}());
exports.EnterInputPacketListener = EnterInputPacketListener;
//# sourceMappingURL=EnterInputPacketListener.js.map