import { PlayerSave } from '../PlayerSave';
import { PlayerSaveConverter } from '../PlayerSaveConverter';
export class PlayerSaveRecord {
    public username: string;
    public playerSave: PlayerSave;
    public updatedAt: Date;

    constructor(username: string, playerSave: PlayerSave, updatedAt: Date) {
        this.username = username;
        this.playerSave = playerSave;
        this.updatedAt = updatedAt;
    }

    public getUsername(): string {
        return this.username;
    }

    public setUsername(username: string): void {
        this.username = username;
    }


    public getPlayerSave(): PlayerSave {
        return this.playerSave;
    }

    public setPlayerSave(playerSave: PlayerSave): void {
        this.playerSave = playerSave;
    }

    public getUpdatedAt(): Date {
        return this.updatedAt;
    }

    public setUpdatedAt(updatedAt: Date): void {
        this.updatedAt = updatedAt;
    }
}