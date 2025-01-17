"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ByteBuffer = exports.ByteBuffers = void 0;
var ByteBuffers = /** @class */ (function () {
    function ByteBuffers() {
    }
    ByteBuffers.RSA_MODULUS = BigInt("131409501542646890473421187351592645202876910715283031445708554322032707707649791604685616593680318619733794036379235220188001221437267862925531863675607742394687835827374685954437825783807190283337943749605737918856262761566146702087468587898515768996741636870321689974105378482179138088453912399137944888201");
    ByteBuffers.RSA_EXPONENT = BigInt("65537");
    ByteBuffers.pkt_opcode_slot = 0;
    ByteBuffers.pkt_size_slot = 1;
    ByteBuffers.pkt_content_start = 2;
    ByteBuffers.BIT_CONSTANTS = [
        0, 1, 3, 7, 15, 31, 63, 127, 255, 511, 1023, 2047, 4095, 8191, 16383, 32767,
        65535, 0x1ffff, 0x3ffff, 0x7ffff, 0xfffff, 0x1fffff, 0x3fffff, 0x7fffff,
        0xffffff, 0x1ffffff, 0x3ffffff, 0x7ffffff, 0xfffffff, 0x1fffffff,
        0x3fffffff, 0x7fffffff, -1,
    ];
    return ByteBuffers;
}());
exports.ByteBuffers = ByteBuffers;
var ByteBuffer = /** @class */ (function () {
    function ByteBuffer(buffer) {
        this.buffer = buffer;
    }
    ByteBuffer.create = function (size, reserve_packet_slots, cipher) {
        var stream_1 = new ByteBuffer([0]);
        stream_1.buffer = new Array(size);
        stream_1.reserve_packet_slots = reserve_packet_slots;
        stream_1.size = size;
        stream_1.position = reserve_packet_slots
            ? ByteBuffer.pkt_content_start
            : ByteBuffer.pkt_opcode_slot;
        stream_1.cipher = cipher;
        return stream_1;
    };
    ByteBuffer.prototype.reset = function (reserve_packet_slots) {
        this.buffer = new Array(this.size);
        this.reserve_packet_slots = reserve_packet_slots;
        this.position = reserve_packet_slots
            ? ByteBuffer.pkt_content_start
            : ByteBuffer.pkt_opcode_slot;
    };
    ByteBuffer.prototype.encryptRSAContent = function () {
        /* Cache the current position for future use */
        var currentPosition = this.position;
        /* Reset the position */
        this.position = this.reserve_packet_slots
            ? ByteBuffer.pkt_content_start
            : ByteBuffer.pkt_opcode_slot;
        /* An empty byte array with a capacity of {@code #currentPosition} bytes */
        var decodeBuffer = new Uint8Array(currentPosition);
        /*
         * Gets bytes up to the current position from the buffer and populates
         * the {@code #decodeBuffer}
         */
        this.getBytes(currentPosition, 0, decodeBuffer);
        /*
         * The decoded big integer which translates the {@code #decodeBuffer}
         * into a {@link BigInteger}
         */
        var decodedBigInteger = BigInt(decodeBuffer.toString());
        /*
         * This is going to be a mouthful... the encoded {@link BigInteger} is
         * responsible of returning a value which is the value of {@code
         * #decodedBigInteger}^{@link #RSA_EXPONENT} mod (Modular arithmetic can
         * be handled mathematically by introducing a congruence relation on the
         * integers that is compatible with the operations of the ring of
         * integers: addition, subtraction, and multiplication. For a positive
         * integer n, two integers a and b are said to be congruent modulo n)
         * {@link #RSA_MODULES}
         */
        // let encodedBigInteger = decodedBigInteger.modPow(ByteBuffers.RSA_EXPONENT, ByteBuffers.RSA_MODULUS);
        /*
         * Returns the value of the {@code #encodedBigInteger} translated to a
         * byte array in big-endian byte-order
         */
        // let encodedBuffer = encodedBigInteger.toArray();
        /* Reset the position so we can write fresh to the buffer */
        this.position = this.reserve_packet_slots
            ? ByteBuffer.pkt_content_start
            : ByteBuffer.pkt_opcode_slot;
        /*
         * We put the length of the {@code #encodedBuffer} to the buffer as a
         * standard byte. (Ignore the naming, that really writes a byte...)
         */
        // this.putByte(encodedBuffer.length);
        /* Put the bytes of the {@code #encodedBuffer} into the buffer. */
        // this.putBytes(encodedBuffer, encodedBuffer.length, 0);
    };
    ByteBuffer.prototype.finishBitAccess = function () {
        this.position = Math.floor((this.position + 7) / 8);
    };
    ByteBuffer.prototype.getBits = function (bitLength) {
        var k = this.position >> 3;
        var l = 8 - (this.position & 7);
        var i1 = 0;
        this.position += bitLength;
        for (; bitLength > l; l = 8) {
            i1 +=
                (this.buffer[k++] & ByteBuffers.BIT_CONSTANTS[l]) << (bitLength - l);
            bitLength -= l;
        }
        if (bitLength == l) {
            i1 += this.buffer[k] & ByteBuffers.BIT_CONSTANTS[l];
        }
        else {
            i1 +=
                (this.buffer[k] >> (l - bitLength)) &
                    ByteBuffers.BIT_CONSTANTS[bitLength];
        }
        return i1;
    };
    ByteBuffer.prototype.getByte = function (value) {
        this.buffer[this.position++] = value;
    };
    ByteBuffer.prototype.getsBytes = function () {
        var pos = this.position;
        while (this.buffer[this.position++] !== 10) { }
        var buf = new Uint8Array(this.position - pos - 1);
        buf.set(this.buffer.slice(pos, this.position - 1));
        return buf;
    };
    ByteBuffer.prototype.getBytes = function (len, off, dest) {
        for (var i = off; i < off + len; i++) {
            dest[i] = this.buffer[this.position++];
        }
    };
    ByteBuffer.prototype.getInt = function () {
        this.position += 4;
        return (((this.buffer[this.position - 4] & 0xff) << 24) +
            ((this.buffer[this.position - 3] & 0xff) << 16) +
            ((this.buffer[this.position - 2] & 0xff) << 8) +
            (this.buffer[this.position - 1] & 0xff));
    };
    ByteBuffer.prototype.getIntLittleEndian = function () {
        this.position += 4;
        return (((this.buffer[this.position - 4] & 0xff) << 24) +
            ((this.buffer[this.position - 3] & 0xff) << 16) +
            ((this.buffer[this.position - 2] & 0xff) << 8) +
            (this.buffer[this.position - 1] & 0xff));
    };
    ByteBuffer.prototype.getLong = function () {
        var LONG_MASK = 0xffffffff;
        var msw = this.getIntLittleEndian() & LONG_MASK;
        var lsw = this.getIntLittleEndian() & LONG_MASK;
        return (msw << 32) | lsw;
    };
    ByteBuffer.prototype.getShort2 = function () {
        this.position += 2;
        var i = ((this.buffer[this.position - 2] & 0xff) << 8) +
            (this.buffer[this.position - 1] & 0xff);
        if (i > 60000) {
            i = -65535 + i;
        }
        return i;
    };
    ByteBuffer.prototype.getShortBigEndian = function () {
        this.position += 2;
        return (((this.buffer[this.position - 1] & 0xff) << 8) +
            (this.buffer[this.position - 2] & 0xff));
    };
    ByteBuffer.prototype.getShortBigEndianA = function () {
        this.position += 2;
        return (((this.buffer[this.position - 1] & 0xff) << 8) +
            ((this.buffer[this.position - 2] - 128) & 0xff));
    };
    ByteBuffer.prototype.getSignedByte = function () {
        return this.buffer[this.position++];
    };
    ByteBuffer.prototype.getSignedShort = function () {
        this.position += 2;
        var value = ((this.buffer[this.position - 2] & 0xff) << 8) +
            (this.buffer[this.position - 1] & 0xff);
        if (value > 32767) {
            value -= 0x10000;
        }
        return value;
    };
    ByteBuffer.prototype.getSmart = function () {
        try {
            // checks current without modifying position
            if (this.position >= this.buffer.length) {
                return this.buffer[this.buffer.length - 1] & 0xff;
            }
            var value = this.buffer[this.position] & 0xff;
            if (value < 128) {
                return this.getUnsignedByte();
            }
            else {
                return this.getUnsignedShort() - 32768;
            }
        }
        catch (e) {
            console.error(e);
            return this.getUnsignedShort() - 32768;
        }
    };
    ByteBuffer.prototype.getString = function () {
        var i = this.position;
        while (this.buffer[this.position++] != 10) { }
        return new TextDecoder().decode(new Uint8Array(this.buffer.slice(i, this.position - 1)));
    };
    ByteBuffer.prototype.getTribytes = function () {
        this.position += 3;
        return (((this.buffer[this.position - 3] & 0xff) << 16) +
            ((this.buffer[this.position - 2] & 0xff) << 8) +
            (this.buffer[this.position - 1] & 0xff));
    };
    ByteBuffer.prototype.getTribyte = function (value) {
        this.position += 3;
        return ((0xff & (this.buffer[this.position - 3] << 16)) +
            (0xff & (this.buffer[this.position - 2] << 8)) +
            (0xff & this.buffer[this.position - 1]));
    };
    ByteBuffer.prototype.getUnsignedByte = function () {
        if (this.position + 1 > this.buffer.length) {
            this.position = this.buffer.length - 2;
        }
        return this.buffer[this.position++] & 0xff;
    };
    ByteBuffer.prototype.getUnsignedShort = function () {
        if (this.position + 2 > this.buffer.length) {
            return this.buffer[this.buffer.length - 1];
        }
        this.position += 2;
        return (((this.buffer[this.position - 2] & 0xff) << 8) +
            (this.buffer[this.position - 1] & 0xff));
    };
    ByteBuffer.prototype.getUSmart2 = function () {
        var baseVal = 0;
        var lastVal = 0;
        while ((lastVal = this.getSmart()) == 32767) {
            baseVal += 32767;
        }
        return baseVal + lastVal;
    };
    ByteBuffer.prototype.initBitAccess = function () {
        this.position = this.position << 3;
    };
    ByteBuffer.prototype.method400 = function (value) {
        this.buffer[this.position++] = value & 0xff;
        this.buffer[this.position++] = (value >> 8);
    };
    ByteBuffer.prototype.method403 = function (value) {
        this.buffer[this.position++] = value & 0xff;
        this.buffer[this.position++] = (value >> 8);
        this.buffer[this.position++] = (value >> 16);
        this.buffer[this.position++] = (value >> 24);
    };
    ByteBuffer.prototype.method421 = function () {
        var i = this.buffer[this.position] & 0xff;
        if (i < 128) {
            return this.getUnsignedByte() - 64;
        }
        else {
            return this.getUnsignedShort() - 49152;
        }
    };
    ByteBuffer.prototype.method424 = function (i) {
        this.buffer[this.position++] = i & 0xff;
    };
    ByteBuffer.prototype.method425 = function (j) {
        this.buffer[this.position++] = j & 0xff;
    };
    ByteBuffer.prototype.method426 = function () {
        return (this.buffer[this.position++] - 128) & 0xff;
    };
    ByteBuffer.prototype.method427 = function () {
        return -this.buffer[this.position++] & 0xff;
    };
    ByteBuffer.prototype.getByteA = function () {
        this.position += 2;
        return (((this.buffer[this.position - 2] & 0xff) << 8) +
            ((this.buffer[this.position - 1] - 128) & 0xff));
    };
    ByteBuffer.prototype.method428 = function () {
        return (128 - this.buffer[this.position++]) & 0xff;
    };
    ByteBuffer.prototype.method429 = function () {
        return -this.buffer[this.position++];
    };
    ByteBuffer.prototype.method430 = function () {
        return 128 - this.buffer[this.position++];
    };
    ByteBuffer.prototype.writeUnsignedWordBigEndian = function (i) {
        this.buffer[this.position++] = i & 0xff;
        this.buffer[this.position++] = (i >> 8);
    };
    ByteBuffer.prototype.writeUnsignedWordA = function (j) {
        this.buffer[this.position++] = (j >> 8);
        this.buffer[this.position++] = (j + 128);
    };
    ByteBuffer.prototype.writeSignedBigEndian = function (j) {
        this.buffer[this.position++] = (j + 128);
        this.buffer[this.position++] = (j >> 8);
    };
    ByteBuffer.prototype.method435 = function () {
        this.position += 2;
        return (((this.buffer[this.position - 2] & 0xff) << 8) +
            ((this.buffer[this.position - 1] - 128) & 0xff));
    };
    ByteBuffer.prototype.method437 = function () {
        this.position += 2;
        var j = ((this.buffer[this.position - 1] & 0xff) << 8) +
            (this.buffer[this.position - 2] & 0xff);
        if (j > 32767) {
            j -= 0x10000;
        }
        return j;
    };
    ByteBuffer.prototype.method438 = function () {
        this.position += 2;
        var j = ((this.buffer[this.position - 1] & 0xff) << 8) +
            ((this.buffer[this.position - 2] - 128) & 0xff);
        if (j > 32767) {
            j -= 0x10000;
        }
        return j;
    };
    ByteBuffer.prototype.method439 = function () {
        this.position += 4;
        return (((this.buffer[this.position - 2] & 0xff) << 24) +
            ((this.buffer[this.position - 1] & 0xff) << 16) +
            ((this.buffer[this.position - 4] & 0xff) << 8) +
            (this.buffer[this.position - 3] & 0xff));
    };
    ByteBuffer.prototype.method440 = function () {
        this.position += 4;
        return (((this.buffer[this.position - 3] & 0xff) << 24) +
            ((this.buffer[this.position - 4] & 0xff) << 16) +
            ((this.buffer[this.position - 1] & 0xff) << 8) +
            (this.buffer[this.position - 2] & 0xff));
    };
    ByteBuffer.prototype.method441 = function (i, abyte0, j) {
        for (var k = i + j - 1; k >= i; k--) {
            this.buffer[this.position++] = (abyte0[k] + 128);
        }
    };
    ByteBuffer.prototype.method442 = function (i, j, abyte0) {
        for (var k = j + i - 1; k >= j; k--) {
            abyte0[k] = this.buffer[this.position++];
        }
    };
    ByteBuffer.prototype.putBytes = function (tmp, len, off) {
        for (var i = off; i < off + len; i++) {
            this.buffer[this.position++] = tmp[i];
        }
    };
    ByteBuffer.prototype.putDWordBigEndian = function (value) {
        this.buffer[this.position++] = (value >> 16);
        this.buffer[this.position++] = (value >> 8);
        this.buffer[this.position++] = value;
    };
    ByteBuffer.prototype.putInt = function (i) {
        this.buffer[this.position++] = (i >> 24);
        this.buffer[this.position++] = (i >> 16);
        this.buffer[this.position++] = (i >> 8);
        this.buffer[this.position++] = i;
    };
    ByteBuffer.prototype.putLong = function (value) {
        try {
            this.buffer[this.position++] = (value >> 56);
            this.buffer[this.position++] = (value >> 48);
            this.buffer[this.position++] = (value >> 40);
            this.buffer[this.position++] = (value >> 32);
            this.buffer[this.position++] = (value >> 24);
            this.buffer[this.position++] = (value >> 16);
            this.buffer[this.position++] = (value >> 8);
            this.buffer[this.position++] = value;
        }
        catch (error) {
            throw new Error();
        }
    };
    ByteBuffer.prototype.putOpcode = function (i) {
        this.buffer[this.reserve_packet_slots ? ByteBuffer.pkt_opcode_slot : this.position++] = (i + this.cipher.nextInt());
    };
    ByteBuffer.prototype.putShort = function (value) {
        this.buffer[this.position++] = (value >> 8);
        this.buffer[this.position++] = value;
    };
    ByteBuffer.prototype.putString = function (s) {
        var _this = this;
        var tempBuffer = new Uint8Array(s.length);
        for (var i = 0; i < s.length; i++) {
            tempBuffer[i] = s.charCodeAt(i);
        }
        tempBuffer.forEach(function (char, index) {
            _this.buffer[_this.position + index] = char;
        });
        this.position += s.length;
        this.buffer[this.position++] = 10;
    };
    ByteBuffer.prototype.putVariableSizeByte = function (size) {
        this.buffer[this.position - size - 1] = size;
    };
    ByteBuffer.prototype.putByte = function (i) {
        this.buffer[this.position++] = i;
    };
    ByteBuffer.prototype.getBitPosition = function () {
        return this.position;
    };
    ByteBuffer.prototype.getCipher = function () {
        return this.cipher;
    };
    ByteBuffer.prototype.setCipher = function (cipher) {
        this.cipher = cipher;
    };
    ByteBuffer.prototype.getBuffer = function () {
        return new Uint8Array(this.buffer);
    };
    ByteBuffer.prototype.bufferLength = function () {
        var size = this.position;
        if (this.reserve_packet_slots) {
            this.buffer[ByteBuffer.pkt_size_slot] = (size +
                this.cipher.nextInt());
        }
        return size;
    };
    ByteBuffer.prototype.resetPosition = function () {
        this.position = this.reserve_packet_slots
            ? ByteBuffer.pkt_content_start
            : ByteBuffer.pkt_opcode_slot;
    };
    ByteBuffer.prototype.getPosition = function () {
        return this.position;
    };
    ByteBuffer.pkt_opcode_slot = 0;
    ByteBuffer.pkt_size_slot = 1;
    ByteBuffer.pkt_content_start = 2;
    return ByteBuffer;
}());
exports.ByteBuffer = ByteBuffer;
//# sourceMappingURL=ByteBuffer.js.map