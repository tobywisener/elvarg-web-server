"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeleportPacketListener = void 0;
// import { TeleportHandler } from "../../../game/model/teleportation/TeleportHandler";
// import { PlayerRights } from "../../../game/model/rights/PlayerRights";
// import { Teleportable } from "../../../game/model/teleportation/Teleportable";
var TeleportPacketListener = /** @class */ (function () {
    function TeleportPacketListener() {
    }
    // execute(player: Player, packet: Packet) {
    TeleportPacketListener.prototype.execute = function (player, packet) {
        if (player.getHitpoints() <= 0)
            return;
        var type = packet.readByte();
        var index = packet.readByte();
        if (!player.isTeleportInterfaceOpen()) {
            player.getPacketSender().sendInterfaceRemoval();
            return;
        }
        // if (player.getRights() == PlayerRights.DEVELOPER) {
        //     player.getPacketSender().sendMessage(
        //         `Selected a teleport. Type: ${type}, index: ${index}.`);
        // }
        // for (let teleport of Object.values(Teleportable)) {
        //     if (teleport.getType() == type && teleport.getIndex() == index) {
        //       let teleportPosition = teleport.getPosition();
        //       if (TeleportHandler.checkReqs(player, teleportPosition)) {
        //         player.getPreviousTeleports().set(teleport.getTeleportButton(), teleportPosition);
        //         TeleportHandler.teleport(player, teleportPosition, player.getSpellbook().getTeleportType(), true);
        //       }
        //       break;
        //     }
        //   }
    };
    return TeleportPacketListener;
}());
exports.TeleportPacketListener = TeleportPacketListener;
//# sourceMappingURL=TeleportPacketListener.js.map