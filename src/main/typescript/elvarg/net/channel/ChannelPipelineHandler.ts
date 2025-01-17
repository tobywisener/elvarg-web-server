// import { PlayerSession } from "../PlayerSession";
// import { ChannelFilter } from "./ChannelFilter";
// import { ChannelEventHandler } from "./ChannelEventHandler";
// import { LoginDecoder } from "../codec/LoginDecoder";
// import { LoginEncoder } from "../codec/LoginEncoder";
// import { NetworkConstants } from "../NetworkConstants";

// const server = require("http").createServer();
// const io = require("socket.io")(server);

// /**

// Handles a channel's events.
// */
// export class ChannelPipelineHandler {
//   /*
//     The part of the pipeline that limits connections and checks for any banned hosts.
//     */
//   private readonly FILTER: ChannelFilter = new ChannelFilter();

//   private socketServer = new io(); // Criar um objeto socket.Server

//   /**

//     The part of the pipeline that handles exceptions caught, channels being read, inactive
//     channels, and channel-triggered events.
//     */
//   private readonly HANDLER: ChannelEventHandler = new ChannelEventHandler(
//     this.socketServer
//   );
//   public async initChannel(channel: any): Promise<void> {
//     const pipeline = channel.pipeline();

//     channel
//       .attr(NetworkConstants.SESSION_KEY)
//       .setIfAbsent(new PlayerSession(channel));

//     pipeline.addLast("channel-filter", this.FILTER);
//     pipeline.addLast("decoder", new LoginDecoder());
//     pipeline.addLast("encoder", new LoginEncoder());
//     pipeline.addLast(
//       "timeout",
//       new io.Server({ pingTimeout: NetworkConstants.SESSION_TIMEOUT })
//     );
//     pipeline.addLast("channel-handler", this.HANDLER);
//   }
// }
import { Server } from "socket.io";
import { PlayerSession } from "../PlayerSession";
import { ChannelFilter } from "./ChannelFilter";
import { ChannelEventHandler } from "./ChannelEventHandler";
import { LoginDecoder } from "../codec/LoginDecoder";
import { LoginEncoder } from "../codec/LoginEncoder";
import { NetworkConstants } from "../NetworkConstants";
const http = require("http"); // Use proper import for the HTTP server

// Create an HTTP server
const server = http.createServer();

// Create a Socket.IO server instance
const ioServer = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

/**
 * Handles a channel's events.
 */
export class ChannelPipelineHandler {
  /**
   * The part of the pipeline that limits connections and checks for any banned hosts.
   */
  private readonly FILTER: ChannelFilter = new ChannelFilter();

  // Pass the Socket.IO server to the handler
  private readonly HANDLER: ChannelEventHandler = new ChannelEventHandler(
    ioServer
  );

  /**
   * Initialize the channel pipeline.
   */
  public async initChannel(channel: any): Promise<void> {
    const pipeline = channel.pipeline();

    // Ensure the session key is set for the channel
    channel
      .attr(NetworkConstants.SESSION_KEY)
      .setIfAbsent(new PlayerSession(channel));

    // Add handlers to the pipeline
    pipeline.addLast("channel-filter", this.FILTER);
    pipeline.addLast("decoder", new LoginDecoder());
    pipeline.addLast("encoder", new LoginEncoder());
    pipeline.addLast(
      "timeout",
      ioServer // Use the initialized Socket.IO server
    );
    pipeline.addLast("channel-handler", this.HANDLER);
  }
}

// // Start the server
// server.listen(3000, () => {
//   console.log("Server is running on http://localhost:3000");
// });
