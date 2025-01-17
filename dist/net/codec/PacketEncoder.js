"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacketEncoder = void 0;
var PacketType_1 = require("../packet/PacketType");
var PacketEncoder = /** @class */ (function () {
    function PacketEncoder(encoder) {
        this.CLIENTS_PACKET_SIZES = [
            0, 0, 0, 1, 6, 0, 0, 0, 4, 4, //0
            6, 2, -1, 1, 1, -1, 1, 0, 0, 0, // 10
            0, 0, 0, 0, 1, 0, 0, -1, 1, 1, //20
            0, 0, 0, 0, -2, 4, 3, 0, 2, 0, //30
            0, 0, 0, 0, 7, 8, 0, 6, 0, 0, //40
            9, 8, 0, -2, 4, 1, 0, 0, 0, 0, //50
            -2, 1, 0, 0, 2, -2, 0, 0, 0, 0, //60
            6, 3, 2, 4, 2, 4, 0, 0, 0, 4, //70
            0, -2, 0, 0, 11, 2, 1, 6, 6, 0, //80
            0, 0, 0, 0, 0, 0, 0, 2, 0, 1, //90
            2, 2, 0, 1, -1, 8, 1, 0, 8, 0, //100
            1, 1, 1, 1, 2, 1, 5, 15, 0, 0, //110
            0, 4, 4, -1, 9, -1, -2, 2, 0, 0, //120 // 9
            -1, 0, 0, 0, 13, 0, 0, 1, 0, 0, // 130
            3, 10, 2, 0, 0, 0, 0, 14, 0, 0, //140
            0, 4, 5, 3, 0, 0, 3, 0, 0, 0, //150
            4, 5, 0, 0, 2, 0, 6, 5, 0, 0, //160
            0, 5, -2, -2, 7, 5, 10, 6, 0, -2, // 170
            0, 0, 0, 1, 1, 2, 1, -1, 0, 0, //180
            0, 0, 0, 0, 0, 2, -1, 0, -1, 0, //190
            4, 0, 0, 0, 0, 0, 3, 0, 4, 0, //200
            0, 0, 0, 0, -2, 7, 0, -2, 2, 0, //210
            0, 1, -2, -2, 0, 0, 0, 0, 0, 0, // 220
            8, 0, 0, 0, 0, 0, 0, 0, 0, 0, //230
            2, -2, 0, 0, -1, 0, 6, 0, 4, 3, //240
            -1, 0, -1, -1, 6, 0, 0 //250
        ];
        this.encoder = encoder;
        this.CLIENT_PACKET_SIZES = [];
    }
    PacketEncoder.prototype.encode = function (packet) {
        var opcode = (packet.getOpcode() + this.encoder.nextInt()) & 0xff;
        var type = packet.getType();
        var size = packet.getSize();
        if (type === PacketType_1.PacketType.FIXED) {
            var currSize = this.CLIENT_PACKET_SIZES[packet.getOpcode()];
            if (size !== currSize) {
                console.error("{PacketEncoder} Opcode ".concat(packet.getOpcode(), " has defined size ").concat(currSize, " but is actually ").concat(size, "."));
                return null;
            }
        }
        else if (type === PacketType_1.PacketType.VARIABLE) {
            var currSize = this.CLIENT_PACKET_SIZES[packet.getOpcode()];
            if (currSize !== -1) {
                console.error("{PacketEncoder} Opcode ".concat(packet.getOpcode(), "'s size needs to be -1, it's currently ").concat(currSize, "."));
                return null;
            }
        }
        else if (type === PacketType_1.PacketType.VARIABLE_SHORT) {
            var currSize = this.CLIENT_PACKET_SIZES[packet.getOpcode()];
            if (currSize !== -2) {
                console.error("{PacketEncoder} Opcode ".concat(packet.getOpcode(), "'s size needs to be -2, it's currently ").concat(currSize, "."));
                return null;
            }
        }
        var finalSize = size + 1;
        switch (type) {
            case PacketType_1.PacketType.VARIABLE:
                if (size > 255) {
                    throw new Error("Tried to send packet length ".concat(size, " in variable-byte packet"));
                }
                finalSize++;
                break;
            case PacketType_1.PacketType.VARIABLE_SHORT:
                if (size > 65535) {
                    throw new Error("Tried to send packet length ".concat(size, " in variable-short packet"));
                }
                finalSize += 2;
                break;
            default:
                break;
        }
        var buffer = Buffer.allocUnsafe(finalSize);
        buffer.writeUInt8(opcode);
        switch (type) {
            case PacketType_1.PacketType.VARIABLE:
                buffer.writeUInt8(size, 1);
                break;
            case PacketType_1.PacketType.VARIABLE_SHORT:
                buffer.writeUInt16BE(size, 1);
                break;
            default:
                break;
        }
        // Write packet
        buffer.set(packet.getBuffer(), finalSize - size - 1);
        return buffer;
    };
    return PacketEncoder;
}());
exports.PacketEncoder = PacketEncoder;
//# sourceMappingURL=PacketEncoder.js.map