"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Packet = void 0;
var PacketType_1 = require("./PacketType");
var ValueType_1 = require("./ValueType");
var stringbuilder_1 = require("stringbuilder");
var Packet = /** @class */ (function () {
    function Packet(opcode, arg2, arg3) {
        this.opcode = opcode;
        if (arg3 !== undefined) {
            this.type = arg2;
            this.buffer = arg3;
        }
        else {
            this.type = PacketType_1.PacketType.FIXED;
            this.buffer = arg2;
        }
    }
    Packet.prototype.getOpcode = function () {
        return this.opcode;
    };
    Packet.prototype.getBuffer = function () {
        return this.buffer;
    };
    Packet.prototype.getSize = function () {
        return this.buffer.length;
    };
    Packet.prototype.getLength = function () {
        return this.buffer.length;
    };
    Packet.prototype.readByte = function () {
        var b = 0;
        try {
            b = this.buffer.readUInt8();
        }
        catch (e) {
        }
        return b;
    };
    Packet.prototype.readByteA = function () {
        return this.readByte() - 128;
    };
    Packet.prototype.readByteC = function () {
        return -this.readByte();
    };
    Packet.prototype.readByteS = function () {
        return 128 - this.readByte();
    };
    Packet.prototype.readUnsignedByteS = function () {
        return this.readByteS() & 0xff;
    };
    // public readBytes(bytes: number[]): Packet {
    //     this.buffer.readBytes(bytes);
    //     return this;
    // }
    Packet.prototype.readBytes = function (amount) {
        var bytes = new Array(amount);
        for (var i = 0; i < amount; i++) {
            bytes[i] = this.readByte();
        }
        return bytes;
    };
    Packet.prototype.readBytesA = function (amount) {
        if (amount < 0)
            throw new Error("The byte array amount cannot have a negative value!");
        var bytes = new Array(amount);
        for (var i = 0; i < amount; i++) {
            bytes[i] = this.readByte() + 128;
        }
        return bytes;
    };
    Packet.prototype.readReversedBytesA = function (amount) {
        var bytes = new Array(amount);
        var position = amount - 1;
        for (; position >= 0; position--) {
            bytes[position] = this.readByte() + 128;
        }
        return bytes;
    };
    Packet.prototype.readUnsignedByte = function () {
        return this.buffer.readUInt8();
    };
    Packet.prototype.readShort = function () {
        return this.buffer.readUInt8();
    };
    Packet.prototype.readShortA = function () {
        var value = ((this.readByte() & 0xFF) << 8) | (this.readByte() - 128 & 0xFF);
        return value > 32767 ? value - 0x10000 : value;
    };
    // ... previous code
    Packet.prototype.readLEShort = function () {
        var value = (this.readByte() & 0xFF) | (this.readByte() & 0xFF) << 8;
        return value > 32767 ? value - 0x10000 : value;
    };
    Packet.prototype.readLEShortA = function () {
        var value = (this.readByte() - 128 & 0xFF) | (this.readByte() & 0xFF) << 8;
        return value > 32767 ? value - 0x10000 : value;
    };
    Packet.prototype.readUnsignedShort = function () {
        return this.buffer.readUInt8();
    };
    Packet.prototype.readUnsignedShortA = function () {
        var value = 0;
        value |= this.readUnsignedByte() << 8;
        value |= (this.readByte() - 128) & 0xff;
        return value;
    };
    Packet.prototype.readInt = function () {
        return this.buffer.readUInt8();
    };
    Packet.prototype.readSingleInt = function () {
        var firstByte = this.readByte(), secondByte = this.readByte(), thirdByte = this.readByte(), fourthByte = this.readByte();
        return ((thirdByte << 24) & 0xFF) | ((fourthByte << 16) & 0xFF) | ((firstByte << 8) & 0xFF) | (secondByte & 0xFF);
    };
    Packet.prototype.readDoubleInt = function () {
        var firstByte = this.readByte() & 0xFF, secondByte = this.readByte() & 0xFF, thirdByte = this.readByte() & 0xFF, fourthByte = this.readByte() & 0xFF;
        return ((secondByte << 24) & 0xFF) | ((firstByte << 16) & 0xFF) | ((fourthByte << 8) & 0xFF) | (thirdByte & 0xFF);
    };
    Packet.prototype.readTripleInt = function () {
        return ((this.readByte() << 16) & 0xFF) | ((this.readByte() << 8) & 0xFF) | (this.readByte() & 0xFF);
    };
    Packet.prototype.readLong = function () {
        return this.buffer.readUInt8();
    };
    Packet.prototype.getBytesReverse = function (amount, type) {
        var data = new Array(amount);
        var dataPosition = 0;
        for (var i = this.buffer.length + amount - 1; i >= this.buffer.length; i--) {
            var value = this.buffer.readInt8(i);
            switch (type) {
                case ValueType_1.ValueType.A:
                    value -= 128;
                    break;
                case ValueType_1.ValueType.C:
                    value = -value;
                    break;
                case ValueType_1.ValueType.S:
                    value = 128 - value;
                    break;
                case ValueType_1.ValueType.STANDARD:
                    break;
            }
            data[dataPosition++] = value;
        }
        return data;
    };
    Packet.prototype.readString = function () {
        var builder = new stringbuilder_1.StringBuilder();
        var value;
        while (this.buffer.readUInt8() && (value = this.buffer.readInt8()) != 10) {
            builder.append(String.fromCharCode(value));
        }
        return builder.toString();
    };
    Packet.prototype.readSmart = function () {
        return this.buffer.readInt8(this.buffer.readInt8()) < 128 ? this.readByte() & 0xFF : (this.readShort() & 0xFFFF) - 32768;
    };
    Packet.prototype.readSignedSmart = function () {
        return this.buffer.readInt8(this.buffer.readInt8()) < 128 ? (this.readByte() & 0xFF) - 64 : (this.readShort() & 0xFFFF) - 49152;
    };
    Packet.prototype.toString = function () {
        return "Packet - [opcode, size] : [".concat(this.getOpcode(), ", ").concat(this.getSize(), "]");
    };
    Packet.prototype.getType = function () {
        return this.type;
    };
    return Packet;
}());
exports.Packet = Packet;
//# sourceMappingURL=Packet.js.map