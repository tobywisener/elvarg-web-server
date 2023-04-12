import { PacketType } from './PacketType';
import { ByteOrder } from './ByteOrder';
import { Packet } from './Packet';


export enum ValueType {
    A,
    C,
    S,
    STANDARD
}

export enum AccessType {
    BIT,
    BYTE,
}

export class PacketBuilder {
    public static BIT_MASK = [0, 0x1, 0x3, 0x7, 0xf, 0x1f, 0x3f, 0x7f, 0xff, 0x1ff, 0x3ff, 0x7ff, 0xfff, 0x1fff, 0x3fff,
        0x7fff, 0xffff, 0x1ffff, 0x3ffff, 0x7ffff, 0xfffff, 0x1fffff, 0x3fffff, 0x7fffff, 0xffffff, 0x1ffffff, 0x3ffffff, 0x7ffffff,
        0xfffffff, 0x1fffffff, 0x3fffffff, 0x7fffffff, -1];
    private opcode: number;
    private type: PacketType;
    private bitPosition: number;
    private buffers = Buffer.alloc(10);

    constructor(opcodeOrType?: number | PacketType, type?: PacketType) {
        if (typeof opcodeOrType === 'number') {
            this.opcode = opcodeOrType;
            this.type = type ?? PacketType.FIXED;
        } else {
            this.opcode = -1;
            this.type = PacketType.FIXED;
        }
    }

    public writeBuffer(buffer: string): PacketBuilder {
        this.buffers.write(buffer);
        return this;
    }

    public writePutBytes(buffer: string): PacketBuilder {
        this.buffers.write(buffer);
        return this;
    }

    public putBytesReverse(data: Uint8Array): PacketBuilder {
        for (let i = data.length - 1; i >= 0; i--) {
            this.put(data[i]);
        }
        return this;
    }

    public writeByteArray(bytes: string): PacketBuilder {
        this.buffers.write(bytes);
        return this;
    }


    public writePutBits(numBits: number, value: number): PacketBuilder {
        if (!this.buffers.buffer) {
            throw new Error("The ByteBuf implementation must support array() for bit usage.");
        }
        let buffer = this.buffers.buffer;

        let bytePos = this.bitPosition >> 3;
        let bitOffset = 8 - (this.bitPosition & 7);
        this.bitPosition += numBits;

        for (; numBits > bitOffset; bitOffset = 8) {
            buffer[bytePos] &= ~PacketBuilder.BIT_MASK[bitOffset];
            buffer[bytePos++] |= (value >> (numBits - bitOffset)) & PacketBuilder.BIT_MASK[bitOffset];
            numBits -= bitOffset;
        }
        if (numBits == bitOffset) {
            buffer[bytePos] &= ~PacketBuilder.BIT_MASK[bitOffset];
            buffer[bytePos] |= value & PacketBuilder.BIT_MASK[bitOffset];
        } else {
            buffer[bytePos] &= ~(PacketBuilder.BIT_MASK[numBits] << (bitOffset - numBits));
            buffer[bytePos] |= (value & PacketBuilder.BIT_MASK[numBits]) << (bitOffset - numBits);
        }
        return this;
    }

    public putsBit(flag: boolean) {
        this.putBits(1, flag ? 1 : 0);
        return this;
    }

    public initializesAccess(type: AccessType) {
        switch (type) {
            case AccessType.BIT:
                this.bitPosition = this.buffers.length * 8;
                break;
            case AccessType.BYTE:
                this.buffers.writeUInt32BE((this.bitPosition + 7) / 8);
                break;
        }
        return this;
    }

    public put(value: number): PacketBuilder {
        this.puts(value, ValueType.STANDARD);
        return this;
    }

    public putsShort(value: number, type: ValueType, order: ByteOrder): PacketBuilder {
        switch (order) {
            case ByteOrder.BIG:
                this.put(value >> 8);
                this.puts(value, type);
                break;
            case ByteOrder.MIDDLE:
                throw new Error("Middle-endian short is impossible!");
            case ByteOrder.INVERSE_MIDDLE:
                throw new Error("Inverse-middle-endian short is impossible!");
            case ByteOrder.LITTLE:
                this.puts(value, type);
                this.put(value >> 8);
                break;
            case ByteOrder.TRIPLE_INT:
                throw new Error("TRIPLE_INT short not added!");
        }
        return this;
    }

    public putTypeInt(value: number, type: ValueType = ValueType.STANDARD, order: ByteOrder = ByteOrder.BIG): PacketBuilder {
        switch (order) {
            case ByteOrder.BIG:
                this.put((value >> 24));
                this.put((value >> 16));
                this.put((value >> 8));
                this.puts(value, type);
                break;
            case ByteOrder.MIDDLE:
                this.put((value >> 8));
                this.puts(value, type);
                this.put((value >> 24));
                this.put((value >> 16));
                break;
            case ByteOrder.INVERSE_MIDDLE:
                this.put((value >> 16));
                this.put((value >> 24));
                this.puts(value, type);
                this.put((value >> 8));
                break;
            case ByteOrder.LITTLE:
                this.puts(value, type);
                this.put((value >> 8));
                this.put((value >> 16));
                this.put((value >> 24));
                break;
            case ByteOrder.TRIPLE_INT:
                this.put((value >> 16));
                this.put((value >> 8));
                this.put(value);
                break;
        }
        return this;
    }

    public putInt(value: number): PacketBuilder {
        this.putInts(value, ValueType.STANDARD, ByteOrder.BIG);
        return this;
    }

    putBytes(from: Buffer): PacketBuilder {
        for (let i = 0; i < from.length; i++) {
            this.put(from.readInt8(i));
        }
        return this;
    }

    public putsBytes(from: string): PacketBuilder {
        this.buffers.write(from);
        return this;
    }

    public writeByteArrays(bytes: string, offset: number, length: number): PacketBuilder {
        this.buffers.write(bytes, offset, length);
        return this;
    }

    public writeBytesArray(bytes: string): PacketBuilder {
        this.buffers.write(bytes);
        return this;
    }

    public putBits(numBits: number, value: number): PacketBuilder {
        if (!this.buffers.buffer) {
            throw new Error("The ByteBuf implementation must support array() for bit usage.");
        }
        let buffer = this.buffers.buffer;

        let bytePos: number = this.bitPosition >> 3;
        let bitOffset: number = 8 - (this.bitPosition & 7);
        this.bitPosition += numBits;

        for (; numBits > bitOffset; bitOffset = 8) {
            buffer[bytePos] &= PacketBuilder.BIT_MASK[bitOffset];
            buffer[bytePos++] |= (value >> (numBits - bitOffset)) & PacketBuilder.BIT_MASK[bitOffset];
            numBits -= bitOffset;
        }

        if (numBits === bitOffset) {
            buffer[bytePos] &= PacketBuilder.BIT_MASK[bitOffset];
            buffer[bytePos] |= value & PacketBuilder.BIT_MASK[bitOffset];
        } else {
            buffer[bytePos] &= ~(PacketBuilder.BIT_MASK[numBits] << (bitOffset - numBits));
            buffer[bytePos] |= (value & PacketBuilder.BIT_MASK[numBits] << (bitOffset - numBits));
            buffer[bytePos] |= (value & PacketBuilder.BIT_MASK[numBits]) << (bitOffset - numBits);
        }
        return this;
    }

    public initializeAccess(type: AccessType) {
        switch (type) {
            case AccessType.BIT:
                this.bitPosition = this.buffers.length * 8;
                break;
            case AccessType.BYTE:
                this.buffers.writeUInt32BE((this.bitPosition + 7) / 8);
                break;
        }
        return this;
    }

    public putBit(flag: boolean) {
        this.putBits(1, flag ? 1 : 0);
        return this;
    }

    public puts(value: number, type: ValueType) {
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
        this.buffers.writeUInt8(value as any);
        return this;
    }

    public putShort(value: number, type: ValueType = ValueType.STANDARD, order: ByteOrder = ByteOrder.BIG): this {
        switch (order) {
            case ByteOrder.BIG:
                this.put(value >> 8);
                this.puts(value, type);
                break;
            case ByteOrder.MIDDLE:
                throw new Error("Middle-endian short is impossible!");
            case ByteOrder.INVERSE_MIDDLE:
                throw new Error("Inverse-middle-endian short is impossible!");
            case ByteOrder.LITTLE:
                this.puts(value, type);
                this.put(value >> 8);
                break;
            case ByteOrder.TRIPLE_INT:
                throw new Error("TRIPLE_INT short not added!");
        }
        return this;
    }

    public writePutShorts(value: number): this {
        return this.putShort(value, ValueType.STANDARD, ByteOrder.BIG);
    }

    public putShorts(value: number, order: ByteOrder): PacketBuilder {
        return this.putShort(value, ValueType.STANDARD, order);
    }

    public putInts(value: number, type: ValueType, order: ByteOrder): PacketBuilder {
        switch (order) {
            case ByteOrder.BIG:
                this.put(value >> 24);
                this.put(value >> 16);
                this.put(value >> 8);
                this.puts(value, type);
                break;
            case ByteOrder.MIDDLE:
                this.put(value >> 8);
                this.puts(value, type);
                this.put(value >> 24);
                this.put(value >> 16);
                break;
            case ByteOrder.INVERSE_MIDDLE:
                this.put(value >> 16);
                this.put(value >> 24);
                this.puts(value, type);
                this.put(value >> 8);
                break;
            case ByteOrder.LITTLE:
                this.puts(value, type);
                this.put(value >> 8);
                this.put(value >> 16);
                this.put(value >> 24);
                break;
            case ByteOrder.TRIPLE_INT:
                this.put((value >> 16));
                this.put((value >> 8));
                this.put(value);
                break;
        }
        return this;
    }

    public putInteger(value: number): this {
        this.putInts(value, ValueType.STANDARD, ByteOrder.BIG);
        return this;
    }

    public putIntegers(value: number, type: ValueType): this {
        this.putInts(value, type, ByteOrder.BIG);
        return this;
    }

    public putsInt(value: number, order: ByteOrder): this {
        this.putInts(value, ValueType.STANDARD, order);
        return this;
    }

    public putsLong(value: number, type: ValueType = ValueType.STANDARD, order: ByteOrder = ByteOrder.BIG) {
        switch (order) {
            case ByteOrder.BIG:
                this.put((value >> 56) as number);
                this.put((value >> 48) as number);
                this.put((value >> 40) as number);
                this.put((value >> 32) as number);
                this.put((value >> 24) as number);
                this.put((value >> 16) as number);
                this.put((value >> 8) as number);
                this.puts(value as number, type);
                break;
            case ByteOrder.MIDDLE:
                throw new Error("Middle-endian long is not implemented!");
            case ByteOrder.INVERSE_MIDDLE:
                throw new Error("Inverse-middle-endian long is not implemented!");
            case ByteOrder.TRIPLE_INT:
                throw new Error("triple-int long is not implemented!");
            case ByteOrder.LITTLE:
                this.puts(value as number, type);
                this.put((value >> 8) as number);
                this.put((value >> 16) as number);
                this.put((value >> 24) as number);
                this.put((value >> 32) as number);
                this.put((value >> 40) as number);
                this.put((value >> 48) as number);
                this.put((value >> 56) as number);
                break;
        }
        return this;
    }

    public putLong(value: number, type: ValueType = ValueType.STANDARD, order: ByteOrder = ByteOrder.BIG): PacketBuilder {
        switch (order) {
            case ByteOrder.BIG:
                this.put((value >> 56) as number);
                this.put((value >> 48) as number);
                this.put((value >> 40) as number);
                this.put((value >> 32) as number);
                this.put((value >> 24) as number);
                this.put((value >> 16) as number);
                this.put((value >> 8) as number);
                this.puts((value) as number, type);
                break;
            case ByteOrder.MIDDLE:
                throw new Error("Middle-endian long " + "is not implemented!");
            case ByteOrder.INVERSE_MIDDLE:
                throw new Error("Inverse-middle-endian long is not implemented!");
            case ByteOrder.TRIPLE_INT:
                throw new Error("triple-int long is not implemented!");
            case ByteOrder.LITTLE:
                this.puts((value) as number, type);
                this.put((value >> 8) as number);
                this.put((value >> 16) as number);
                this.put((value >> 24) as number);
                this.put((value >> 32) as number);
                this.put((value >> 40) as number);
                this.put((value >> 48) as number);
                this.put((value >> 56) as number);
                break;
        }
        return this;
    }

    public putString(string: string) {
        if (string == null) {
            string = "unknown";
        }
        const encoder = new TextEncoder();
        const byteArray = encoder.encode(string);
        for (let value of byteArray) {
            this.put(value);
        }
        this.put(10);
        return this;
    }

    /**
     * Gets the packet's opcode.
     *
     * @return the packets opcode.
     */
    public getOpcode(): number {
        return this.opcode;
    }

    /**
     * Gets the packet's size.
     *
     * @return the packets size.
     */
    public getSize(): number {
        return this.buffers.length;
    }

    /**
     * Gets the backing byte buffer used to read and write data.
     *
     * @return the backing byte buffer.
     */
    public buffer() {
        return this.buffer;
    }

    private _buffer: Buffer = Buffer.from('my string', 'utf-8');

    public getBuffer(): Buffer {
        return this._buffer;
    }

    /**
     * Creates the actual packet from this builder
     *
     * @return
     */
    public toPacket() {
        return new Packet(this.opcode, this.type, this.buffers);
    }

    public getType(): PacketType {
        return this.type;
    }
}
