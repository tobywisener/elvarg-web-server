"use strict";
// import { PlayerSession } from "../PlayerSession";
// import { ChannelFilter } from "./ChannelFilter";
// import { ChannelEventHandler } from "./ChannelEventHandler";
// import { LoginDecoder } from "../codec/LoginDecoder";
// import { LoginEncoder } from "../codec/LoginEncoder";
// import { NetworkConstants } from "../NetworkConstants";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelPipelineHandler = void 0;
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
var socket_io_1 = require("socket.io");
var PlayerSession_1 = require("../PlayerSession");
var ChannelFilter_1 = require("./ChannelFilter");
var ChannelEventHandler_1 = require("./ChannelEventHandler");
var LoginDecoder_1 = require("../codec/LoginDecoder");
var LoginEncoder_1 = require("../codec/LoginEncoder");
var NetworkConstants_1 = require("../NetworkConstants");
var http = require("http"); // Use proper import for the HTTP server
// Create an HTTP server
var server = http.createServer();
// Create a Socket.IO server instance
var ioServer = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});
/**
 * Handles a channel's events.
 */
var ChannelPipelineHandler = /** @class */ (function () {
    function ChannelPipelineHandler() {
        /**
         * The part of the pipeline that limits connections and checks for any banned hosts.
         */
        this.FILTER = new ChannelFilter_1.ChannelFilter();
        // Pass the Socket.IO server to the handler
        this.HANDLER = new ChannelEventHandler_1.ChannelEventHandler(ioServer);
    }
    /**
     * Initialize the channel pipeline.
     */
    ChannelPipelineHandler.prototype.initChannel = function (channel) {
        return __awaiter(this, void 0, void 0, function () {
            var pipeline;
            return __generator(this, function (_a) {
                pipeline = channel.pipeline();
                // Ensure the session key is set for the channel
                channel
                    .attr(NetworkConstants_1.NetworkConstants.SESSION_KEY)
                    .setIfAbsent(new PlayerSession_1.PlayerSession(channel));
                // Add handlers to the pipeline
                pipeline.addLast("channel-filter", this.FILTER);
                pipeline.addLast("decoder", new LoginDecoder_1.LoginDecoder());
                pipeline.addLast("encoder", new LoginEncoder_1.LoginEncoder());
                pipeline.addLast("timeout", ioServer // Use the initialized Socket.IO server
                );
                pipeline.addLast("channel-handler", this.HANDLER);
                return [2 /*return*/];
            });
        });
    };
    return ChannelPipelineHandler;
}());
exports.ChannelPipelineHandler = ChannelPipelineHandler;
// // Start the server
// server.listen(3000, () => {
//   console.log("Server is running on http://localhost:3000");
// });
//# sourceMappingURL=ChannelPipelineHandler.js.map