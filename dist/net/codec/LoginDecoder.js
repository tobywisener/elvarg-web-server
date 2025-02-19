"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginDecoder = void 0;
var Server_1 = require("../../Server");
// import { GameConstants } from '../../game/GameConstants';
var ByteBufUtils_1 = require("../ByteBufUtils");
var NetworkConstants_1 = require("../NetworkConstants");
var LoginDetailsMessage_1 = require("../login/LoginDetailsMessage");
var LoginResponses_1 = require("../login/LoginResponses");
var IsaacRandom_1 = require("../security/IsaacRandom");
var Misc_1 = require("../../util/Misc");
var DiscordUtil_1 = require("../../util/DiscordUtil");
var Random = require("seedrandom");
var SocketIoServer = require("socket.io").Server;
// import { Server as IoServer, Socket } from "socket.io";
var LoginDecoderState;
(function (LoginDecoderState) {
    LoginDecoderState[LoginDecoderState["LOGIN_REQUEST"] = 0] = "LOGIN_REQUEST";
    LoginDecoderState[LoginDecoderState["LOGIN_TYPE"] = 1] = "LOGIN_TYPE";
    LoginDecoderState[LoginDecoderState["LOGIN"] = 2] = "LOGIN";
})(LoginDecoderState || (LoginDecoderState = {}));
var io = new SocketIoServer();
var LoginDecoder = /** @class */ (function () {
    function LoginDecoder() {
        this.state = LoginDecoderState.LOGIN_REQUEST;
        this.hostAddressOverride = null;
    }
    LoginDecoder.sendLoginResponse = function (response) {
        var buffer = Buffer.alloc(1);
        buffer.writeUInt8(response);
        io.emit("message", buffer);
        io.on("close", function () {
            io.send();
        });
    };
    LoginDecoder.prototype.decode = function (buffer, out) {
        switch (this.state) {
            case LoginDecoderState.LOGIN_REQUEST:
                this.decodeRequest(buffer);
                break;
            case LoginDecoderState.LOGIN_TYPE:
                this.decodeType(buffer);
                break;
            case LoginDecoderState.LOGIN:
                this.decodeLogin(buffer, out);
                break;
        }
    };
    LoginDecoder.prototype.decodeRequest = function (buffer) {
        if (buffer.length == 0) {
            io.close();
            return;
        }
        var request = buffer.readUInt8();
        if (request != NetworkConstants_1.NetworkConstants.LOGIN_REQUEST_OPCODE) {
            console.log("Session rejected for bad login request id: ".concat(request));
            LoginDecoder.sendLoginResponse(LoginResponses_1.LoginResponses.LOGIN_BAD_SESSION_ID);
            return;
        }
        if (buffer.length == 8) {
            var secret = buffer.readUInt8();
            if (secret != LoginDecoder.SECRET_VALUE) {
                console.log("Invalid secret value given: ".concat(secret));
                LoginDecoder.sendLoginResponse(LoginResponses_1.LoginResponses.LOGIN_BAD_SESSION_ID);
                return;
            }
            var ip = buffer.readUInt8();
            this.hostAddressOverride = "".concat(ip & 0xff, ".").concat((ip >> 8) & 0xff, ".").concat((ip >> 16) & 0xff, ".").concat((ip >> 24) & 0xff);
        }
        // Send information to the client
        var buf = Buffer.alloc(1 + 8);
        buf.writeUInt8(0); // 0 = continue login
        buf.writeUInt8(LoginDecoder.random.next); // This long will be used for encryption later on
        io.emit("message", buf);
        io.send();
        this.state = LoginDecoderState.LOGIN_TYPE;
    };
    LoginDecoder.prototype.decodeType = function (buffer) {
        if (buffer.length == 0) {
            io.close();
            return;
        }
        var connectionType = buffer.readUInt8();
        if (connectionType != NetworkConstants_1.NetworkConstants.NEW_CONNECTION_OPCODE &&
            connectionType != NetworkConstants_1.NetworkConstants.RECONNECTION_OPCODE) {
            Server_1.Server.getLogger().info("Session rejected for bad connection type id: " + connectionType);
            LoginDecoder.sendLoginResponse(LoginResponses_1.LoginResponses.LOGIN_BAD_SESSION_ID);
            return;
        }
        this.state = LoginDecoderState.LOGIN;
    };
    LoginDecoder.prototype.decodeLogin = function (buffer, out) {
        if (buffer.length == 0) {
            io.close();
            return;
        }
        var encryptedLoginBlockSize = buffer.readUInt8();
        var ipAddress;
        var url;
        io.use(function (socket, next) {
            ipAddress = socket.handshake.address;
            url = socket.handshake.url;
        });
        if (encryptedLoginBlockSize != buffer.length) {
            Server_1.Server.getLogger().info("[host= ".concat(ipAddress, "] encryptedLoginBlockSize != readable bytes"));
            LoginDecoder.sendLoginResponse(LoginResponses_1.LoginResponses.LOGIN_REJECT_SESSION);
            return;
        }
        if (buffer.length > 0) {
            var magicId = buffer.readUInt8();
            if (magicId != 0xff) {
                Server_1.Server.getLogger().info("[host= ".concat(ipAddress, "] [magic= ").concat(magicId, "] was rejected for the wrong magic value."));
                LoginDecoder.sendLoginResponse(LoginResponses_1.LoginResponses.LOGIN_REJECT_SESSION);
                return;
            }
            var memory = buffer.readUInt8();
            if (memory != 0 && memory != 1) {
                Server_1.Server.getLogger().info("[host= ".concat(ipAddress, "] was rejected for having the memory setting."));
                LoginDecoder.sendLoginResponse(LoginResponses_1.LoginResponses.LOGIN_REJECT_SESSION);
                return;
            }
            var length_1 = buffer.readUInt8();
            var rsaBytes = new Uint8Array(length_1);
            buffer.copy(rsaBytes);
            var rsaBuffer = Buffer.from(rsaBytes);
            var securityId = rsaBuffer.readInt8();
            if (securityId != 10 && securityId != 11) {
                Server_1.Server.getLogger().info("[host= ".concat(ipAddress, "] was rejected for having the wrong securityId."));
                LoginDecoder.sendLoginResponse(LoginResponses_1.LoginResponses.LOGIN_REJECT_SESSION);
                return;
            }
            var clientSeed = rsaBuffer.readInt8();
            var seedReceived = rsaBuffer.readInt8();
            var seed = [
                clientSeed >> 32,
                clientSeed,
                seedReceived >> 32,
                seedReceived,
            ];
            var decodingRandom = new IsaacRandom_1.IsaacRandom(seed);
            for (var i = 0; i < seed.length; i++) {
                seed[i] += 50;
            }
            var uid = rsaBuffer.readInt8();
            // if (uid != GameConstants.CLIENT_UID) {
            //     Server.getLogger().info(`[host= ${ipAddress}] was rejected for having the wrong UID.`);
            //     LoginDecoder.sendLoginResponse(LoginResponses.OLD_CLIENT_VERSION);
            //     return;
            // }
            var host = this.hostAddressOverride;
            if (host == null) {
                host = ByteBufUtils_1.ByteBufUtils.getHost(url);
            }
            var rawUsername = ByteBufUtils_1.ByteBufUtils.readString(rsaBuffer);
            var password = ByteBufUtils_1.ByteBufUtils.readString(rsaBuffer);
            if (securityId == 10) {
                var username = Misc_1.Misc.formatText(rawUsername.toLowerCase());
                if (username.length < 3 ||
                    username.length > 30 ||
                    password.length < 3 ||
                    password.length > 30) {
                    LoginDecoder.sendLoginResponse(LoginResponses_1.LoginResponses.INVALID_CREDENTIALS_COMBINATION);
                    return;
                }
                out.push(new LoginDetailsMessage_1.LoginDetailsMessage(username, password, host, new IsaacRandom_1.IsaacRandom(seed), decodingRandom));
            }
            else if (securityId == 11) {
                if (rawUsername == DiscordUtil_1.DiscordUtil.DiscordConstants.USERNAME_CACHED_TOKEN ||
                    rawUsername == DiscordUtil_1.DiscordUtil.DiscordConstants.USERNAME_AUTHZ_CODE) {
                    var msg = new LoginDetailsMessage_1.LoginDetailsMessage(rawUsername, password, host, new IsaacRandom_1.IsaacRandom(seed), decodingRandom);
                    msg.setDiscord(true);
                    out.push(msg);
                }
                else {
                    LoginDecoder.sendLoginResponse(LoginResponses_1.LoginResponses.INVALID_CREDENTIALS_COMBINATION);
                }
            }
        }
    };
    LoginDecoder.random = new Random();
    LoginDecoder.SECRET_VALUE = 345749224;
    return LoginDecoder;
}());
exports.LoginDecoder = LoginDecoder;
//# sourceMappingURL=LoginDecoder.js.map