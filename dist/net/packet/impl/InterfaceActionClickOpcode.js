"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterfaceActionClickOpcode = void 0;
var InterfaceActionClickOpcode = /** @class */ (function () {
    function InterfaceActionClickOpcode() {
    }
    // execute(player: Player, packet: Packet) {
    InterfaceActionClickOpcode.prototype.execute = function (player, packet) {
        var interfaceId = packet.readInt();
        var action = packet.readByte();
        if (player == null ||
            player.getHitpoints() <= 0 ||
            player.isTeleportingReturn()) {
            return;
        }
        // if (Bank.handleButton(player, interfaceId, action)) {
        //     return;
        // }
        // if (ClanChatManager.handleButton(player, interfaceId, action)) {
        //     return;
        // }
        // if (Presetables.handleButton(player, interfaceId)) {
        //     return;
        // }
        // if (TeleportHandler.handleButton(player, interfaceId, action)) {
        //     return;
        // }
    };
    return InterfaceActionClickOpcode;
}());
exports.InterfaceActionClickOpcode = InterfaceActionClickOpcode;
//# sourceMappingURL=InterfaceActionClickOpcode.js.map