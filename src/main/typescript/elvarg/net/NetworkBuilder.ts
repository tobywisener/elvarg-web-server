import { Server } from "socket.io";
import { createServer } from "http";
import { ChannelPipelineHandler } from "../net/channel/ChannelPipelineHandler";

export class NetworkBuilder {
    private readonly io: Server;
    private readonly channelInitializer = new ChannelPipelineHandler();

    constructor() {
        const httpServer = createServer();
        this.io = new Server(httpServer, {
            /* opções do servidor */
        });
        this.io.on("connection", (socket) => {
            this.channelInitializer.initChannel(socket);
        });
    }

    public initialize(port: number): void {
        const httpServer = createServer();
        httpServer.listen(port, () => {
            console.log(`Servidor iniciado na porta ${port}`);
        });
    }
}
