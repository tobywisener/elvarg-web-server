"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelEventHandler = void 0;
var World_1 = require("../../game/World");
var ChannelEventHandler = /** @class */ (function () {
    function ChannelEventHandler(sckt) {
        this.io = sckt;
    }
    ChannelEventHandler.prototype.channelInactive = function (playerId) {
        var player = World_1.World.getPlayerById(playerId);
        if (!player || !player.isRegistered() || World_1.World.getRemovePlayerQueue().includes(player)) {
            return;
        }
        // Close all open interfaces..
        if (player.busy()) {
            player.getPacketSender().sendInterfaceRemoval();
        }
        // After 60 seconds, force a logout.
        player.getForcedLogoutTimer().start(60);
        // Add player to logout queue.
        World_1.World.getRemovePlayerQueue().push(player);
        // Enviar uma mensagem para o cliente usando o socket.io
        var client = this.io.sockets.sockets.get(player.id.toString());
        if (client) {
            client.emit('canalInativo', { player: player.name });
        }
    };
    ChannelEventHandler.prototype.exceptionCaught = function (playerId, t) {
        if (!(t instanceof Error)) {
            console.log(t);
        }
        var player = World_1.World.getPlayerById(playerId);
        if (player) {
            // Enviar uma mensagem para o cliente usando o socket.io
            var client = this.io.sockets.sockets.get(player.id.toString());
            if (client) {
                client.emit('excecaoCapturada', { message: t.message });
            }
        }
    };
    return ChannelEventHandler;
}());
exports.ChannelEventHandler = ChannelEventHandler;
//# sourceMappingURL=ChannelEventHandler.js.map