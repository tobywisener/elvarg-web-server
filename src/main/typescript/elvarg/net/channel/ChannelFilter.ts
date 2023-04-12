import * as io from 'socket.io'
import { ByteBufUtils } from '../ByteBufUtils';
import { NetworkConstants } from '../NetworkConstants';
import { LoginDecoder } from '../codec/LoginDecoder';
import { LoginResponses } from '../login/LoginResponses';
import { Multiset } from 'multiset';

export class ChannelFilter {
    private connections = new Multiset<string>();
    private server: io.Server;

    constructor() {
        const options = {
            cors: {
                origin: "http://localhost:3000",
                methods: ["GET", "POST"]
            }
        };

        const io = require("socket.io")(this.server, options);

        this.server.on('connection', (socket) => {
            this.onConnection(socket);
        });
    }

    private onConnection(socket) {
        let host = ByteBufUtils.getHost(socket.conn.remoteAddress);

        // if this local then, do nothing and proceed to next handler in the pipeline.
        if (host.toLowerCase() === "127.0.0.1") {
            return;
        }

        // add the host
        this.connections.add(host);

        // evaluate the amount of connections from this host.
        if (this.connections.count(host) > NetworkConstants.CONNECTION_LIMIT) {
            LoginDecoder.sendLoginResponse(LoginResponses.LOGIN_CONNECTION_LIMIT);
            return;
        }

        //CHECK BANS

        // Nothing went wrong, so register the channel and forward the event to next handler in the
        // pipeline.
    }

    public start() {
        console.log('Server started');
    }

    public stop() {
        console.log('Server stopped');
    }
}
