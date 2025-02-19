import { Player } from "../Player";
import { LoginDetailsMessage } from "../../../../../net/login/LoginDetailsMessage"
import { LoginResponses } from "../../../../../net/login/LoginResponses"
import { DiscordUtil } from "../../../../../util/DiscordUtil"
import { PasswordUtil } from "../../../../../util/PasswordUtil"
import { PlayerSave } from "../persistence/PlayerSave"



export abstract class PlayerPersistence {
    abstract load(username: string): PlayerSave;
    abstract save(player: Player): void;
    abstract exists(username: string): boolean;

    public async encryptPassword(plainPassword: string): Promise<string> {
        const passwordEncrypt: string = await PasswordUtil.generatePasswordHashWithSalt(plainPassword);
        return passwordEncrypt;
    }

    public async checkPassword(password: string, playerSave: PlayerSave): Promise<boolean> {
        let passwordHashWithSalt = playerSave.getPasswordHashWithSalt();
        let isMatch: boolean = await PasswordUtil.passwordsMatch(password, passwordHashWithSalt);
        return isMatch;
    }
}
