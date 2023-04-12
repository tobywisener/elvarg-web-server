import { World } from '../../game/World';
import { NetworkConstants } from '../NetworkConstants';
import * as socket from 'socket.io';
import { PlayerSession } from '../PlayerSession';

export class ChannelEventHandler {
    private io: socket.Server;

    constructor(sckt: socket.Server) {
        this.io = sckt;
    }

    public channelInactive(playerId: number) {

        const player = World.getPlayerById(playerId);

        if (!player || !player.isRegistered() || World.getRemovePlayerQueue().includes(player)) {
            return;
        }

        // Close all open interfaces..
        if (player.busy()) {
            player.getPacketSender().sendInterfaceRemoval();
        }

        // After 60 seconds, force a logout.
        player.getForcedLogoutTimer().start(60);

        // Add player to logout queue.
        World.getRemovePlayerQueue().push(player);

        // Enviar uma mensagem para o cliente usando o socket.io
        const client = this.io.sockets.sockets.get(player.id.toString());
        if (client) {
            client.emit('canalInativo', { player: player.name });
        }
    }

    public exceptionCaught(playerId: number, t: Error) {
        if (!(t instanceof Error)) {
            console.log(t);
        }

        const player = World.getPlayerById(playerId);
        if (player) {
            // Enviar uma mensagem para o cliente usando o socket.io
            const client = this.io.sockets.sockets.get(player.id.toString());
            if (client) {
                client.emit('excecaoCapturada', { message: t.message });
            }
        }
    }
}
