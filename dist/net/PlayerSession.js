"use strict";
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
exports.PlayerSession = void 0;
// import { Player } from '../game/entity/impl/player/Player';
// import { World } from '../game/World';
var PacketDecoder_1 = require("./codec/PacketDecoder");
var PacketConstants_1 = require("./packet/PacketConstants");
var NetworkConstants_1 = require("./NetworkConstants");
var PlayerSession = /** @class */ (function () {
    // public player: Player;
    function PlayerSession(channel) {
        this.packetsQueue = [];
        this.lastPacketOpcodeQueue = [];
        this.channel = channel;
        // this.player = new Player(this);
    }
    PlayerSession.prototype.finalizeLogin = function (msg) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                // let response = await LoginResponses.evaluate(this.player, msg);
                // this.player.setLongUsername(Misc.stringToLong(this.player.getUsername()));
                // this.channel.emit("login_response", new LoginResponsePacket(response, this.player.getRights()));
                // if (response != LoginResponses.LOGIN_SUCCESSFUL) {
                //     this.channel.disconnect();
                //     return;
                // }
                // Replace decoder/encoder to packets
                this.channel.removeAllListeners("packet");
                this.channel.on("packet", function (data) {
                    var packetDecoder = new PacketDecoder_1.PacketDecoder(msg.getDecryptor());
                    var packet = packetDecoder.onConnection(data);
                    _this.queuePacket(packet);
                });
                return [2 /*return*/];
            });
        });
    };
    PlayerSession.prototype.queuePacket = function (msg) {
        if (PacketConstants_1.PacketConstants.PACKETS[msg.getOpcode()] == null) {
            return;
        }
        var total_size = this.packetsQueue.length;
        if (total_size >= NetworkConstants_1.NetworkConstants.PACKET_PROCESS_LIMIT) {
            return;
        }
        if (msg.getOpcode() == PacketConstants_1.PacketConstants.EQUIP_ITEM_OPCODE ||
            msg.getOpcode() == PacketConstants_1.PacketConstants.SPECIAL_ATTACK_OPCODE) {
            this.packetsQueue.unshift(msg);
            return;
        }
        this.packetsQueue.push(msg);
    };
    PlayerSession.prototype.processPackets = function () {
        for (var i = 0; i < NetworkConstants_1.NetworkConstants.PACKET_PROCESS_LIMIT; i++) {
            var packet = this.packetsQueue.shift();
            if (packet == null) {
                continue;
            }
            if (this.lastPacketOpcodeQueue.length > 4) {
                this.lastPacketOpcodeQueue.shift();
            }
            this.lastPacketOpcodeQueue.push(packet.getOpcode());
            try {
                // PacketConstants.PACKETS[packet.getOpcode()].execute(this.player, packet);
            }
            catch (e) {
                console.log("processedPackets: " + this.lastPacketOpcodeQueue);
                console.error(e);
            }
            finally {
                packet.getBuffer();
            }
        }
    };
    PlayerSession.prototype.write = function (builder) {
        if (!this.channel.connected) {
            return;
        }
        try {
            var packet = builder.toPacket();
            this.channel.emit("packet", packet);
        }
        catch (ex) {
            console.error(ex);
        }
    };
    PlayerSession.prototype.flush = function () {
        if (!this.channel.connected) {
            return;
        }
        this.channel.disconnect();
    };
    // public getPlayer(): Player {
    //     return this.player;
    // }
    // public setPlayer(player: Player) {
    //     this.player = player;
    // }
    PlayerSession.prototype.getChannel = function () {
        return this.channel;
    };
    return PlayerSession;
}());
exports.PlayerSession = PlayerSession;
//# sourceMappingURL=PlayerSession.js.map