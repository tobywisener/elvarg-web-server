"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacketDecoder = void 0;
var Packet_1 = require("../packet/Packet");
var NetworkConstants_1 = require("../NetworkConstants");
var PacketDecoder = exports.PacketDecoder = /** @class */ (function () {
    function PacketDecoder(random, io) {
        this.io = io;
        this.random = random;
        this.opcode = -1;
        this.size = -1;
    }
    PacketDecoder.prototype.onConnection = function (socket) {
        var _this = this;
        var session = socket.data[NetworkConstants_1.NetworkConstants.SESSION_KEY];
        if (session == null || session.getPlayer() == null) {
            return;
        }
        socket.on('packet', function (data) {
            var opcode = _this.opcode;
            var size = _this.size;
            if (opcode == -1) {
                if (data.length >= 1) {
                    opcode = data[0];
                    opcode = opcode - _this.random.nextInt() & 0xFF;
                    size = PacketDecoder.PACKET_SIZES[opcode];
                    _this.opcode = opcode;
                    _this.size = size;
                }
                else {
                    return;
                }
            }
            if (size == -1) {
                if (data.length >= 2) {
                    size = data[1] & 0xFF;
                    _this.size = size;
                }
                else {
                    return;
                }
            }
            if (data.length >= size) {
                var packetData = data.slice(0, size);
                _this.opcode = -1;
                _this.size = -1;
                var packet = new Packet_1.Packet(opcode, Buffer.from(packetData));
                _this.io.emit('packet', packet); // broadcast packet to all connected sockets
            }
        });
    };
    PacketDecoder.PACKET_SIZES = [
    // ...
    ];
    return PacketDecoder;
}());
//# sourceMappingURL=PacketDecoder.js.map