export class Buffer {
    public offset: number;
    private buffer: Uint8Array;

    constructor(buffer: Uint8Array) {
        this.buffer = buffer;
        this.offset = 0;
    }

    public skip(length: number) {
        this.offset += length;
    }

    public setOffset(location: number) {
        this.offset = location;
    }

    public length(): number {
        return this.buffer.length;
    }

    public readSignedByte(): number {
        return this.buffer[this.offset++];
    }

    public readUnsignedByte(): number {
        return this.buffer[this.offset++] & 0xff;
    }

    public getShort(): number {
        let val = (this.readSignedByte() << 8) + this.readSignedByte();
        if (val > 32767) {
            val -= 0x10000;
        }
        return val;
    }

    public readUShort(): number {
        return (this.readUnsignedByte() << 8) + this.readUnsignedByte();
    }

    public getInt(): number {
        return (this.readUnsignedByte() << 24) + (this.readUnsignedByte() << 16) + (this.readUnsignedByte() << 8) + this.readUnsignedByte();
    }

    public getLong(): bigint {
        return BigInt((this.readUnsignedByte() << 56) + (this.readUnsignedByte() << 48) + (this.readUnsignedByte() << 40) + (this.readUnsignedByte() << 32) + (this.readUnsignedByte() << 24) + (this.readUnsignedByte() << 16) + (this.readUnsignedByte() << 8) + this.readUnsignedByte());
    }

    public readUnsignedWord(): number {
        this.offset += 2;
        return ((this.buffer[this.offset - 2] & 0xff) << 8) + (this.buffer[this.offset - 1] & 0xff);
    }

    public getUSmart(): number {
        let i = this.buffer[this.offset] & 0xff;
        if (i < 128) {
            return this.readUnsignedByte();
        } else {
            return this.readUShort() - 32768;
        }
    }

    public readSmart(): number {
        try {
            let value = 0;
            let ptr;
            for (ptr = this.getUSmart(); 32767 == ptr; ptr = this.getUSmart())
                value += 32767;
            value += ptr;
            return value;
        } catch (e) {
            console.error(e);
        }
        return -1;
    }

    public readString(): string {
        let i = this.offset;
        while (this.buffer[this.offset++] != 10)
            ;
        return new TextDecoder().decode(this.buffer.slice(i, this.offset - i - 1));
    }

    public getBytes(): Uint8Array {
        let i = this.offset;
        while (this.buffer[this.offset++] != 10) {
            ;
        }
        return this.buffer.slice(i, this.offset - i - 1);
    }

    public read(length: number): Uint8Array {
        return this.buffer.slice(this.offset, this.offset + length);
        this.offset += length;
    }
}