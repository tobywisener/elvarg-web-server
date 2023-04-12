import { IsaacRandom } from '../security/IsaacRandom';
import { Socket } from 'socket.io';
export class LoginDetailsMessage {
    private readonly username: string;
    private readonly password: string;
    private readonly host: string;
    private readonly encryptor: IsaacRandom;
    private readonly decryptor: IsaacRandom;
    private isDiscord = false;

    constructor(username: string, password: string, host: string, encryptor: IsaacRandom, decryptor: IsaacRandom) {
        this.username = username;
        this.password = password;
        this.host = host;
        this.encryptor = encryptor;
        this.decryptor = decryptor;
    }

    public getUsername(): string {
        return this.username;
    }

    public getPassword(): string {
        return this.password;
    }

    public getHost(): string {
        return this.host;
    }

    public getEncryptor(): IsaacRandom {
        return this.encryptor;
    }

    public getDecryptor(): IsaacRandom {
        return this.decryptor;
    }

    public getIsDiscord(): boolean {
        return this.isDiscord;
    }

    public setDiscord(discord: boolean): void {
        this.isDiscord = discord;
    }
}
