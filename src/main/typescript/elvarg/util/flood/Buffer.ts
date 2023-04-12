

import {IsaacRandom} from '../../net/security/IsaacRandom';
const BigInteger = require('big-integer');

export class Buffer {
    private static readonly BIT_MASKS: number[] = [0, 1, 3, 7, 15, 31, 63, 127, 255,
    511, 1023, 2047, 4095, 8191, 16383, 32767, 65535, 0x1ffff, 0x3ffff,
    0x7ffff, 0xfffff, 0x1fffff, 0x3fffff, 0x7fffff, 0xffffff,
    0x1ffffff, 0x3ffffff, 0x7ffffff, 0xfffffff, 0x1fffffff, 0x3fffffff,
    0x7fffffff, -1];
    public payload: number[];
    public currentPosition: number;
    public bitPosition: number;
    public encryption: IsaacRandom;

    public constructor(payload: number[]) {
        this.payload = payload;
        this.currentPosition = 0;
    }

    public static create(): Buffer {
        let buffer = new Buffer([0]);
        buffer.currentPosition = 0;
        buffer.payload = new Array(5000);
        return buffer;
    }


    public readUTriByte(i: number): number {
        this.currentPosition += 3;
        return (0xff & this.payload[this.currentPosition - 3] << 16)
        + (0xff & this.payload[this.currentPosition - 2] << 8)
        + (0xff & this.payload[this.currentPosition - 1]);
    }

    public readUShort(): number {
        this.currentPosition += 2;
        return ((this.payload[this.currentPosition - 2] & 0xff) << 8)
                + (this.payload[this.currentPosition - 1] & 0xff);
    }

    public readUShortA(): number {
        this.currentPosition += 2;
        return ((this.payload[this.currentPosition - 2] & 0xff) << 8)
                + (this.payload[this.currentPosition - 1] - 128 & 0xff);
    }

    public readSignedByte(): number {
        return this.payload[this.currentPosition++];
    }

    public readUSmart(): number {
        let value = this.payload[this.currentPosition] & 0xff;
        if (value < 128)
            return this.readSignedByte();
        else
            return this.readUShort() - 32768;
    }

    public readUSmart2(): number {
        let baseVal = 0;
        let lastVal = 0;
        while ((lastVal = this.readUSmart()) == 32767) {
            baseVal += 32767;
        }
        return baseVal + lastVal;
    }

    public readNewString(): string {
    let i = this.currentPosition;
    while (this.payload[this.currentPosition++] != 0)
        ;
        return String.fromCharCode(...this.payload.slice(i, this.currentPosition - 1));
    }

    public writeOpcode(opcode: number):void {
    this.payload[this.currentPosition++] = (opcode + this.encryption.nextInt());
    }
    

    public writeByte(value: number):void {
        this.payload[this.currentPosition++] = (value);
    }
    
    public writeShort(value: number):void {
        this.payload[this.currentPosition++] = (value >> 8);
        this.payload[this.currentPosition++] = (value);
    }
    
    public writeTriByte(value: number):void {
        this.payload[this.currentPosition++] = (value >> 16);
        this.payload[this.currentPosition++] = (value >> 8);
        this.payload[this.currentPosition++] = (value);
    }

    public writeInt(value: number):void {
        this.payload[this.currentPosition++] = (value >> 24);
        this.payload[this.currentPosition++] = (value >> 16);
        this.payload[this.currentPosition++] = (value >> 8);
        this.payload[this.currentPosition++] = value;
    }

    public writeLEInt(value: number):void {
        this.payload[this.currentPosition++] = value;
        this.payload[this.currentPosition++] = (value >> 8);
        this.payload[this.currentPosition++] = (value >> 16);
        this.payload[this.currentPosition++] = (value >> 24);
    }
        

    public writeLong(value: number):void {
        try {
        this.payload[this.currentPosition++] = (value >> 56) as number;
        this.payload[this.currentPosition++] = (value >> 48) as number;
        this.payload[this.currentPosition++] = (value >> 40) as number;
        this.payload[this.currentPosition++] = (value >> 32) as number;
        this.payload[this.currentPosition++] = (value >> 24) as number;
        this.payload[this.currentPosition++] = (value >> 16) as number;
        this.payload[this.currentPosition++] = (value >> 8) as number;
        this.payload[this.currentPosition++] = (value) as number;
        } catch (runtimeexception) {
        console.error("14395, " + 5 + ", " + value + ", " + runtimeexception.toString());
        throw new Error();
        }
    }
    
    public writeString(text: string):void {
        this.payload.slice(text.length).forEach((e,i) => this.payload[this.currentPosition + i] = e);
        this.currentPosition += text.length;
        this.payload[this.currentPosition++] = 10;
    }

    public readShort2(): number {
        this.currentPosition += 2;
        let i = ((this.payload[this.currentPosition - 2] & 0xff) << 8) + (this.payload[this.currentPosition - 1] & 0xff);
        if (i > 32767)
        i -= 65537;
        return i;
    }
    
    public readShort(): number {
        this.currentPosition += 2;
        let value = ((this.payload[this.currentPosition - 2] & 0xff) << 8)
                + (this.payload[this.currentPosition - 1] & 0xff);

        if (value > 32767) {
            value -= 0x10000;
        }
        return value;
    }

    public readTriByte(): number {
        this.currentPosition += 3;
        return ((this.payload[this.currentPosition - 3] & 0xff) << 16)
                + ((this.payload[this.currentPosition - 2] & 0xff) << 8)
                + (this.payload[this.currentPosition - 1] & 0xff);
    }

    public readInt(): number {
        this.currentPosition += 4;
        return ((this.payload[this.currentPosition - 4] & 0xff) << 24)
                + ((this.payload[this.currentPosition - 3] & 0xff) << 16)
                + ((this.payload[this.currentPosition - 2] & 0xff) << 8)
                + (this.payload[this.currentPosition - 1] & 0xff);
    }

    public readLong(): number {
        let msi = (this.readInt() & 0xffffffff) as number;
        let lsi = (this.readInt() & 0xffffffff) as number;
        return (msi << 32) + lsi;
    }

    public readString(): string {
        let index = this.currentPosition;
        while (this.payload[this.currentPosition++] != 10);
        return String.fromCharCode(...this.payload.slice(index, this.currentPosition - 1));
    }

    public readBytes(): Uint8Array {
        let index = this.currentPosition;
        while (this.payload[this.currentPosition++] != 10)
            ;
        let data = new Uint8Array(this.currentPosition - index - 1);
        data.set(this.payload.slice(index, this.currentPosition - 1));
        return data;
    }

    public readByte(offset: number, length: number, data: Uint8Array) {
        for (let index = length; index < length + offset; index++)
            data[index] = this.payload[this.currentPosition++];
    }

    public initBitAccess() {
        this.bitPosition = this.currentPosition * 8;
    }

    public readBits(amount: number): number {
        let byteOffset = this.bitPosition >> 3;
        let bitOffset = 8 - (this.bitPosition & 7);
        let value = 0;
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
    }

    public disableBitAccess() {
        this.currentPosition = (this.bitPosition + 7) / 8;
    }

    public readSmart(): number {
        let value = this.payload[this.currentPosition] & 0xff;
        if (value < 128)
            return this.readSignedByte() - 64;
        else
            return this.readUShort() - 49152;
    }

    public getSmart(): number {
        try {
            // checks current without modifying position
            if (this.currentPosition >= this.payload.length) {
                return this.payload[this.payload.length - 1] & 0xFF;
            }
            let value = this.payload[this.currentPosition] & 0xFF;

            if (value < 128) {
                return this.readSignedByte();
            } else {
                return this.readUShort() - 32768;
            }
        } catch (e) {
            console.log(e);
            return this.readUShort() - 32768;
        }
    }

    public encodeRSA(exponent: bigint, modulus: bigint) {
        let length = this.currentPosition;
        this.currentPosition = 0;
        let buffer = new Uint8Array(length);
        this.readBytes();

        let rsa = buffer;

        //if (Configuration.ENABLE_RSA) {
        rsa = new BigInteger(buffer).modPow(exponent, modulus)
                .toByteArray();
        //}

        this.currentPosition = 0;
        this.writeByte(rsa.length);
        this.writeByteS(rsa.length);
    }

    public writeNegatedByte(value: number) {
        this.payload[this.currentPosition++] = (value * -1);
    }

    public writeByteS(value: number) {
        this.payload[this.currentPosition++] = (128 - value);
    }

    public readUByteA(): number {
        return this.payload[this.currentPosition++] - 128 & 0xff;
    }

    public readNegUByte(): number {
        return -this.payload[this.currentPosition++] & 0xff;
    }

    public readUByteS(): number {
        return 128 - this.payload[this.currentPosition++] & 0xff;
    }

    public readNegByte(): number {
        return -this.payload[this.currentPosition++];
    }

    public readByteS(): number {
        return 128 - this.payload[this.currentPosition++];
    }

    public writeLEShort(value: number) {
        this.payload[this.currentPosition++] = value;
        this.payload[this.currentPosition++] = (value >> 8);
    }

    public writeShortA(value: number) {
        this.payload[this.currentPosition++] = (value >> 8);
        this.payload[this.currentPosition++] = (value + 128);
    }

    public writeLEShortA(value: number) {
        this.payload[this.currentPosition++] = (value + 128);
        this.payload[this.currentPosition++] = (value >> 8);
    }

    public readLEUShort(): number {
        this.currentPosition += 2;
        return ((this.payload[this.currentPosition - 1] & 0xff) << 8)
                + (this.payload[this.currentPosition - 2] & 0xff);
    }

    
    public readLEUShortA(): number {
        this.currentPosition += 2;
        return ((this.payload[this.currentPosition - 1] & 0xff) << 8)
                + (this.payload[this.currentPosition - 2] - 128 & 0xff);
    }

    public readLEShort(): number {
        this.currentPosition += 2;
        let value = ((this.payload[this.currentPosition - 1] & 0xff) << 8)
                + (this.payload[this.currentPosition - 2] & 0xff);

        if (value > 32767) {
            value -= 0x10000;
        }
        return value;
    }

    public readLEShortA(): number {
        this.currentPosition += 2;
        let value = ((this.payload[this.currentPosition - 1] & 0xff) << 8)
                + (this.payload[this.currentPosition - 2] - 128 & 0xff);
        if (value > 32767)
            value -= 0x10000;
        return value;
    }

    public getIntLittleEndian(): number {
        this.currentPosition += 4;
        return ((this.payload[this.currentPosition - 4] & 0xFF) << 24) + ((this.payload[this.currentPosition - 3] & 0xFF) << 16) + ((this.payload[this.currentPosition - 2] & 0xFF) << 8) + (this.payload[this.currentPosition - 1] & 0xFF);
    }

    public readMEInt(): number { // V1
        this.currentPosition += 4;
        return ((this.payload[this.currentPosition - 2] & 0xff) << 24)
                + ((this.payload[this.currentPosition - 1] & 0xff) << 16)
                + ((this.payload[this.currentPosition - 4] & 0xff) << 8)
                + (this.payload[this.currentPosition - 3] & 0xff);
    }

    public readIMEInt(): number { // V2
        this.currentPosition += 4;
        return ((this.payload[this.currentPosition - 3] & 0xff) << 24)
                + ((this.payload[this.currentPosition - 4] & 0xff) << 16)
                + ((this.payload[this.currentPosition - 1] & 0xff) << 8)
                + (this.payload[this.currentPosition - 2] & 0xff);
    }

    public writeReverseDataA(data: Uint8Array, length: number, offset: number) {
        for (let index = (length + offset) - 1; index >= length; index--) {
            this.payload[this.currentPosition++] = (data[index] + 128);
        }
    }

    public readReverseData(data: Uint8Array, offset: number, length: number) {
        for (let index = (length + offset) - 1; index >= length; index--) {
            data[index] = this.payload[this.currentPosition++];
        }
    }
}
                
                
                
                
