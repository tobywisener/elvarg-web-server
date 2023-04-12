import { LoginDetailsMessage } from '../login/LoginDetailsMessage';
import { Server } from '../../Server';
import { World } from '../../game/World';
import { Player } from '../../game/entity/impl/player/Player';
import { Misc } from '../../util/Misc';
import { DiscordUtil, DiscordInfo } from '../../util/DiscordUtil';
import { PlayerPunishment } from '../../util/PlayerPunishment';
import { GameConstants } from '../../game/GameConstants';

export class LoginResponses {
    public static LOGIN_SUCCESSFUL = 2;
    public static LOGIN_INVALID_CREDENTIALS = 3;
    public static LOGIN_DISABLED_ACCOUNT = 4;
    public static LOGIN_DISABLED_COMPUTER = 22;
    public static LOGIN_DISABLED_IP = 27;
    public static LOGIN_ACCOUNT_ONLINE = 5;
    public static LOGIN_GAME_UPDATE = 6;
    public static LOGIN_WORLD_FULL = 7;
    public static LOGIN_CONNECTION_LIMIT = 9;
    public static LOGIN_BAD_SESSION_ID = 10;
    public static LOGIN_REJECT_SESSION = 11;
    public static INVALID_CREDENTIALS_COMBINATION = 28;
    public static OLD_CLIENT_VERSION = 30;
    public static NEW_ACCOUNT = -1;

    public static async evaluate(player: Player, msg: LoginDetailsMessage) {
        if (World.getPlayers().isFull()) {
            return this.LOGIN_WORLD_FULL;
        }

        if (Server.isUpdating()) {
            return this.LOGIN_GAME_UPDATE;
        }

        if (player.getUsername().startsWith(" ") || player.getUsername().endsWith(" ")
            || !Misc.isValidName(player.getUsername())) {
            return this.INVALID_CREDENTIALS_COMBINATION;
        }

        if (World.getPlayerByName(player.getUsername())) {
            return this.LOGIN_ACCOUNT_ONLINE;
        }

        if (PlayerPunishment.banned(player.getUsername())) {
            return this.LOGIN_DISABLED_ACCOUNT;
        }
        if (PlayerPunishment.IPBanned(msg.getHost())) {
            return LoginResponses.LOGIN_DISABLED_IP;
        }

        // Attempt to load the character file..
        let playerLoadingResponse = await LoginResponses.getPlayerResult(player, msg);

        // New player?
        if (playerLoadingResponse === this.NEW_ACCOUNT) {
            player.setNewPlayer(true);
            player.setCreationDate(new Date());
            playerLoadingResponse = this.LOGIN_SUCCESSFUL;
        }

        return playerLoadingResponse;

    }

    private static async getDiscordResult(player: Player, msg: LoginDetailsMessage): Promise<number> {
        try {
            let discordInfo: DiscordInfo;
            if (msg.getUsername() === DiscordUtil.DiscordConstants.USERNAME_AUTHZ_CODE) {
                discordInfo = await DiscordUtil.getDiscordInfoWithCode(msg.getPassword());
            } else if (msg.getUsername() === DiscordUtil.DiscordConstants.USERNAME_CACHED_TOKEN) {
                if (!DiscordUtil.isTokenValid(msg.getPassword())) return LoginResponses.LOGIN_INVALID_CREDENTIALS;
                discordInfo = await DiscordUtil.getDiscordInfoWithToken(msg.getPassword());
            } else {
                return LoginResponses.LOGIN_INVALID_CREDENTIALS;
            }
    
            player.setUsername(discordInfo.username);
    
            let playerSave = GameConstants.PLAYER_PERSISTENCE.load(player.getUsername());
            if (!playerSave) {
                player.setDiscordLogin(true);
                player.setCachedDiscordAccessToken(discordInfo.token);
                player.setPasswordHashWithSalt(discordInfo.password);
                return LoginResponses.NEW_ACCOUNT;
            }
    
            playerSave.applyToPlayer(player);
            return LoginResponses.LOGIN_SUCCESSFUL;
    
        } catch (ex) {
            // Adicione um tratamento de erro adequado aqui
        }
    
        return LoginResponses.LOGIN_INVALID_CREDENTIALS;
    }
    

    private static async getPlayerResult(player: Player, msg: LoginDetailsMessage) {
        let plainPassword = msg.getPassword();
        if (msg.getIsDiscord()) {
            return LoginResponses.getDiscordResult(player, msg);
        }

        let playerSave = GameConstants.PLAYER_PERSISTENCE.load(player.getUsername());
        if (!playerSave) {
            player.setPasswordHashWithSalt(await GameConstants.PLAYER_PERSISTENCE.encryptPassword(plainPassword));
            return LoginResponses.NEW_ACCOUNT;
        }

        if (msg.getIsDiscord() !== playerSave.isDiscordLoginReturn()) {
            // User attempting Discord login on a non-Discord account
            return LoginResponses.LOGIN_BAD_SESSION_ID;
        }

        if (!GameConstants.PLAYER_PERSISTENCE.checkPassword(plainPassword, playerSave)) {
            return LoginResponses.LOGIN_INVALID_CREDENTIALS;
        }

        playerSave.applyToPlayer(player);

        return LoginResponses.LOGIN_SUCCESSFUL;
    }
}
