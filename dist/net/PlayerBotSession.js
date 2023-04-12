"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
exports.PlayerBotSession = void 0;
var PlayerSession_1 = require("./PlayerSession");
var PlayerBotSession = /** @class */ (function (_super) {
    __extends(PlayerBotSession, _super);
    function PlayerBotSession() {
        return _super.call(this, {
            parent: null,
            config: null,
            localAddress: null,
            remoteAddress: null,
            isInputShutdown: false,
            shutdownInput: function () { return null; },
            shutdownInputPromise: function () { return null; },
            isOutputShutdown: false,
            shutdownOutput: function () { return null; },
            shutdownOutputPromise: function () { return null; },
            isShutdown: false,
            shutdown: function () { return null; },
            shutdownPromise: function () { return null; },
            id: null,
            eventLoop: null,
            isOpen: false,
            isRegistered: false,
            isActive: false,
            metadata: null,
            closeFuture: function () { return null; },
            isWritable: false,
            bytesBeforeUnwritable: 0,
            bytesBeforeWritable: 0,
            unsafe: null,
            pipeline: null,
            alloc: null,
            read: function () { return null; },
            flush: function () { return null; },
            bind: function () { return null; },
            connect: function () { return null; },
            connectTwo: function () { return null; },
            disconnect: function () { return null; },
            closeChannel: function () { return null; },
            deregister: function () { return null; },
            bindPromise: function () { return null; },
            connectPromise: function () { return null; },
            connectTwoPromise: function () { return null; },
            disconnectPromise: function () { return null; },
            closePromise: function () { return null; },
            deregisterPromise: function () { return null; },
            write: function () { return null; },
            writePromise: function () { return null; },
            writeAndFlushPromise: function () { return null; },
            writeAndFlush: function () { return null; },
            newPromise: function () { return null; },
            newProgressivePromise: function () { return null; },
            newSucceededFuture: function () { return null; },
            newFailedFuture: function () { return null; },
            voidPromise: function () { return null; },
            attr: function () { return null; },
            hasAttr: function () { return false; },
            compareTo: function () { return 0; },
        }) || this;
    }
    PlayerBotSession.prototype.finalizeLogin = function (msg) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _super.prototype.finalizeLogin.call(this, msg)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
    
    Queues a recently decoded packet received from the channel.
    @param msg The packet that should be queued.
    */
    PlayerBotSession.prototype.queuePacket = function (msg) {
    };
    /**
    
    Processes all of the queued messages from the {@link PacketDecoder} by
    polling the internal queue, and then handling them via the
    handleInputMessage. This method is called EACH GAME CYCLE.
    */
    PlayerBotSession.prototype.processPackets = function () {
    };
    /**
    
    Queues the {@code msg} for this session to be encoded and sent to the client.
    @param builder the packet to queue.
    */
    PlayerBotSession.prototype.write = function (builder) {
    };
    /**
    
    Flushes this channel.
    */
    PlayerBotSession.prototype.flush = function () {
    };
    /**
    
    Gets the player I/O operations will be executed for.
    @return the player I/O operations.
    */
    PlayerBotSession.prototype.getPlayer = function () {
        return this.player;
    };
    PlayerBotSession.prototype.setPlayer = function (player) {
        this.player = player;
    };
    PlayerBotSession.prototype.getChannel = function () {
        return null;
    };
    return PlayerBotSession;
}(PlayerSession_1.PlayerSession));
exports.PlayerBotSession = PlayerBotSession;
//# sourceMappingURL=PlayerBotSession.js.map