"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacketBuilder = exports.AccessType = exports.ValueType = void 0;
var PacketType_1 = require("./PacketType");
var ByteOrder_1 = require("./ByteOrder");
var Packet_1 = require("./Packet");
var ValueType;
(function (ValueType) {
    ValueType[ValueType["A"] = 0] = "A";
    ValueType[ValueType["C"] = 1] = "C";
    ValueType[ValueType["S"] = 2] = "S";
    ValueType[ValueType["STANDARD"] = 3] = "STANDARD";
})(ValueType || (exports.ValueType = ValueType = {}));
var AccessType;
(function (AccessType) {
    AccessType[AccessType["BIT"] = 0] = "BIT";
    AccessType[AccessType["BYTE"] = 1] = "BYTE";
})(AccessType || (exports.AccessType = AccessType = {}));
var PacketBuilder = /** @class */ (function () {
    function PacketBuilder(opcodeOrType, type) {
        this.buffers = Buffer.alloc(10);
        this._buffer = Buffer.from('my string', 'utf-8');
        if (typeof opcodeOrType === 'number') {
            this.opcode = opcodeOrType;
            this.type = type !== null && type !== void 0 ? type : PacketType_1.PacketType.FIXED;
        }
        else {
            this.opcode = -1;
            this.type = PacketType_1.PacketType.FIXED;
        }
    }
    PacketBuilder.prototype.writeBuffer = function (buffer) {
        this.buffers.write(buffer);
        return this;
    };
    PacketBuilder.prototype.writePutBytes = function (buffer) {
        this.buffers.write(buffer);
        return this;
    };
    PacketBuilder.prototype.putBytesReverse = function (data) {
        for (var i = data.length - 1; i >= 0; i--) {
            this.put(data[i]);
        }
        return this;
    };
    PacketBuilder.prototype.writeByteArray = function (bytes) {
        this.buffers.write(bytes);
        return this;
    };
    PacketBuilder.prototype.writePutBits = function (numBits, value) {
        if (!this.buffers.buffer) {
            throw new Error("The ByteBuf implementation must support array() for bit usage.");
        }
        var buffer = this.buffers.buffer;
        var bytePos = this.bitPosition >> 3;
        var bitOffset = 8 - (this.bitPosition & 7);
        this.bitPosition += numBits;
        for (; numBits > bitOffset; bitOffset = 8) {
            buffer[bytePos] &= ~PacketBuilder.BIT_MASK[bitOffset];
            buffer[bytePos++] |= (value >> (numBits - bitOffset)) & PacketBuilder.BIT_MASK[bitOffset];
            numBits -= bitOffset;
        }
        if (numBits == bitOffset) {
            buffer[bytePos] &= ~PacketBuilder.BIT_MASK[bitOffset];
            buffer[bytePos] |= value & PacketBuilder.BIT_MASK[bitOffset];
        }
        else {
            buffer[bytePos] &= ~(PacketBuilder.BIT_MASK[numBits] << (bitOffset - numBits));
            buffer[bytePos] |= (value & PacketBuilder.BIT_MASK[numBits]) << (bitOffset - numBits);
        }
        return this;
    };
    PacketBuilder.prototype.putsBit = function (flag) {
        this.putBits(1, flag ? 1 : 0);
        return this;
    };
    PacketBuilder.prototype.initializesAccess = function (type) {
        switch (type) {
            case AccessType.BIT:
                this.bitPosition = this.buffers.length * 8;
                break;
            case AccessType.BYTE:
                this.buffers.writeUInt32BE((this.bitPosition + 7) / 8);
                break;
        }
        return this;
    };
    PacketBuilder.prototype.put = function (value) {
        this.puts(value, ValueType.STANDARD);
        return this;
    };
    PacketBuilder.prototype.putsShort = function (value, type, order) {
        switch (order) {
            case ByteOrder_1.ByteOrder.BIG:
                this.put(value >> 8);
                this.puts(value, type);
                break;
            case ByteOrder_1.ByteOrder.MIDDLE:
                throw new Error("Middle-endian short is impossible!");
            case ByteOrder_1.ByteOrder.INVERSE_MIDDLE:
                throw new Error("Inverse-middle-endian short is impossible!");
            case ByteOrder_1.ByteOrder.LITTLE:
                this.puts(value, type);
                this.put(value >> 8);
                break;
            case ByteOrder_1.ByteOrder.TRIPLE_INT:
                throw new Error("TRIPLE_INT short not added!");
        }
        return this;
    };
    PacketBuilder.prototype.putTypeInt = function (value, type, order) {
        if (type === void 0) { type = ValueType.STANDARD; }
        if (order === void 0) { order = ByteOrder_1.ByteOrder.BIG; }
        switch (order) {
            case ByteOrder_1.ByteOrder.BIG:
                this.put((value >> 24));
                this.put((value >> 16));
                this.put((value >> 8));
                this.puts(value, type);
                break;
            case ByteOrder_1.ByteOrder.MIDDLE:
                this.put((value >> 8));
                this.puts(value, type);
                this.put((value >> 24));
                this.put((value >> 16));
                break;
            case ByteOrder_1.ByteOrder.INVERSE_MIDDLE:
                this.put((value >> 16));
                this.put((value >> 24));
                this.puts(value, type);
                this.put((value >> 8));
                break;
            case ByteOrder_1.ByteOrder.LITTLE:
                this.puts(value, type);
                this.put((value >> 8));
                this.put((value >> 16));
                this.put((value >> 24));
                break;
            case ByteOrder_1.ByteOrder.TRIPLE_INT:
                this.put((value >> 16));
                this.put((value >> 8));
                this.put(value);
                break;
        }
        return this;
    };
    PacketBuilder.prototype.putInt = function (value) {
        this.putInts(value, ValueType.STANDARD, ByteOrder_1.ByteOrder.BIG);
        return this;
    };
    PacketBuilder.prototype.putBytes = function (from) {
        for (var i = 0; i < from.length; i++) {
            this.put(from.readInt8(i));
        }
        return this;
    };
    PacketBuilder.prototype.putsBytes = function (from) {
        this.buffers.write(from);
        return this;
    };
    PacketBuilder.prototype.writeByteArrays = function (bytes, offset, length) {
        this.buffers.write(bytes, offset, length);
        return this;
    };
    PacketBuilder.prototype.writeBytesArray = function (bytes) {
        this.buffers.write(bytes);
        return this;
    };
    PacketBuilder.prototype.putBits = function (numBits, value) {
        if (!this.buffers.buffer) {
            throw new Error("The ByteBuf implementation must support array() for bit usage.");
        }
        var buffer = this.buffers.buffer;
        var bytePos = this.bitPosition >> 3;
        var bitOffset = 8 - (this.bitPosition & 7);
        this.bitPosition += numBits;
        for (; numBits > bitOffset; bitOffset = 8) {
            buffer[bytePos] &= PacketBuilder.BIT_MASK[bitOffset];
            buffer[bytePos++] |= (value >> (numBits - bitOffset)) & PacketBuilder.BIT_MASK[bitOffset];
            numBits -= bitOffset;
        }
        if (numBits === bitOffset) {
            buffer[bytePos] &= PacketBuilder.BIT_MASK[bitOffset];
            buffer[bytePos] |= value & PacketBuilder.BIT_MASK[bitOffset];
        }
        else {
            buffer[bytePos] &= ~(PacketBuilder.BIT_MASK[numBits] << (bitOffset - numBits));
            buffer[bytePos] |= (value & PacketBuilder.BIT_MASK[numBits] << (bitOffset - numBits));
            buffer[bytePos] |= (value & PacketBuilder.BIT_MASK[numBits]) << (bitOffset - numBits);
        }
        return this;
    };
    PacketBuilder.prototype.initializeAccess = function (type) {
        switch (type) {
            case AccessType.BIT:
                this.bitPosition = this.buffers.length * 8;
                break;
            case AccessType.BYTE:
                this.buffers.writeUInt32BE((this.bitPosition + 7) / 8);
                break;
        }
        return this;
    };
    PacketBuilder.prototype.putBit = function (flag) {
        this.putBits(1, flag ? 1 : 0);
        return this;
    };
    PacketBuilder.prototype.puts = function (value, type) {
        switch (type) {
            case ValueType.A:
                value += 128;
                break;
            case ValueType.C:
                value = -value;
                break;
            case ValueType.S:
                value = 128 - value;
                break;
            case ValueType.STANDARD:
                break;
        }
        this.buffers.writeUInt8(value);
        return this;
    };
    PacketBuilder.prototype.putShort = function (value, type, order) {
        if (type === void 0) { type = ValueType.STANDARD; }
        if (order === void 0) { order = ByteOrder_1.ByteOrder.BIG; }
        switch (order) {
            case ByteOrder_1.ByteOrder.BIG:
                this.put(value >> 8);
                this.puts(value, type);
                break;
            case ByteOrder_1.ByteOrder.MIDDLE:
                throw new Error("Middle-endian short is impossible!");
            case ByteOrder_1.ByteOrder.INVERSE_MIDDLE:
                throw new Error("Inverse-middle-endian short is impossible!");
            case ByteOrder_1.ByteOrder.LITTLE:
                this.puts(value, type);
                this.put(value >> 8);
                break;
            case ByteOrder_1.ByteOrder.TRIPLE_INT:
                throw new Error("TRIPLE_INT short not added!");
        }
        return this;
    };
    PacketBuilder.prototype.writePutShorts = function (value) {
        return this.putShort(value, ValueType.STANDARD, ByteOrder_1.ByteOrder.BIG);
    };
    PacketBuilder.prototype.putShorts = function (value, order) {
        return this.putShort(value, ValueType.STANDARD, order);
    };
    PacketBuilder.prototype.putInts = function (value, type, order) {
        switch (order) {
            case ByteOrder_1.ByteOrder.BIG:
                this.put(value >> 24);
                this.put(value >> 16);
                this.put(value >> 8);
                this.puts(value, type);
                break;
            case ByteOrder_1.ByteOrder.MIDDLE:
                this.put(value >> 8);
                this.puts(value, type);
                this.put(value >> 24);
                this.put(value >> 16);
                break;
            case ByteOrder_1.ByteOrder.INVERSE_MIDDLE:
                this.put(value >> 16);
                this.put(value >> 24);
                this.puts(value, type);
                this.put(value >> 8);
                break;
            case ByteOrder_1.ByteOrder.LITTLE:
                this.puts(value, type);
                this.put(value >> 8);
                this.put(value >> 16);
                this.put(value >> 24);
                break;
            case ByteOrder_1.ByteOrder.TRIPLE_INT:
                this.put((value >> 16));
                this.put((value >> 8));
                this.put(value);
                break;
        }
        return this;
    };
    PacketBuilder.prototype.putInteger = function (value) {
        this.putInts(value, ValueType.STANDARD, ByteOrder_1.ByteOrder.BIG);
        return this;
    };
    PacketBuilder.prototype.putIntegers = function (value, type) {
        this.putInts(value, type, ByteOrder_1.ByteOrder.BIG);
        return this;
    };
    PacketBuilder.prototype.putsInt = function (value, order) {
        this.putInts(value, ValueType.STANDARD, order);
        return this;
    };
    PacketBuilder.prototype.putsLong = function (value, type, order) {
        if (type === void 0) { type = ValueType.STANDARD; }
        if (order === void 0) { order = ByteOrder_1.ByteOrder.BIG; }
        switch (order) {
            case ByteOrder_1.ByteOrder.BIG:
                this.put((value >> 56));
                this.put((value >> 48));
                this.put((value >> 40));
                this.put((value >> 32));
                this.put((value >> 24));
                this.put((value >> 16));
                this.put((value >> 8));
                this.puts(value, type);
                break;
            case ByteOrder_1.ByteOrder.MIDDLE:
                throw new Error("Middle-endian long is not implemented!");
            case ByteOrder_1.ByteOrder.INVERSE_MIDDLE:
                throw new Error("Inverse-middle-endian long is not implemented!");
            case ByteOrder_1.ByteOrder.TRIPLE_INT:
                throw new Error("triple-int long is not implemented!");
            case ByteOrder_1.ByteOrder.LITTLE:
                this.puts(value, type);
                this.put((value >> 8));
                this.put((value >> 16));
                this.put((value >> 24));
                this.put((value >> 32));
                this.put((value >> 40));
                this.put((value >> 48));
                this.put((value >> 56));
                break;
        }
        return this;
    };
    PacketBuilder.prototype.putLong = function (value, type, order) {
        if (type === void 0) { type = ValueType.STANDARD; }
        if (order === void 0) { order = ByteOrder_1.ByteOrder.BIG; }
        switch (order) {
            case ByteOrder_1.ByteOrder.BIG:
                this.put((value >> 56));
                this.put((value >> 48));
                this.put((value >> 40));
                this.put((value >> 32));
                this.put((value >> 24));
                this.put((value >> 16));
                this.put((value >> 8));
                this.puts((value), type);
                break;
            case ByteOrder_1.ByteOrder.MIDDLE:
                throw new Error("Middle-endian long " + "is not implemented!");
            case ByteOrder_1.ByteOrder.INVERSE_MIDDLE:
                throw new Error("Inverse-middle-endian long is not implemented!");
            case ByteOrder_1.ByteOrder.TRIPLE_INT:
                throw new Error("triple-int long is not implemented!");
            case ByteOrder_1.ByteOrder.LITTLE:
                this.puts((value), type);
                this.put((value >> 8));
                this.put((value >> 16));
                this.put((value >> 24));
                this.put((value >> 32));
                this.put((value >> 40));
                this.put((value >> 48));
                this.put((value >> 56));
                break;
        }
        return this;
    };
    PacketBuilder.prototype.putString = function (string) {
        var e_1, _a;
        if (string == null) {
            string = "unknown";
        }
        var encoder = new TextEncoder();
        var byteArray = encoder.encode(string);
        try {
            for (var byteArray_1 = __values(byteArray), byteArray_1_1 = byteArray_1.next(); !byteArray_1_1.done; byteArray_1_1 = byteArray_1.next()) {
                var value = byteArray_1_1.value;
                this.put(value);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (byteArray_1_1 && !byteArray_1_1.done && (_a = byteArray_1.return)) _a.call(byteArray_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        this.put(10);
        return this;
    };
    /**
     * Gets the packet's opcode.
     *
     * @return the packets opcode.
     */
    PacketBuilder.prototype.getOpcode = function () {
        return this.opcode;
    };
    /**
     * Gets the packet's size.
     *
     * @return the packets size.
     */
    PacketBuilder.prototype.getSize = function () {
        return this.buffers.length;
    };
    /**
     * Gets the backing byte buffer used to read and write data.
     *
     * @return the backing byte buffer.
     */
    PacketBuilder.prototype.buffer = function () {
        return this.buffer;
    };
    PacketBuilder.prototype.getBuffer = function () {
        return this._buffer;
    };
    /**
     * Creates the actual packet from this builder
     *
     * @return
     */
    PacketBuilder.prototype.toPacket = function () {
        return new Packet_1.Packet(this.opcode, this.type, this.buffers);
    };
    PacketBuilder.prototype.getType = function () {
        return this.type;
    };
    PacketBuilder.BIT_MASK = [0, 0x1, 0x3, 0x7, 0xf, 0x1f, 0x3f, 0x7f, 0xff, 0x1ff, 0x3ff, 0x7ff, 0xfff, 0x1fff, 0x3fff,
        0x7fff, 0xffff, 0x1ffff, 0x3ffff, 0x7ffff, 0xfffff, 0x1fffff, 0x3fffff, 0x7fffff, 0xffffff, 0x1ffffff, 0x3ffffff, 0x7ffffff,
        0xfffffff, 0x1fffffff, 0x3fffffff, 0x7fffffff, -1];
    return PacketBuilder;
}());
exports.PacketBuilder = PacketBuilder;
//# sourceMappingURL=PacketBuilder.js.map