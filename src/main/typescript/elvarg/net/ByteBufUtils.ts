
import { StringBuilder } from 'stringbuilder'


export class ByteBufUtils {
    public static J_STRING_TERMINATOR: string = '\n';

    public static getMedium(buffer: Uint8Array): number {
        const short1 = buffer[0] << 8;
        const short2 = buffer[1];
        return (short1 | short2);
    }

    public static getStrings(buffer: Uint8Array, terminator: string = "\0"): string {
        let str = "";
        let b: number;
        while ((b = buffer[0]) !== terminator.charCodeAt(0)) {
            str += String.fromCharCode(b);
            buffer = buffer.slice(1);
        }
        return str;
    }

    public static getBytes(buffer: Uint8Array, length: number): Uint8Array {
        const data = new Uint8Array(length);
        for (let i = 0; i < length; i++) {
            data[i] = buffer[i];
        }
        return data;
    }

    public static getString(buffer: Uint8Array, terminator: string): string {
        const os = new Uint8Array(0);
        let i = 0;
        while (i < buffer.length) {
            const read = buffer[i] & 0xFF;
            i++;
            if (read === terminator.charCodeAt(0)) {
                break;
            }
            os.set([read], os.length);
        }
        return new TextDecoder().decode(os);
    }

    public static getHost(channel: WebSocket): string {
        const url = new URL(channel.url);
        const { hostname, port } = url;
        return `${hostname}:${port}`;
    }

    public static readString(buf: Uint8Array): string {
        let temp: number;
        let builder = new StringBuilder();
        for (let i = 0; i < buf.length && (temp = buf[i]) !== 10; i++) {
            builder.append(String.fromCharCode(temp));
        }
        return builder.toString();
    }
}

//TODO: Trocar ByteBuf e ByteBuffer pro Buffer