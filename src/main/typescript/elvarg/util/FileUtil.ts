import { fs } from 'fs-extra';
import { createGunzip } from 'zlib';
import { promisify } from 'util';
import { gunzip } from 'zlib';
import { createReadStream } from 'fs'
import * as zlib from 'zlib';


export class FileUtil {
    public static readFile(name: string): Buffer {
        try {
            const buffer = fs.readFileSync(name);
            return buffer;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    public static async getGZBuffer(file: string): Promise<Buffer> {
        const stats = await fs.stat(file);
        if (!stats.isFile()) {
            return null;
        }
        const buffer = fs.readFile(file);
        const gzipInputBuffer = Buffer.alloc(999999);
        let bufferlength = 0;
        const gzip = zlib.createGunzip();
        gzip.on('data', (data) => {
            if (bufferlength + data.length > gzipInputBuffer.length) {
                console.error('Error inflating data.\nGZIP buffer overflow.');
                gzip.end();
                return;
            }
            data.copy(gzipInputBuffer, bufferlength);
            bufferlength += data.length;
        });
        gzip.on('end', () => {
            const inflated = gzipInputBuffer.slice(0, bufferlength);
            if (inflated.length < 10) {
                return null;
            }
            return inflated;
        });
        gzip.write(buffer);
        gzip.end();
    }

    public static async getDecompressedBuffer(file: string): Promise<Buffer> {
        try {
            const buffer = await FileUtil.getGZBuffer(file);
            const decompressed = zlib.gunzipSync(buffer);
            return decompressed;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}