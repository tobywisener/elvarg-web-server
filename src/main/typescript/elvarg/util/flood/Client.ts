import { Buffer } from '../flood/Buffer';
import { ByteBuffer } from '../flood/ByteBuffer'
import { BufferedConnection } from '../flood/BufferedConnection'
import { IsaacRandom } from '../../net/security/IsaacRandom';
import { NetworkConstants } from '../../net/NetworkConstants'
import io, { Socket } from 'socket.io-client';
import { GameConstants } from '../../game/GameConstants';
import { LoginResponses } from '../../net/login/LoginResponses';
import { Server } from '../../Server';

export class Client {
    private readonly username: string;
    private readonly password: string;
    public loggedIn: boolean;
    public pingCounter = 0;
    private incoming: Buffer;
    private login: Buffer;
    private outgoing: ByteBuffer;
    private socketStream: BufferedConnection;
    private serverSeed: number;
    private encryption: IsaacRandom;

    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
    }

    private openSocket(port: number): Socket {
        const socket = io(`http://localhost:${port}`);

        socket.on('connect', () => {
            console.log('Conectado ao servidor');
        });

        socket.on('disconnect', () => {
            console.log('Desconectado do servidor');
        });

        return socket;
    }

    public attemptLogin(): void {
        this.login = Buffer.create();
        this.incoming = Buffer.create();
        this.outgoing = ByteBuffer.create(5000, false, null);
        this.socketStream = new BufferedConnection(this.openSocket(NetworkConstants.GAME_PORT));

        this.outgoing.putByte(14); //REQUEST
        this.socketStream.queueBytes(1, this.outgoing.getBuffer());

        let response = this.socketStream.read();
    }

    public attemptLogins() {
        this.login = Buffer.create();
        this.incoming = Buffer.create();
        this.outgoing = ByteBuffer.create(5000, false, null);
        this.socketStream = new BufferedConnection(this.openSocket(NetworkConstants.GAME_PORT));

        this.outgoing.putByte(14); //REQUEST
        this.socketStream.queueBytes(1, this.outgoing.getBuffer());

        let response = this.socketStream.read();

        //Our encryption for outgoing messages for this player's session
        let cipher = null;

        if (response === 0) {
            this.socketStream.flushInputStream(new Uint8Array(this.incoming.payload), 8);
            this.incoming.currentPosition = 0;
            this.serverSeed = this.incoming.readLong();
            let seed: number[] = [
                Math.floor(Math.random() * 99999999),
                Math.floor(Math.random() * 99999999),
                this.serverSeed >> 32,
                this.serverSeed
            ];
            this.outgoing.resetPosition();
            this.outgoing.putByte(10);
            this.outgoing.putInt(seed[0]);
            this.outgoing.putInt(seed[1]);
            this.outgoing.putInt(seed[2]);
            this.outgoing.putInt(seed[3]);
            this.outgoing.putInt(GameConstants.CLIENT_UID);
            this.outgoing.putString(this.username);
            this.outgoing.putString(this.password);
            this.outgoing.encryptRSAContent();

            this.login.currentPosition = 0;
            this.login.writeByte(16);
            this.login.writeByte(this.outgoing.getPosition() + 2);
            this.login.writeByte(255);
            this.login.writeByte(0);
            this.login.writeByteS(this.outgoing.getPosition());
            cipher = new IsaacRandom(seed);
            for (let index = 0; index < 4; index++) {
                seed[index] += 50;
            }
            this.encryption = new IsaacRandom(seed);
            this.socketStream.queueBytes(this.login.currentPosition, new Uint8Array(this.login.payload));
            response = this.socketStream.read();
        }
        if (response === LoginResponses.LOGIN_SUCCESSFUL) {
            Server.getFlooder().clients.set(this.username, this);
            let rights = this.socketStream.read();
            this.loggedIn = true;
            this.outgoing = ByteBuffer.create(5000, false, cipher);
            this.incoming.currentPosition = 0;
        }
    }


    private readPacket(): boolean {
        if (this.socketStream == null) {
            return false;
        }

        let available: number = this.socketStream.available();

        if (available < 2) {
            return false;
        }

        let opcode: number = -1;
        let packetSize: number = -1;

        if (opcode === -1) {
            this.socketStream.flushInputStream(new Uint8Array(this.incoming.payload), 1);
            opcode = this.incoming.payload[0] & 0xff;
            if (this.encryption != null) {
                opcode = (opcode - this.encryption.nextInt()) & 0xff;
            }
            this.socketStream.flushInputStream(new Uint8Array(this.incoming.payload), 2);
            packetSize = ((this.incoming.payload[0] & 0xff) << 8) + (this.incoming.payload[1] & 0xff);
        }

        if (!(opcode >= 0 && opcode < 256)) {
            opcode = -1;
            return false;
        }

        this.incoming.currentPosition = 0;
        this.socketStream.flushInputStream(new Uint8Array(this.incoming.payload), packetSize);

        switch (opcode) {

        }
        return false;
    }

    public process() {
        if (this.loggedIn) {
            for (let i = 0; i < 5; i++) {
                if (!this.readPacket()) {
                    break;
                }
            }
            if (this.pingCounter++ >= 25) {
                this.outgoing.resetPosition();
                this.outgoing.putOpcode(0);
                if (this.socketStream != null) {
                    this.socketStream.queueBytes(this.outgoing.bufferLength(), this.outgoing.getBuffer());
                }
                this.pingCounter = 0;
            }
        }
    }

}