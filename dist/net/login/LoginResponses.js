"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginResponses = void 0;
var Server_1 = require("../../Server");
// import { World } from '../../game/World';
// import { Player } from '../../game/entity/impl/player/Player';
var Misc_1 = require("../../util/Misc");
var DiscordUtil_1 = require("../../util/DiscordUtil");
var PlayerPunishment_1 = require("../../util/PlayerPunishment");
// import { GameConstants } from '../../game/GameConstants';
var LoginResponses = /** @class */ (function () {
    function LoginResponses() {
    }
    // public static async evaluate(player: Player, msg: LoginDetailsMessage) {
    LoginResponses.evaluate = function (player, msg) {
        return __awaiter(this, void 0, void 0, function () {
            var playerLoadingResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // if (World.getPlayers().isFull()) {
                        //     return this.LOGIN_WORLD_FULL;
                        // }
                        if (Server_1.Server.isUpdating()) {
                            return [2 /*return*/, this.LOGIN_GAME_UPDATE];
                        }
                        if (player.getUsername().startsWith(" ") ||
                            player.getUsername().endsWith(" ") ||
                            !Misc_1.Misc.isValidName(player.getUsername())) {
                            return [2 /*return*/, this.INVALID_CREDENTIALS_COMBINATION];
                        }
                        // if (World.getPlayerByName(player.getUsername())) {
                        //     return this.LOGIN_ACCOUNT_ONLINE;
                        // }
                        if (PlayerPunishment_1.PlayerPunishment.banned(player.getUsername())) {
                            return [2 /*return*/, this.LOGIN_DISABLED_ACCOUNT];
                        }
                        if (PlayerPunishment_1.PlayerPunishment.IPBanned(msg.getHost())) {
                            return [2 /*return*/, LoginResponses.LOGIN_DISABLED_IP];
                        }
                        return [4 /*yield*/, LoginResponses.getPlayerResult(player, msg)];
                    case 1:
                        playerLoadingResponse = _a.sent();
                        // New player?
                        if (playerLoadingResponse === this.NEW_ACCOUNT) {
                            player.setNewPlayer(true);
                            player.setCreationDate(new Date());
                            playerLoadingResponse = this.LOGIN_SUCCESSFUL;
                        }
                        return [2 /*return*/, playerLoadingResponse];
                }
            });
        });
    };
    // private static async getDiscordResult(player: Player, msg: LoginDetailsMessage): Promise<number> {
    LoginResponses.getDiscordResult = function (player, msg) {
        return __awaiter(this, void 0, void 0, function () {
            var discordInfo, ex_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        discordInfo = void 0;
                        if (!(msg.getUsername() === DiscordUtil_1.DiscordUtil.DiscordConstants.USERNAME_AUTHZ_CODE)) return [3 /*break*/, 2];
                        return [4 /*yield*/, DiscordUtil_1.DiscordUtil.getDiscordInfoWithCode(msg.getPassword())];
                    case 1:
                        discordInfo = _a.sent();
                        return [3 /*break*/, 5];
                    case 2:
                        if (!(msg.getUsername() === DiscordUtil_1.DiscordUtil.DiscordConstants.USERNAME_CACHED_TOKEN)) return [3 /*break*/, 4];
                        if (!DiscordUtil_1.DiscordUtil.isTokenValid(msg.getPassword()))
                            return [2 /*return*/, LoginResponses.LOGIN_INVALID_CREDENTIALS];
                        return [4 /*yield*/, DiscordUtil_1.DiscordUtil.getDiscordInfoWithToken(msg.getPassword())];
                    case 3:
                        discordInfo = _a.sent();
                        return [3 /*break*/, 5];
                    case 4: return [2 /*return*/, LoginResponses.LOGIN_INVALID_CREDENTIALS];
                    case 5:
                        player.setUsername(discordInfo.username);
                        // let playerSave = GameConstants.PLAYER_PERSISTENCE.load(player.getUsername());
                        // if (!playerSave) {
                        //     player.setDiscordLogin(true);
                        //     player.setCachedDiscordAccessToken(discordInfo.token);
                        //     player.setPasswordHashWithSalt(discordInfo.password);
                        //     return LoginResponses.NEW_ACCOUNT;
                        // }
                        // playerSave.applyToPlayer(player);
                        return [2 /*return*/, LoginResponses.LOGIN_SUCCESSFUL];
                    case 6:
                        ex_1 = _a.sent();
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/, LoginResponses.LOGIN_INVALID_CREDENTIALS];
                }
            });
        });
    };
    // private static async getPlayerResult(player: Player, msg: LoginDetailsMessage) {
    LoginResponses.getPlayerResult = function (player, msg) {
        return __awaiter(this, void 0, void 0, function () {
            var plainPassword;
            return __generator(this, function (_a) {
                plainPassword = msg.getPassword();
                if (msg.getIsDiscord()) {
                    return [2 /*return*/, LoginResponses.getDiscordResult(player, msg)];
                }
                // let playerSave = GameConstants.PLAYER_PERSISTENCE.load(player.getUsername());
                // if (!playerSave) {
                //     player.setPasswordHashWithSalt(await GameConstants.PLAYER_PERSISTENCE.encryptPassword(plainPassword));
                //     return LoginResponses.NEW_ACCOUNT;
                // }
                // if (msg.getIsDiscord() !== playerSave.isDiscordLoginReturn()) {
                //     // User attempting Discord login on a non-Discord account
                //     return LoginResponses.LOGIN_BAD_SESSION_ID;
                // }
                // if (!GameConstants.PLAYER_PERSISTENCE.checkPassword(plainPassword, playerSave)) {
                //     return LoginResponses.LOGIN_INVALID_CREDENTIALS;
                // }
                // playerSave.applyToPlayer(player);
                return [2 /*return*/, LoginResponses.LOGIN_SUCCESSFUL];
            });
        });
    };
    LoginResponses.LOGIN_SUCCESSFUL = 2;
    LoginResponses.LOGIN_INVALID_CREDENTIALS = 3;
    LoginResponses.LOGIN_DISABLED_ACCOUNT = 4;
    LoginResponses.LOGIN_DISABLED_COMPUTER = 22;
    LoginResponses.LOGIN_DISABLED_IP = 27;
    LoginResponses.LOGIN_ACCOUNT_ONLINE = 5;
    LoginResponses.LOGIN_GAME_UPDATE = 6;
    LoginResponses.LOGIN_WORLD_FULL = 7;
    LoginResponses.LOGIN_CONNECTION_LIMIT = 9;
    LoginResponses.LOGIN_BAD_SESSION_ID = 10;
    LoginResponses.LOGIN_REJECT_SESSION = 11;
    LoginResponses.INVALID_CREDENTIALS_COMBINATION = 28;
    LoginResponses.OLD_CLIENT_VERSION = 30;
    LoginResponses.NEW_ACCOUNT = -1;
    return LoginResponses;
}());
exports.LoginResponses = LoginResponses;
//# sourceMappingURL=LoginResponses.js.map