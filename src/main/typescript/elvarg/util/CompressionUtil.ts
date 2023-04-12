import { ungzip } from "gzip-js";
import * as Bzip2 from 'bzip2';

export class CompressionUtil {
    private constructor() {
        throw new Error("static-utility classes may not be instantiated.");
    }

    static gunzip(data: Uint8Array): Uint8Array {
        return Uint8Array.from(ungzip(data));
    }

    static unbzip2Headerless(data: Uint8Array, offset: number, length: number): Uint8Array | null {
        let bzip2 = new Uint8Array(length + 2);
        bzip2[0] = 104; // ASCII value for 'h'
        bzip2[1] = 49;  // ASCII value for '1'
        bzip2.set(new Uint8Array(data.buffer, offset, length), 2);
        const decompressed = CompressionUtil.unbzip2(bzip2);
        if (decompressed === null) {
            return null;
        }
        return decompressed;
    }


    static unbzip2(data: Uint8Array): Uint8Array | null {
        const decompressed = Bzip2.decompressFile(String.fromCharCode.apply(null, data));
        return decompressed !== null ? new Uint8Array(decompressed) : null;
    }
}

