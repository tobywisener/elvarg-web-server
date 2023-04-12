import { PlayerSession } from "./PlayerSession";
import { Player } from "../game/entity/impl/player/Player";
import { LoginDetailsMessage } from "./login/LoginDetailsMessage";
import { Packet } from "./packet/Packet";
import { PacketBuilder } from "./packet/PacketBuilder";

export class PlayerBotSession extends PlayerSession {
    public player: Player;

    constructor() {
        super({
            parent: null,
            config: null,
            localAddress: null,
            remoteAddress: null,
            isInputShutdown: false,
            shutdownInput: () => null,
            shutdownInputPromise: () => null,
            isOutputShutdown: false,
            shutdownOutput: () => null,
            shutdownOutputPromise: () => null,
            isShutdown: false,
            shutdown: () => null,
            shutdownPromise: () => null,
            id: null,
            eventLoop: null,
            isOpen: false,
            isRegistered: false,
            isActive: false,
            metadata: null,
            closeFuture: () => null,
            isWritable: false,
            bytesBeforeUnwritable: 0,
            bytesBeforeWritable: 0,
            unsafe: null,
            pipeline: null,
            alloc: null,
            read: () => null,
            flush: () => null,
            bind: () => null,
            connect: () => null,
            connectTwo: () => null,
            disconnect: () => null,
            closeChannel: () => null,
            deregister: () => null,
            bindPromise: () => null,
            connectPromise: () => null,
            connectTwoPromise: () => null,
            disconnectPromise: () => null,
            closePromise: () => null,
            deregisterPromise: () => null,
            write: () => null,
            writePromise: () => null,
            writeAndFlushPromise: () => null,
            writeAndFlush: () => null,
            newPromise: () => null,
            newProgressivePromise: () => null,
            newSucceededFuture: () => null,
            newFailedFuture: () => null,
            voidPromise: () => null,
            attr: () => null,
            hasAttr: () => false,
            compareTo: () => 0,
        });
    }

    public async finalizeLogin(msg: LoginDetailsMessage): Promise<void> {
        await super.finalizeLogin(msg);
      }

    /**
    
    Queues a recently decoded packet received from the channel.
    @param msg The packet that should be queued.
    */
    public queuePacket(msg: Packet): void {
    }
    /**
    
    Processes all of the queued messages from the {@link PacketDecoder} by
    polling the internal queue, and then handling them via the
    handleInputMessage. This method is called EACH GAME CYCLE.
    */
    public processPackets(): void {
    }

    /**
    
    Queues the {@code msg} for this session to be encoded and sent to the client.
    @param builder the packet to queue.
    */
    public write(builder: PacketBuilder): void {
    }
    /**
    
    Flushes this channel.
    */
    public flush(): void {
    }
    /**
    
    Gets the player I/O operations will be executed for.
    @return the player I/O operations.
    */
    public getPlayer(): Player {
        return this.player;
    }
    public setPlayer(player: Player): void {
        this.player = player;
    }

    public getChannel() {
        return null;
    }
}