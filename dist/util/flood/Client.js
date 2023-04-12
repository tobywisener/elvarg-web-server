"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
var Buffer_1 = require("../flood/Buffer");
var ByteBuffer_1 = require("../flood/ByteBuffer");
var BufferedConnection_1 = require("../flood/BufferedConnection");
var IsaacRandom_1 = require("../../net/security/IsaacRandom");
var NetworkConstants_1 = require("../../net/NetworkConstants");
var socket_io_client_1 = require("socket.io-client");
var GameConstants_1 = require("../../game/GameConstants");
var LoginResponses_1 = require("../../net/login/LoginResponses");
var Server_1 = require("../../Server");
var Client = /** @class */ (function () {
    function Client(username, password) {
        this.pingCounter = 0;
        this.username = username;
        this.password = password;
    }
    Client.prototype.openSocket = function (port) {
        var socket = (0, socket_io_client_1.default)("http://localhost:".concat(port));
        socket.on('connect', function () {
            console.log('Conectado ao servidor');
        });
        socket.on('disconnect', function () {
            console.log('Desconectado do servidor');
        });
        return socket;
    };
    Client.prototype.attemptLogin = function () {
        this.login = Buffer_1.Buffer.create();
        this.incoming = Buffer_1.Buffer.create();
        this.outgoing = ByteBuffer_1.ByteBuffer.create(5000, false, null);
        this.socketStream = new BufferedConnection_1.BufferedConnection(this.openSocket(NetworkConstants_1.NetworkConstants.GAME_PORT));
        this.outgoing.putByte(14); //REQUEST
        this.socketStream.queueBytes(1, this.outgoing.getBuffer());
        var response = this.socketStream.read();
    };
    Client.prototype.attemptLogins = function () {
        this.login = Buffer_1.Buffer.create();
        this.incoming = Buffer_1.Buffer.create();
        this.outgoing = ByteBuffer_1.ByteBuffer.create(5000, false, null);
        this.socketStream = new BufferedConnection_1.BufferedConnection(this.openSocket(NetworkConstants_1.NetworkConstants.GAME_PORT));
        this.outgoing.putByte(14); //REQUEST
        this.socketStream.queueBytes(1, this.outgoing.getBuffer());
        var response = this.socketStream.read();
        //Our encryption for outgoing messages for this player's session
        var cipher = null;
        if (response === 0) {
            this.socketStream.flushInputStream(new Uint8Array(this.incoming.payload), 8);
            this.incoming.currentPosition = 0;
            this.serverSeed = this.incoming.readLong();
            var seed = [
                Math.floor(Math.random() * 99999999),
                Math.floor(Math.random() * 99999999),
                this.serverSeed >> 32,
                this.serverSeed
            ];
            this.outgoing.resetPosition();
            this.outgoing.putByte(10);
            this.outgoing.putInt(seed[0]);
            this.outgoing.putInt(seed[1]);
            this.outgoing.putInt(seed[2]);
            this.outgoing.putInt(seed[3]);
            this.outgoing.putInt(GameConstants_1.GameConstants.CLIENT_UID);
            this.outgoing.putString(this.username);
            this.outgoing.putString(this.password);
            this.outgoing.encryptRSAContent();
            this.login.currentPosition = 0;
            this.login.writeByte(16);
            this.login.writeByte(this.outgoing.getPosition() + 2);
            this.login.writeByte(255);
            this.login.writeByte(0);
            this.login.writeByteS(this.outgoing.getPosition());
            cipher = new IsaacRandom_1.IsaacRandom(seed);
            for (var index = 0; index < 4; index++) {
                seed[index] += 50;
            }
            this.encryption = new IsaacRandom_1.IsaacRandom(seed);
            this.socketStream.queueBytes(this.login.currentPosition, new Uint8Array(this.login.payload));
            response = this.socketStream.read();
        }
        if (response === LoginResponses_1.LoginResponses.LOGIN_SUCCESSFUL) {
            Server_1.Server.getFlooder().clients.set(this.username, this);
            var rights = this.socketStream.read();
            this.loggedIn = true;
            this.outgoing = ByteBuffer_1.ByteBuffer.create(5000, false, cipher);
            this.incoming.currentPosition = 0;
        }
    };
    Client.prototype.readPacket = function () {
        if (this.socketStream == null) {
            return false;
        }
        var available = this.socketStream.available();
        if (available < 2) {
            return false;
        }
        var opcode = -1;
        var packetSize = -1;
        if (opcode === -1) {
            this.socketStream.flushInputStream(new Uint8Array(this.incoming.payload), 1);
            opcode = this.incoming.payload[0] & 0xff;
            if (this.encryption != null) {
                opcode = (opcode - this.encryption.nextInt()) & 0xff;
            }
            this.socketStream.flushInputStream(new Uint8Array(this.incoming.payload), 2);
            packetSize = ((this.incoming.payload[0] & 0xff) << 8) + (this.incoming.payload[1] & 0xff);
        }
        if (!(opcode >= 0 && opcode < 256)) {
            opcode = -1;
            return false;
        }
        this.incoming.currentPosition = 0;
        this.socketStream.flushInputStream(new Uint8Array(this.incoming.payload), packetSize);
        switch (opcode) {
        }
        return false;
    };
    Client.prototype.process = function () {
        if (this.loggedIn) {
            for (var i = 0; i < 5; i++) {
                if (!this.readPacket()) {
                    break;
                }
            }
            if (this.pingCounter++ >= 25) {
                this.outgoing.resetPosition();
                this.outgoing.putOpcode(0);
                if (this.socketStream != null) {
                    this.socketStream.queueBytes(this.outgoing.bufferLength(), this.outgoing.getBuffer());
                }
                this.pingCounter = 0;
            }
        }
    };
    return Client;
}());
exports.Client = Client;
//# sourceMappingURL=Client.js.map