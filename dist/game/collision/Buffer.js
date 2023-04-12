"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Buffer = void 0;
var Buffer = /** @class */ (function () {
    function Buffer(buffer) {
        this.buffer = buffer;
        this.offset = 0;
    }
    Buffer.prototype.skip = function (length) {
        this.offset += length;
    };
    Buffer.prototype.setOffset = function (location) {
        this.offset = location;
    };
    Buffer.prototype.length = function () {
        return this.buffer.length;
    };
    Buffer.prototype.readSignedByte = function () {
        return this.buffer[this.offset++];
    };
    Buffer.prototype.readUnsignedByte = function () {
        return this.buffer[this.offset++] & 0xff;
    };
    Buffer.prototype.getShort = function () {
        var val = (this.readSignedByte() << 8) + this.readSignedByte();
        if (val > 32767) {
            val -= 0x10000;
        }
        return val;
    };
    Buffer.prototype.readUShort = function () {
        return (this.readUnsignedByte() << 8) + this.readUnsignedByte();
    };
    Buffer.prototype.getInt = function () {
        return (this.readUnsignedByte() << 24) + (this.readUnsignedByte() << 16) + (this.readUnsignedByte() << 8) + this.readUnsignedByte();
    };
    Buffer.prototype.getLong = function () {
        return BigInt((this.readUnsignedByte() << 56) + (this.readUnsignedByte() << 48) + (this.readUnsignedByte() << 40) + (this.readUnsignedByte() << 32) + (this.readUnsignedByte() << 24) + (this.readUnsignedByte() << 16) + (this.readUnsignedByte() << 8) + this.readUnsignedByte());
    };
    Buffer.prototype.readUnsignedWord = function () {
        this.offset += 2;
        return ((this.buffer[this.offset - 2] & 0xff) << 8) + (this.buffer[this.offset - 1] & 0xff);
    };
    Buffer.prototype.getUSmart = function () {
        var i = this.buffer[this.offset] & 0xff;
        if (i < 128) {
            return this.readUnsignedByte();
        }
        else {
            return this.readUShort() - 32768;
        }
    };
    Buffer.prototype.readSmart = function () {
        try {
            var value = 0;
            var ptr = void 0;
            for (ptr = this.getUSmart(); 32767 == ptr; ptr = this.getUSmart())
                value += 32767;
            value += ptr;
            return value;
        }
        catch (e) {
            console.error(e);
        }
        return -1;
    };
    Buffer.prototype.readString = function () {
        var i = this.offset;
        while (this.buffer[this.offset++] != 10)
            ;
        return new TextDecoder().decode(this.buffer.slice(i, this.offset - i - 1));
    };
    Buffer.prototype.getBytes = function () {
        var i = this.offset;
        while (this.buffer[this.offset++] != 10) {
            ;
        }
        return this.buffer.slice(i, this.offset - i - 1);
    };
    Buffer.prototype.read = function (length) {
        return this.buffer.slice(this.offset, this.offset + length);
        this.offset += length;
    };
    return Buffer;
}());
exports.Buffer = Buffer;
//# sourceMappingURL=Buffer.js.map