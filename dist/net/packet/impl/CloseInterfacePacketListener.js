"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloseInterfacePacketListener = void 0;
var CloseInterfacePacketListener = /** @class */ (function () {
    function CloseInterfacePacketListener() {
    }
    CloseInterfacePacketListener.prototype.execute = function (player, packet) {
        player.getPacketSender().sendInterfaceRemoval();
    };
    return CloseInterfacePacketListener;
}());
exports.CloseInterfacePacketListener = CloseInterfacePacketListener;
//# sourceMappingURL=CloseInterfacePacketListener.js.map