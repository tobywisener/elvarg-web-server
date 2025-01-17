"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Buffer = void 0;
var BigInteger = require('big-integer');
var Buffer = /** @class */ (function () {
    function Buffer(payload) {
        this.payload = payload;
        this.currentPosition = 0;
    }
    Buffer.create = function () {
        var buffer = new Buffer([0]);
        buffer.currentPosition = 0;
        buffer.payload = new Array(5000);
        return buffer;
    };
    Buffer.prototype.readUTriByte = function (i) {
        this.currentPosition += 3;
        return (0xff & this.payload[this.currentPosition - 3] << 16)
            + (0xff & this.payload[this.currentPosition - 2] << 8)
            + (0xff & this.payload[this.currentPosition - 1]);
    };
    Buffer.prototype.readUShort = function () {
        this.currentPosition += 2;
        return ((this.payload[this.currentPosition - 2] & 0xff) << 8)
            + (this.payload[this.currentPosition - 1] & 0xff);
    };
    Buffer.prototype.readUShortA = function () {
        this.currentPosition += 2;
        return ((this.payload[this.currentPosition - 2] & 0xff) << 8)
            + (this.payload[this.currentPosition - 1] - 128 & 0xff);
    };
    Buffer.prototype.readSignedByte = function () {
        return this.payload[this.currentPosition++];
    };
    Buffer.prototype.readUSmart = function () {
        var value = this.payload[this.currentPosition] & 0xff;
        if (value < 128)
            return this.readSignedByte();
        else
            return this.readUShort() - 32768;
    };
    Buffer.prototype.readUSmart2 = function () {
        var baseVal = 0;
        var lastVal = 0;
        while ((lastVal = this.readUSmart()) == 32767) {
            baseVal += 32767;
        }
        return baseVal + lastVal;
    };
    Buffer.prototype.readNewString = function () {
        var i = this.currentPosition;
        while (this.payload[this.currentPosition++] != 0)
            ;
        return String.fromCharCode.apply(String, __spreadArray([], __read(this.payload.slice(i, this.currentPosition - 1)), false));
    };
    Buffer.prototype.writeOpcode = function (opcode) {
        this.payload[this.currentPosition++] = (opcode + this.encryption.nextInt());
    };
    Buffer.prototype.writeByte = function (value) {
        this.payload[this.currentPosition++] = (value);
    };
    Buffer.prototype.writeShort = function (value) {
        this.payload[this.currentPosition++] = (value >> 8);
        this.payload[this.currentPosition++] = (value);
    };
    Buffer.prototype.writeTriByte = function (value) {
        this.payload[this.currentPosition++] = (value >> 16);
        this.payload[this.currentPosition++] = (value >> 8);
        this.payload[this.currentPosition++] = (value);
    };
    Buffer.prototype.writeInt = function (value) {
        this.payload[this.currentPosition++] = (value >> 24);
        this.payload[this.currentPosition++] = (value >> 16);
        this.payload[this.currentPosition++] = (value >> 8);
        this.payload[this.currentPosition++] = value;
    };
    Buffer.prototype.writeLEInt = function (value) {
        this.payload[this.currentPosition++] = value;
        this.payload[this.currentPosition++] = (value >> 8);
        this.payload[this.currentPosition++] = (value >> 16);
        this.payload[this.currentPosition++] = (value >> 24);
    };
    Buffer.prototype.writeLong = function (value) {
        try {
            this.payload[this.currentPosition++] = (value >> 56);
            this.payload[this.currentPosition++] = (value >> 48);
            this.payload[this.currentPosition++] = (value >> 40);
            this.payload[this.currentPosition++] = (value >> 32);
            this.payload[this.currentPosition++] = (value >> 24);
            this.payload[this.currentPosition++] = (value >> 16);
            this.payload[this.currentPosition++] = (value >> 8);
            this.payload[this.currentPosition++] = (value);
        }
        catch (runtimeexception) {
            console.error("14395, " + 5 + ", " + value + ", " + runtimeexception.toString());
            throw new Error();
        }
    };
    Buffer.prototype.writeString = function (text) {
        var _this = this;
        this.payload.slice(text.length).forEach(function (e, i) { return _this.payload[_this.currentPosition + i] = e; });
        this.currentPosition += text.length;
        this.payload[this.currentPosition++] = 10;
    };
    Buffer.prototype.readShort2 = function () {
        this.currentPosition += 2;
        var i = ((this.payload[this.currentPosition - 2] & 0xff) << 8) + (this.payload[this.currentPosition - 1] & 0xff);
        if (i > 32767)
            i -= 65537;
        return i;
    };
    Buffer.prototype.readShort = function () {
        this.currentPosition += 2;
        var value = ((this.payload[this.currentPosition - 2] & 0xff) << 8)
            + (this.payload[this.currentPosition - 1] & 0xff);
        if (value > 32767) {
            value -= 0x10000;
        }
        return value;
    };
    Buffer.prototype.readTriByte = function () {
        this.currentPosition += 3;
        return ((this.payload[this.currentPosition - 3] & 0xff) << 16)
            + ((this.payload[this.currentPosition - 2] & 0xff) << 8)
            + (this.payload[this.currentPosition - 1] & 0xff);
    };
    Buffer.prototype.readInt = function () {
        this.currentPosition += 4;
        return ((this.payload[this.currentPosition - 4] & 0xff) << 24)
            + ((this.payload[this.currentPosition - 3] & 0xff) << 16)
            + ((this.payload[this.currentPosition - 2] & 0xff) << 8)
            + (this.payload[this.currentPosition - 1] & 0xff);
    };
    Buffer.prototype.readLong = function () {
        var msi = (this.readInt() & 0xffffffff);
        var lsi = (this.readInt() & 0xffffffff);
        return (msi << 32) + lsi;
    };
    Buffer.prototype.readString = function () {
        var index = this.currentPosition;
        while (this.payload[this.currentPosition++] != 10)
            ;
        return String.fromCharCode.apply(String, __spreadArray([], __read(this.payload.slice(index, this.currentPosition - 1)), false));
    };
    Buffer.prototype.readBytes = function () {
        var index = this.currentPosition;
        while (this.payload[this.currentPosition++] != 10)
            ;
        var data = new Uint8Array(this.currentPosition - index - 1);
        data.set(this.payload.slice(index, this.currentPosition - 1));
        return data;
    };
    Buffer.prototype.readByte = function (offset, length, data) {
        for (var index = length; index < length + offset; index++)
            data[index] = this.payload[this.currentPosition++];
    };
    Buffer.prototype.initBitAccess = function () {
        this.bitPosition = this.currentPosition * 8;
    };
    Buffer.prototype.readBits = function (amount) {
        var byteOffset = this.bitPosition >> 3;
        var bitOffset = 8 - (this.bitPosition & 7);
        var value = 0;
        this.bitPosition += amount;
        for (; amount > bitOffset; bitOffset = 8) {
            value += (this.payload[byteOffset++] & Buffer.BIT_MASKS[bitOffset]) << amount
                - bitOffset;
            amount -= bitOffset;
        }
        if (amount == bitOffset)
            value += this.payload[byteOffset] & Buffer.BIT_MASKS[bitOffset];
        else
            value += this.payload[byteOffset] >> bitOffset - amount
                & Buffer.BIT_MASKS[amount];
        return value;
    };
    Buffer.prototype.disableBitAccess = function () {
        this.currentPosition = (this.bitPosition + 7) / 8;
    };
    Buffer.prototype.readSmart = function () {
        var value = this.payload[this.currentPosition] & 0xff;
        if (value < 128)
            return this.readSignedByte() - 64;
        else
            return this.readUShort() - 49152;
    };
    Buffer.prototype.getSmart = function () {
        try {
            // checks current without modifying position
            if (this.currentPosition >= this.payload.length) {
                return this.payload[this.payload.length - 1] & 0xFF;
            }
            var value = this.payload[this.currentPosition] & 0xFF;
            if (value < 128) {
                return this.readSignedByte();
            }
            else {
                return this.readUShort() - 32768;
            }
        }
        catch (e) {
            console.log(e);
            return this.readUShort() - 32768;
        }
    };
    Buffer.prototype.encodeRSA = function (exponent, modulus) {
        var length = this.currentPosition;
        this.currentPosition = 0;
        var buffer = new Uint8Array(length);
        this.readBytes();
        var rsa = buffer;
        //if (Configuration.ENABLE_RSA) {
        rsa = new BigInteger(buffer).modPow(exponent, modulus)
            .toByteArray();
        //}
        this.currentPosition = 0;
        this.writeByte(rsa.length);
        this.writeByteS(rsa.length);
    };
    Buffer.prototype.writeNegatedByte = function (value) {
        this.payload[this.currentPosition++] = (value * -1);
    };
    Buffer.prototype.writeByteS = function (value) {
        this.payload[this.currentPosition++] = (128 - value);
    };
    Buffer.prototype.readUByteA = function () {
        return this.payload[this.currentPosition++] - 128 & 0xff;
    };
    Buffer.prototype.readNegUByte = function () {
        return -this.payload[this.currentPosition++] & 0xff;
    };
    Buffer.prototype.readUByteS = function () {
        return 128 - this.payload[this.currentPosition++] & 0xff;
    };
    Buffer.prototype.readNegByte = function () {
        return -this.payload[this.currentPosition++];
    };
    Buffer.prototype.readByteS = function () {
        return 128 - this.payload[this.currentPosition++];
    };
    Buffer.prototype.writeLEShort = function (value) {
        this.payload[this.currentPosition++] = value;
        this.payload[this.currentPosition++] = (value >> 8);
    };
    Buffer.prototype.writeShortA = function (value) {
        this.payload[this.currentPosition++] = (value >> 8);
        this.payload[this.currentPosition++] = (value + 128);
    };
    Buffer.prototype.writeLEShortA = function (value) {
        this.payload[this.currentPosition++] = (value + 128);
        this.payload[this.currentPosition++] = (value >> 8);
    };
    Buffer.prototype.readLEUShort = function () {
        this.currentPosition += 2;
        return ((this.payload[this.currentPosition - 1] & 0xff) << 8)
            + (this.payload[this.currentPosition - 2] & 0xff);
    };
    Buffer.prototype.readLEUShortA = function () {
        this.currentPosition += 2;
        return ((this.payload[this.currentPosition - 1] & 0xff) << 8)
            + (this.payload[this.currentPosition - 2] - 128 & 0xff);
    };
    Buffer.prototype.readLEShort = function () {
        this.currentPosition += 2;
        var value = ((this.payload[this.currentPosition - 1] & 0xff) << 8)
            + (this.payload[this.currentPosition - 2] & 0xff);
        if (value > 32767) {
            value -= 0x10000;
        }
        return value;
    };
    Buffer.prototype.readLEShortA = function () {
        this.currentPosition += 2;
        var value = ((this.payload[this.currentPosition - 1] & 0xff) << 8)
            + (this.payload[this.currentPosition - 2] - 128 & 0xff);
        if (value > 32767)
            value -= 0x10000;
        return value;
    };
    Buffer.prototype.getIntLittleEndian = function () {
        this.currentPosition += 4;
        return ((this.payload[this.currentPosition - 4] & 0xFF) << 24) + ((this.payload[this.currentPosition - 3] & 0xFF) << 16) + ((this.payload[this.currentPosition - 2] & 0xFF) << 8) + (this.payload[this.currentPosition - 1] & 0xFF);
    };
    Buffer.prototype.readMEInt = function () {
        this.currentPosition += 4;
        return ((this.payload[this.currentPosition - 2] & 0xff) << 24)
            + ((this.payload[this.currentPosition - 1] & 0xff) << 16)
            + ((this.payload[this.currentPosition - 4] & 0xff) << 8)
            + (this.payload[this.currentPosition - 3] & 0xff);
    };
    Buffer.prototype.readIMEInt = function () {
        this.currentPosition += 4;
        return ((this.payload[this.currentPosition - 3] & 0xff) << 24)
            + ((this.payload[this.currentPosition - 4] & 0xff) << 16)
            + ((this.payload[this.currentPosition - 1] & 0xff) << 8)
            + (this.payload[this.currentPosition - 2] & 0xff);
    };
    Buffer.prototype.writeReverseDataA = function (data, length, offset) {
        for (var index = (length + offset) - 1; index >= length; index--) {
            this.payload[this.currentPosition++] = (data[index] + 128);
        }
    };
    Buffer.prototype.readReverseData = function (data, offset, length) {
        for (var index = (length + offset) - 1; index >= length; index--) {
            data[index] = this.payload[this.currentPosition++];
        }
    };
    Buffer.BIT_MASKS = [0, 1, 3, 7, 15, 31, 63, 127, 255,
        511, 1023, 2047, 4095, 8191, 16383, 32767, 65535, 0x1ffff, 0x3ffff,
        0x7ffff, 0xfffff, 0x1fffff, 0x3fffff, 0x7fffff, 0xffffff,
        0x1ffffff, 0x3ffffff, 0x7ffffff, 0xfffffff, 0x1fffffff, 0x3fffffff,
        0x7fffffff, -1];
    return Buffer;
}());
exports.Buffer = Buffer;
//# sourceMappingURL=Buffer.js.map