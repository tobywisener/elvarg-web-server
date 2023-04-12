import { Server } from '../../Server';
import { GameConstants } from '../../game/GameConstants';
import { ByteBufUtils } from '../ByteBufUtils';
import { NetworkConstants } from '../NetworkConstants';
import { LoginDetailsMessage } from '../login/LoginDetailsMessage';
import { LoginResponses } from '../login/LoginResponses';
import { IsaacRandom } from '../security/IsaacRandom';
import { Misc } from '../../util/Misc';
import { DiscordUtil } from '../../util/DiscordUtil';
import * as Random from 'seedrandom'
import { Server as IoServer, Socket } from 'socket.io';

enum LoginDecoderState {
    LOGIN_REQUEST,
    LOGIN_TYPE,
    LOGIN
}

const io = new IoServer();

export class LoginDecoder {
    private static readonly random = new Random();
    private static readonly SECRET_VALUE = 345749224;
    private state: LoginDecoderState = LoginDecoderState.LOGIN_REQUEST;
    private hostAddressOverride: string | null = null;

    public static sendLoginResponse(response: number) {
        let buffer = Buffer.alloc(1);
        buffer.writeUInt8(response);
        io.emit('message', buffer);
        io.on('close', () => {
            io.send();
        });
    }

    decode(buffer: Buffer, out: any[]) {
        switch (this.state) {
            case LoginDecoderState.LOGIN_REQUEST:
                this.decodeRequest(buffer);
                break;
            case LoginDecoderState.LOGIN_TYPE:
                this.decodeType(buffer);
                break;
            case LoginDecoderState.LOGIN:
                this.decodeLogin(buffer, out);
                break;
        }
    }

    private decodeRequest(buffer: Buffer) {
        if (buffer.length == 0) {
            io.close();
            return;
        }

        let request = buffer.readUInt8();
        if (request != NetworkConstants.LOGIN_REQUEST_OPCODE) {
            console.log(`Session rejected for bad login request id: ${request}`);
            LoginDecoder.sendLoginResponse(LoginResponses.LOGIN_BAD_SESSION_ID);
            return;
        }

        if (buffer.length == 8) {
            let secret = buffer.readUInt8();
            if (secret != LoginDecoder.SECRET_VALUE) {
                console.log(`Invalid secret value given: ${secret}`);
                LoginDecoder.sendLoginResponse(LoginResponses.LOGIN_BAD_SESSION_ID);
                return;
            }
            let ip = buffer.readUInt8();

            this.hostAddressOverride = `${ip & 0xff}.${ip >> 8 & 0xff}.${ip >> 16 & 0xff}.${ip >> 24 & 0xff}`;
        }

        // Send information to the client
        let buf = Buffer.alloc(1 + 8);
        buf.writeUInt8(0); // 0 = continue login
        buf.writeUInt8(LoginDecoder.random.next); // This long will be used for encryption later on
        io.emit('message', buf);
        io.send();
        this.state = LoginDecoderState.LOGIN_TYPE;
    }

    private decodeType(buffer: Buffer) {
        if (buffer.length == 0) {
            io.close();
            return;
        }

        let connectionType = buffer.readUInt8();
        if (connectionType != NetworkConstants.NEW_CONNECTION_OPCODE && connectionType != NetworkConstants.RECONNECTION_OPCODE) {
            Server.getLogger().info("Session rejected for bad connection type id: " + connectionType);
            LoginDecoder.sendLoginResponse(LoginResponses.LOGIN_BAD_SESSION_ID);
            return;
        }

        this.state = LoginDecoderState.LOGIN;

    }

    private decodeLogin(buffer: Buffer, out: Array<any>) {
        if (buffer.length == 0) {
            io.close();
            return;
        }

        let encryptedLoginBlockSize = buffer.readUInt8();
        let ipAddress;
        let url;
        io.use((socket, next) => {
            ipAddress = socket.handshake.address;
            url = socket.handshake.url;
        })

        if (encryptedLoginBlockSize != buffer.length) {
            Server.getLogger().info(`[host= ${ipAddress}] encryptedLoginBlockSize != readable bytes`);
            LoginDecoder.sendLoginResponse(LoginResponses.LOGIN_REJECT_SESSION);
            return;
        }

        if (buffer.length > 0) {

            let magicId = buffer.readUInt8();
            if (magicId != 0xFF) {
                Server.getLogger().info(`[host= ${ipAddress}] [magic= ${magicId}] was rejected for the wrong magic value.`);
                LoginDecoder.sendLoginResponse(LoginResponses.LOGIN_REJECT_SESSION);
                return;
            }

            let memory = buffer.readUInt8();
            if (memory != 0 && memory != 1) {
                Server.getLogger().info(`[host= ${ipAddress}] was rejected for having the memory setting.`);
                LoginDecoder.sendLoginResponse(LoginResponses.LOGIN_REJECT_SESSION);
                return;
            }

            let length = buffer.readUInt8();
            let rsaBytes = new Uint8Array(length);
            buffer.copy(rsaBytes);

            const rsaBuffer = Buffer.from(rsaBytes);

            let securityId = rsaBuffer.readInt8();
            if (securityId != 10 && securityId != 11) {
                Server.getLogger().info(`[host= ${ipAddress}] was rejected for having the wrong securityId.`);
                LoginDecoder.sendLoginResponse(LoginResponses.LOGIN_REJECT_SESSION);
                return;
            }

            let clientSeed = rsaBuffer.readInt8();
            let seedReceived = rsaBuffer.readInt8();

            let seed = [(clientSeed >> 32), (clientSeed), (seedReceived >> 32), (seedReceived)];
            let decodingRandom = new IsaacRandom(seed);
            for (let i = 0; i < seed.length; i++) {
                seed[i] += 50;
            }

            let uid = rsaBuffer.readInt8();
            if (uid != GameConstants.CLIENT_UID) {
                Server.getLogger().info(`[host= ${ipAddress}] was rejected for having the wrong UID.`);
                LoginDecoder.sendLoginResponse(LoginResponses.OLD_CLIENT_VERSION);
                return;
            }

            let host: string | null = this.hostAddressOverride;
            if (host == null) {
                host = ByteBufUtils.getHost(url);
            }
            let rawUsername: string = ByteBufUtils.readString(rsaBuffer);
            let password: string = ByteBufUtils.readString(rsaBuffer);

            if (securityId == 10) {
                let username: string = Misc.formatText(rawUsername.toLowerCase());

                if (username.length < 3 || username.length > 30 || password.length < 3 || password.length > 30) {
                    LoginDecoder.sendLoginResponse(LoginResponses.INVALID_CREDENTIALS_COMBINATION);
                    return;
                }

                out.push(new LoginDetailsMessage(username, password, host,
                    new IsaacRandom(seed), decodingRandom));
            } else if (securityId == 11) {
                if (rawUsername == DiscordUtil.DiscordConstants.USERNAME_CACHED_TOKEN || rawUsername == DiscordUtil.DiscordConstants.USERNAME_AUTHZ_CODE) {
                    let msg = new LoginDetailsMessage(rawUsername, password, host,
                        new IsaacRandom(seed), decodingRandom);
                    msg.setDiscord(true);
                    out.push(msg);
                } else {
                    LoginDecoder.sendLoginResponse(LoginResponses.INVALID_CREDENTIALS_COMBINATION);
                }
            }
        }
    }
}
