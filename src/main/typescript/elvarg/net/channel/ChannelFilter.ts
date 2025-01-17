// import * as io from "socket.io";
// import { ByteBufUtils } from "../ByteBufUtils";
// import { NetworkConstants } from "../NetworkConstants";
// import { LoginDecoder } from "../codec/LoginDecoder";
// import { LoginResponses } from "../login/LoginResponses";
// const Multiset = require("multiset");

// export class ChannelFilter {
//   private connections = new Multiset();
//   private server: io.Server;

//   constructor() {
//     const options = {
//       cors: {
//         origin: "http://localhost:3000",
//         methods: ["GET", "POST"],
//       },
//     };

//     this.server = new io.Server(options);

//     this.server.on("connection", (socket) => {
//       this.onConnection(socket);
//     });
//   }

//   private onConnection(socket) {
//     let host = ByteBufUtils.getHost(socket.conn.remoteAddress);

//     // if this local then, do nothing and proceed to next handler in the pipeline.
//     if (host.toLowerCase() === "127.0.0.1") {
//       return;
//     }

//     // add the host
//     this.connections.add(host);

//     // evaluate the amount of connections from this host.
//     if (this.connections.count(host) > NetworkConstants.CONNECTION_LIMIT) {
//       LoginDecoder.sendLoginResponse(LoginResponses.LOGIN_CONNECTION_LIMIT);
//       return;
//     }

//     //CHECK BANS

//     // Nothing went wrong, so register the channel and forward the event to next handler in the
//     // pipeline.
//   }

//   public start() {
//     console.log("Server started");
//     this.server.listen(3000);
//   }

//   public stop() {
//     console.log("Server stopped");
//     this.server.close();
//   }
// }

import { Server } from "socket.io";
import { ByteBufUtils } from "../ByteBufUtils";
import { NetworkConstants } from "../NetworkConstants";
import { LoginDecoder } from "../codec/LoginDecoder";
import { LoginResponses } from "../login/LoginResponses";
const Multiset = require("multiset");

export class ChannelFilter {
  private connections = new Multiset();
  private server: Server;

  constructor() {
    const options = {
      cors: {
        origin: "http://localhost:3000", // Allow requests from the frontend
        methods: ["GET", "POST"], // Specify allowed methods
      },
    };

    this.server = new Server(3000, options); // Initialize the server with the port and options

    // Listen for connection events
    this.server.on("connection", (socket) => {
      this.onConnection(socket);
    });
  }

  private onConnection(socket) {
    const host = ByteBufUtils.getHost(socket.handshake.address); // Get the client IP address

    // Allow local connections without restrictions
    if (host.toLowerCase() === "127.0.0.1" || host.toLowerCase() === "::1") {
      console.log("Local connection allowed:", host);
      return;
    }

    // Add the host to the connections Multiset
    this.connections.add(host);

    // Check the number of connections from this host
    if (this.connections.count(host) > NetworkConstants.CONNECTION_LIMIT) {
      console.log(`Connection limit exceeded for ${host}`);
      LoginDecoder.sendLoginResponse(LoginResponses.LOGIN_CONNECTION_LIMIT);
      return;
    }

    console.log(`New connection from ${host}`);
    // Additional checks (e.g., bans) can be added here

    // Successfully registered the channel
    socket.on("disconnect", () => {
      this.connections.remove(host);
      console.log(`Connection removed for ${host}`);
    });
  }

  public start() {
    console.log("Socket.io server started on port 3000");
  }

  public stop() {
    console.log("Stopping the server...");
    this.server.close(() => {
      console.log("Server stopped");
    });
  }
}
