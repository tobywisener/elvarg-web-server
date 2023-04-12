import { PlayerSession } from "../PlayerSession";
import { ChannelFilter } from "./ChannelFilter";
import { ChannelEventHandler } from "./ChannelEventHandler";
import { LoginDecoder } from "../codec/LoginDecoder";
import { LoginEncoder } from "../codec/LoginEncoder";
import * as io from 'socket.io';
import { NetworkConstants } from "../NetworkConstants";

/**

Handles a channel's events.
*/
export class ChannelPipelineHandler {
    /*
    The part of the pipeline that limits connections and checks for any banned hosts.
    */
    private readonly FILTER: ChannelFilter = new ChannelFilter();

    private socketServer = new io(); // Criar um objeto socket.Server


    /**
    
    The part of the pipeline that handles exceptions caught, channels being read, inactive
    channels, and channel-triggered events.
    */
    private readonly HANDLER: ChannelEventHandler = new ChannelEventHandler(this.socketServer);
    public async initChannel(channel: any): Promise<void> {
        const pipeline = channel.pipeline();

        channel.attr(NetworkConstants.SESSION_KEY).setIfAbsent(new PlayerSession(channel));

        pipeline.addLast("channel-filter", this.FILTER);
        pipeline.addLast("decoder", new LoginDecoder());
        pipeline.addLast("encoder", new LoginEncoder());
        pipeline.addLast("timeout", new io.Server({ pingTimeout: NetworkConstants.SESSION_TIMEOUT }));
        pipeline.addLast("channel-handler", this.HANDLER);
    }

}