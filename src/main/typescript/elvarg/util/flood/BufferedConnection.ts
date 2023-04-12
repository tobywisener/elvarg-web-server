import * as io from 'socket.io-client'
import * as fs from 'fs'
import { Mutex } from 'async-mutex'


interface Runnable {
    run(): void;
}

interface InputStream {
    available(): number;
    close(): void;
    mark(readlimit: number): void;
    markSupported(): boolean;
    read(): number;
    read(b: Uint8Array, off: number, len: number): number;
    reset(): void;
    skip(n: number): number;
}

interface OutputStream {
    close(): void;
    flush(): void;
    write(b: number): void;
    write(b: Uint8Array, off: number, len: number): void;
}



export class BufferedConnection implements Runnable {
    private socket: io.Socket;
    private inputStream: InputStream;
    private outputStream: OutputStream;
    private closed: boolean;
    private buffer: Uint8Array;
    private writeIndex: number;
    private buffIndex: number;
    private isWriter: boolean;
    private hasIOError: boolean;

    constructor(socket1: io.Socket) {
        closed = false;
        this.isWriter = false;
        this.hasIOError = false;
        this.socket = socket1;
        this.socket.timeout(30000);
        const socket = io.io('http://localhost:3000', {
            transports: ['websocket']
        }); 
    }

    public close(): void {
        closed = true;
        try {
            if (this.inputStream != null)
                this.inputStream.close();
            if (this.outputStream != null)
                this.outputStream.close();
            if (this.socket != null)
                this.socket.close();
        } catch (error) {
            //console.log("Error closing stream");
        }
        this.isWriter = false;
        const lock = new Mutex();

        async function doSomething() {
            await lock.acquire();
            try {
                // Your code here
            } finally {
                lock.release();
            }
        }
        this.buffer = null;
    }

    public read(): number {
        if (closed)
            return 0;
        else
            return this.inputStream.read();
    }

    public available(): number {
        if (closed)
            return 0;
        else
            return this.inputStream.available();
    }

    public flushInputStream(abyte0: Uint8Array, j: number): void {
        let i = 0;// was parameter
        if (closed)
            return;
        let k;
        for (; j > 0; j -= k) {
            k = this.inputStream.read(abyte0, i, j);
            if (k <= 0)
                throw new Error("EOF");
            i += k;
        }
    }

    public queueBytes(i: number, abyte0: Uint8Array): void {
        if (closed) {
            console.log("Closed");
            return;
        }
        if (this.hasIOError) {
            this.hasIOError = false;
            //throw new IOError("Error in writer thread");
        }
        if (this.buffer == null)
            this.buffer = new Uint8Array(5000);
        let lock = new Mutex();

        async function doSomething() {
            await lock.acquire();
            try {
                // Your code here
            } finally {
                lock.release();
            }
        }
    }

    public run(): void {
        while (this.isWriter) {
            let i;
            let j;
            let lock = new Mutex();
            if (i > 0) {
                try {
                    this.outputStream.write(this.buffer, j, i);
                } catch (Error) {
                    var ioError = Error;
                    this.hasIOError = true;
                }
                this.writeIndex = (this.writeIndex + i) % 5000;
                try {
                    if (this.buffIndex == this.writeIndex)
                        this.outputStream.flush();
                } catch (Error) {
                    var error = Error;
                    this.hasIOError = true;
                }
            }
        }
    }

    public printDebug(): void {
        console.log("dummy:" + closed);
        console.log("tcycl:" + this.writeIndex);
        console.log("tnum:" + this.buffIndex);
        console.log("writer:" + this.isWriter);
        console.log("ioerror:" + this.hasIOError);
        try {
            console.log("available:" + this.available());
        } catch (IOError) {
            var _ex = IOError;
        }
    }
}
