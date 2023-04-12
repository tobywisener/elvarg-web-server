import { BigInt } from 'big-int'
import { IsaacRandom } from '../../net/security/IsaacRandom';

export class ByteBuffers {
    public static RSA_MODULUS = new BigInt("131409501542646890473421187351592645202876910715283031445708554322032707707649791604685616593680318619733794036379235220188001221437267862925531863675607742394687835827374685954437825783807190283337943749605737918856262761566146702087468587898515768996741636870321689974105378482179138088453912399137944888201");
    public static RSA_EXPONENT = new BigInt("65537");
    private static pkt_opcode_slot = 0;
    private static pkt_size_slot = 1;
    private static pkt_content_start = 2;
    public static BIT_CONSTANTS = [0, 1, 3, 7, 15, 31, 63, 127,
    255, 511, 1023, 2047, 4095, 8191, 16383, 32767, 65535, 0x1ffff,
    0x3ffff, 0x7ffff, 0xFFfff, 0x1fffff, 0x3fffff, 0x7fffff, 0xFFffff,
    0x1ffffff, 0x3ffffff, 0x7ffffff, 0xFFfffff, 0x1fffffff, 0x3fffffff,
    0x7fffffff, -1];
    private bitPosition: number;
    private buffer: number[];
    private cipher: IsaacRandom;
    private position: number;
    private reserve_packet_slots: boolean;
    private size: number;
    
    constructor() {
    
    }
}

export class ByteBuffer {
    buffer: number[];
    reserve_packet_slots: boolean;
    size: number;
    position: number;
    cipher: IsaacRandom;
    static pkt_opcode_slot = 0;
    static pkt_size_slot = 1;
    static pkt_content_start = 2;
    
    constructor(buffer: number[]) {
        this.buffer = buffer;
    }
    
    static create(size: number, reserve_packet_slots: boolean, cipher: IsaacRandom): ByteBuffer {
        let stream_1 = new ByteBuffer([0]);
        stream_1.buffer = new Array(size);
        stream_1.reserve_packet_slots = reserve_packet_slots;
        stream_1.size = size;
        stream_1.position = reserve_packet_slots ? ByteBuffer.pkt_content_start : ByteBuffer.pkt_opcode_slot;
        stream_1.cipher = cipher;
        return stream_1;
    }
    
    reset(reserve_packet_slots: boolean) {
        this.buffer = new Array(this.size);
        this.reserve_packet_slots = reserve_packet_slots;
        this.position = reserve_packet_slots ? ByteBuffer.pkt_content_start : ByteBuffer.pkt_opcode_slot;
    }

    public  encryptRSAContent() {
        /* Cache the current position for future use */
        let currentPosition = this.position;

        /* Reset the position */
        this.position = this.reserve_packet_slots ? ByteBuffer.pkt_content_start : ByteBuffer.pkt_opcode_slot;

        /* An empty byte array with a capacity of {@code #currentPosition} bytes */
        let decodeBuffer = new Uint8Array(currentPosition);

        /*
         * Gets bytes up to the current position from the buffer and populates
         * the {@code #decodeBuffer}
         */
        this.getBytes(currentPosition, 0, decodeBuffer);

        /*
         * The decoded big integer which translates the {@code #decodeBuffer}
         * into a {@link BigInteger}
         */
        let decodedBigInteger = new BigInt(decodeBuffer);

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
        let encodedBigInteger = decodedBigInteger.modPow(ByteBuffers.RSA_EXPONENT, ByteBuffers.RSA_MODULUS);

        /*
         * Returns the value of the {@code #encodedBigInteger} translated to a
         * byte array in big-endian byte-order
         */
        let encodedBuffer = encodedBigInteger.toArray();

        /* Reset the position so we can write fresh to the buffer */
        this.position = this.reserve_packet_slots ? ByteBuffer.pkt_content_start : ByteBuffer.pkt_opcode_slot;

        /*
         * We put the length of the {@code #encodedBuffer} to the buffer as a
         * standard byte. (Ignore the naming, that really writes a byte...)
         */
        this.putByte(encodedBuffer.length);

        /* Put the bytes of the {@code #encodedBuffer} into the buffer. */
        this.putBytes(encodedBuffer, encodedBuffer.length, 0);

    }

    public finishBitAccess() :void {
        this.position = Math.floor((this.position + 7) / 8);
    }

    getBits(bitLength: number): number {
        let k = this.position >> 3;
        let l = 8 - (this.position & 7);
        let i1 = 0;
        this.position += bitLength;

        for (; bitLength > l; l = 8) {
            i1 += (this.buffer[k++] & ByteBuffers.BIT_CONSTANTS[l]) << bitLength - l;
            bitLength -= l;
        }

        if (bitLength == l) {
            i1 += this.buffer[k] & ByteBuffers.BIT_CONSTANTS[l];
        } else {
            i1 += (this.buffer[k] >> l - bitLength) & ByteBuffers.BIT_CONSTANTS[bitLength];
        }

        return i1;
    }

    getByte(value: number) {
        this.buffer[this.position++] = value;
    }

    getsBytes(): Uint8Array {
        let pos = this.position;
        while (this.buffer[this.position++] !== 10) { }
        let buf = new Uint8Array(this.position - pos - 1);
        buf.set(this.buffer.slice(pos, this.position - 1));
        return buf;
    }

    getBytes(len: number, off: number, dest: Uint8Array) {
        for (let i = off; i < off + len; i++) {
            dest[i] = this.buffer[this.position++];
        }
    }

    getInt(): number {
        this.position += 4;
        return ((this.buffer[this.position - 4] & 0xFF) << 24) + ((this.buffer[this.position - 3] & 0xFF) << 16) + ((this.buffer[this.position - 2] & 0xFF) << 8) + (this.buffer[this.position - 1] & 0xFF);
    }

    getIntLittleEndian(): number {
        this.position += 4;
        return ((this.buffer[this.position - 4] & 0xFF) << 24) + ((this.buffer[this.position - 3] & 0xFF) << 16) + ((this.buffer[this.position - 2] & 0xFF) << 8) + (this.buffer[this.position - 1] & 0xFF);
    }

    getLong(): number {
        const LONG_MASK: number = 0xFFFFFFFF;
        let msw = this.getIntLittleEndian() & LONG_MASK;
        let lsw = this.getIntLittleEndian() & LONG_MASK;
        return msw << 32 | lsw;
    }

    public getShort2(): number {
        this.position += 2;
        let i = ((this.buffer[this.position - 2] & 0xFF) << 8) + (this.buffer[this.position - 1] & 0xFF);
    
        if (i > 60000) {
            i = -65535 + i;
        }
    
        return i;
    }
    
    public getShortBigEndian(): number {
        this.position += 2;
        return ((this.buffer[this.position - 1] & 0xFF) << 8) + (this.buffer[this.position - 2] & 0xFF);
    }
    
    public getShortBigEndianA(): number {
        this.position += 2;
        return ((this.buffer[this.position - 1] & 0xFF) << 8) + (this.buffer[this.position - 2] - 128 & 0xFF);
    }
    
    public getSignedByte(): number {
        return this.buffer[this.position++];
    }
    
    public getSignedShort(): number {
        this.position += 2;
        let value = ((this.buffer[this.position - 2] & 0xFF) << 8) + (this.buffer[this.position - 1] & 0xFF);
    
        if (value > 32767) {
            value -= 0x10000;
        }
    
        return value;
    }

    public getSmart(): number {
        try {
        // checks current without modifying position
        if (this.position >= this.buffer.length) {
        return this.buffer[this.buffer.length - 1] & 0xFF;
        }
        let value = this.buffer[this.position] & 0xFF;
                if (value < 128) {
                    return this.getUnsignedByte();
                } else {
                    return this.getUnsignedShort() - 32768;
                }
            } catch (e) {
                console.error(e);
                return this.getUnsignedShort() - 32768;
            }
    }
        
    public getString(): string {
        let i = this.position;
    
        while (this.buffer[this.position++] != 10) {
        }
    
        return new TextDecoder().decode(new Uint8Array(this.buffer.slice(i, this.position - 1)));
    }
    
    public getTribytes(): number {
        this.position += 3;
        return ((this.buffer[this.position - 3] & 0xFF) << 16) + ((this.buffer[this.position - 2] & 0xFF) << 8) + (this.buffer[this.position - 1] & 0xFF);
    }
    
    public getTribyte(value: number): number {
        this.position += 3;
        return (0xFF & this.buffer[this.position - 3] << 16) + (0xFF & this.buffer[this.position - 2] << 8) + (0xFF & this.buffer[this.position - 1]);
    }
    
    public getUnsignedByte(): number {
        if (this.position + 1 > this.buffer.length) {
            this.position = this.buffer.length - 2;
        }
        return this.buffer[this.position++] & 0xFF;
    }

    public getUnsignedShort(): number {
        if (this.position + 2 > this.buffer.length) {
        return this.buffer[this.buffer.length - 1];
        }
        this.position += 2;
        return ((this.buffer[this.position - 2] & 0xFF) << 8) + (this.buffer[this.position - 1] & 0xFF);
    }
            
    public getUSmart2(): number {
        let baseVal = 0;
        let lastVal = 0;
    
        while ((lastVal = this.getSmart()) == 32767) {
            baseVal += 32767;
        }
    
        return baseVal + lastVal;
    }
        
    public initBitAccess(): void {
        this.position = this.position << 3;
    }
    
    public method400(value: number): void {
        this.buffer[this.position++] = (value as number) & 0xff;
        this.buffer[this.position++] = (value >> 8) as number & 0xff;
    }
    
    public method403(value: number): void {
        this.buffer[this.position++] = (value as number) & 0xff;
        this.buffer[this.position++] = (value >> 8) as number & 0xff;
        this.buffer[this.position++] = (value >> 16) as number & 0xff;
        this.buffer[this.position++] = (value >> 24) as number & 0xff;
    }

    public method421(): number {

        let i = this.buffer[this.position] & 0xFF;
        if (i < 128) {
            return this.getUnsignedByte() - 64;
        } else {
            return this.getUnsignedShort() - 49152;
        }
        }
            
    public method424(i: number): void {
        this.buffer[this.position++] = (i as number) & 0xff;
    }
    
    public method425(j: number): void {
        this.buffer[this.position++] = (j as number) & 0xff;
    }
    
    public method426(): number {
        return this.buffer[this.position++] - 128 & 0xFF;
    }
    
    public method427(): number {
        return -this.buffer[this.position++] & 0xFF;
    }
    
    public getByteA(): number {
        this.position += 2;
        return ((this.buffer[this.position - 2] & 0xff) << 8)
                + (this.buffer[this.position - 1] - 128 & 0xff);
    }
    
    public method428(): number {
        return 128 - this.buffer[this.position++] & 0xFF;
    }

    public method429(): number {
        return -this.buffer[this.position++];
    }
        

    public method430(): number {
        return 128 - this.buffer[this.position++];
    }
    
    public writeUnsignedWordBigEndian(i: number): void {
        this.buffer[this.position++] = (i as number) & 0xff;
        this.buffer[this.position++] = (i >> 8) as number & 0xff;
    }
    
    public writeUnsignedWordA(j: number): void {
        this.buffer[this.position++] = (j >> 8) as number & 0xff;
        this.buffer[this.position++] = (j + 128) as number & 0xff;
    }
    
    public writeSignedBigEndian(j: number): void {
        this.buffer[this.position++] = (j + 128) as number & 0xff;
        this.buffer[this.position++] = (j >> 8) as number & 0xff;
    }
    
    public method435(): number {
        this.position += 2;
        return ((this.buffer[this.position - 2] & 0xFF) << 8) + (this.buffer[this.position - 1] - 128 & 0xFF);
    }
    
    public method437(): number {
        this.position += 2;
        let j = ((this.buffer[this.position - 1] & 0xFF) << 8) + (this.buffer[this.position - 2] & 0xFF);
        if (j > 32767) {
            j -= 0x10000;
        }
        return j;
    }

    public method438(): number {
        this.position += 2;
        let j = ((this.buffer[this.position - 1] & 0xFF) << 8) + (this.buffer[this.position - 2] - 128 & 0xFF);
        if (j > 32767) {
        j -= 0x10000;
        }
        return j;
    }
                    
                        
    public method439(): number {
        this.position += 4;
        return ((this.buffer[this.position - 2] & 0xFF) << 24) + ((this.buffer[this.position - 1] & 0xFF) << 16) + ((this.buffer[this.position - 4] & 0xFF) << 8) + (this.buffer[this.position - 3] & 0xFF);
    }

    public method440(): number {
        this.position += 4;
        return ((this.buffer[this.position - 3] & 0xFF) << 24) + ((this.buffer[this.position - 4] & 0xFF) << 16) + ((this.buffer[this.position - 1] & 0xFF) << 8) + (this.buffer[this.position - 2] & 0xFF);
    }
    
        
    public method441(i: number, abyte0: number[], j: number): void {
        for (let k = i + j - 1; k >= i; k--) {
            this.buffer[this.position++] = (abyte0[k] + 128) as number & 0xff;
        }
    }
    
    public method442(i: number, j: number, abyte0: number[]): void {
        for (let k = j + i - 1; k >= j; k--) {
            abyte0[k] = this.buffer[this.position++];
        }
    
    }
    
    public putBytes(tmp: number[], len: number, off: number): void {
        for (let i = off; i < off + len; i++) {
            this.buffer[this.position++] = tmp[i];
        }
    }
    
    public putDWordBigEndian(value: number): void {
        this.buffer[this.position++] = (value >> 16) as number & 0xff;
        this.buffer[this.position++] = (value >> 8) as number & 0xff;
        this.buffer[this.position++] = value as number & 0xff;
    }

    public putInt(i: number): void {
        this.buffer[this.position++] = (i >> 24) as number & 0xff;
        this.buffer[this.position++] = (i >> 16) as number & 0xff;
        this.buffer[this.position++] = (i >> 8) as number & 0xff;
        this.buffer[this.position++] = i as number & 0xff;
    }
                            
                                
    public putLong(value: number): void {
        try {
            this.buffer[this.position++] = (value >> 56) as number & 0xff;
            this.buffer[this.position++] = (value >> 48) as number & 0xff;
            this.buffer[this.position++] = (value >> 40) as number & 0xff;
            this.buffer[this.position++] = (value >> 32) as number & 0xff;
            this.buffer[this.position++] = (value >> 24) as number & 0xff;
            this.buffer[this.position++] = (value >> 16) as number & 0xff;
            this.buffer[this.position++] = (value >> 8) as number & 0xff;
            this.buffer[this.position++] = value as number & 0xff;
        } catch (error) {
            throw new Error();
        }
    }
    
    public putOpcode(i: number): void {
        this.buffer[this.reserve_packet_slots ? ByteBuffer.pkt_opcode_slot : this.position++] = (i + this.cipher.nextInt()) as number & 0xff;
    }
    
    public putShort(value: number): void {
        this.buffer[this.position++] = (value >> 8) as number & 0xff;
        this.buffer[this.position++] = value as number & 0xff;
    }

    public putString(s: string): void {
        let tempBuffer = new Uint8Array(s.length);
        for (let i = 0; i < s.length; i++) {
        tempBuffer[i] = s.charCodeAt(i);
        }
        tempBuffer.forEach((char, index) => {
        this.buffer[this.position + index] = char;
        });
        this.position += s.length;
        this.buffer[this.position++] = 10;
    }
    
    
    public putVariableSizeByte(size: number): void {
        this.buffer[this.position - size - 1] = size as number & 0xff;
    }
    
    public putByte(i: number): void {
        this.buffer[this.position++] = i as number & 0xff;
    }
    
    public getBitPosition(): number {
        return this.position;
    }
    
    public getCipher(): IsaacRandom {
        return this.cipher;
    }
    
    public setCipher(cipher: IsaacRandom): void {
        this.cipher = cipher;
    }
    
    public getBuffer(): Uint8Array {
        return new Uint8Array(this.buffer);
    }
                                
    public bufferLength(): number {
        let size = this.position;
        if (this.reserve_packet_slots) {
            this.buffer[ByteBuffer.pkt_size_slot] = (size + this.cipher.nextInt()) as number & 0xff;
        }
        return size;
    }

    public resetPosition(): void {
        this.position = this.reserve_packet_slots ? ByteBuffer.pkt_content_start : ByteBuffer.pkt_opcode_slot;
    }

    public getPosition(): number {
        return this.position;
    }
}