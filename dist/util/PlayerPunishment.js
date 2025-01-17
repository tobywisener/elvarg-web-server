"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerPunishment = void 0;
var Misc_1 = require("./Misc");
var fs_extra_1 = require("fs-extra");
var PlayerPunishment = /** @class */ (function () {
    function PlayerPunishment() {
    }
    PlayerPunishment.init = function () {
        // In case we're reloading bans, reset lists first.
        this.IPSBanned = [];
        this.IPSMuted = [];
        this.AccountsBanned = [];
        this.AccountsMuted = [];
        this.initializeList(this.BAN_DIRECTORY, "IPBans", this.IPSBanned);
        this.initializeList(this.BAN_DIRECTORY, "Bans", this.AccountsBanned);
        this.initializeList(this.MUTE_DIRECTORY, "IPMutes", this.IPSMuted);
        this.initializeList(this.MUTE_DIRECTORY, "Mutes", this.AccountsMuted);
    };
    PlayerPunishment.initializeList = function (directory, file, list) {
        try {
            var data = fs_extra_1.fs.readFileSync("".concat(directory).concat(file, ".txt"), 'utf8');
            list.push.apply(list, __spreadArray([], __read(data.split('\n')), false));
        }
        catch (e) {
            console.error(e);
        }
    };
    PlayerPunishment.addBannedIP = function (IP) {
        if (!this.IPSBanned.includes(IP)) {
            this.addToFile("".concat(this.BAN_DIRECTORY, "IPBans.txt"), IP);
        }
        this.IPSBanned.push(IP);
    };
    PlayerPunishment.addMutedIP = function (IP) {
        if (!this.IPSMuted.includes(IP)) {
            this.addToFile("".concat(this.MUTE_DIRECTORY, "IPMutes.txt"), IP);
        }
        this.IPSMuted.push(IP);
    };
    PlayerPunishment.ban = function (p) {
        p = Misc_1.Misc.formatPlayerName(p.toLowerCase());
        if (!this.AccountsBanned.includes(p)) {
            this.addToFile("".concat(this.BAN_DIRECTORY, "Bans.txt"), p);
        }
        this.AccountsBanned.push(p);
    };
    PlayerPunishment.mute = function (p) {
        p = Misc_1.Misc.formatPlayerName(p.toLowerCase());
        if (!this.AccountsMuted.includes(p)) {
            this.addToFile("".concat(this.MUTE_DIRECTORY, "Mutes.txt"), p);
        }
        this.AccountsMuted.push(p);
    };
    PlayerPunishment.banned = function (player) {
        player = Misc_1.Misc.formatPlayerName(player.toLowerCase());
        return this.AccountsBanned.includes(player);
    };
    PlayerPunishment.muted = function (player) {
        player = Misc_1.Misc.formatPlayerName(player.toLowerCase());
        return this.AccountsMuted.includes(player);
    };
    PlayerPunishment.IPBanned = function (IP) {
        return this.IPSBanned.includes(IP);
    };
    PlayerPunishment.IPMuted = function (IP) {
        return this.IPSMuted.includes(IP);
    };
    PlayerPunishment.unban = function (player) {
        player = Misc_1.Misc.formatPlayerName(player.toLowerCase());
        this.deleteFromFile("".concat(this.BAN_DIRECTORY, "Bans.txt"), player);
        this.AccountsBanned = this.AccountsBanned.filter(function (p) { return p !== player; });
    };
    PlayerPunishment.unmute = function (player) {
        player = Misc_1.Misc.formatPlayerName(player.toLowerCase());
        this.deleteFromFile("".concat(this.MUTE_DIRECTORY, "Mutes.txt"), player);
        this.AccountsMuted = this.AccountsMuted.filter(function (p) { return p !== player; });
    };
    PlayerPunishment.reloadIPBans = function () {
        this.IPSBanned = [];
        this.initializeList(this.BAN_DIRECTORY, "IPBans", this.IPSBanned);
    };
    PlayerPunishment.reloadIPMutes = function () {
        this.IPSMuted = [];
        this.initializeList(this.MUTE_DIRECTORY, "IPMutes", this.IPSMuted);
    };
    PlayerPunishment.deleteFromFile = function (file, player) {
        try {
            var data = fs_extra_1.fs.readFileSync(file, 'utf8');
            data = data.split('\n').filter(function (p) { return p !== player; }).join('\n');
            fs_extra_1.fs.writeFileSync(file, data);
        }
        catch (e) {
            console.error(e);
        }
    };
    PlayerPunishment.addToFile = function (file, player) {
        try {
            fs_extra_1.fs.appendFileSync(file, player + '\n');
        }
        catch (e) {
            console.error(e);
        }
    };
    PlayerPunishment.BAN_DIRECTORY = "./data/saves/";
    PlayerPunishment.MUTE_DIRECTORY = "./data/saves/";
    PlayerPunishment.IPSBanned = [];
    PlayerPunishment.IPSMuted = [];
    PlayerPunishment.AccountsBanned = [];
    PlayerPunishment.AccountsMuted = [];
    return PlayerPunishment;
}());
exports.PlayerPunishment = PlayerPunishment;
//# sourceMappingURL=PlayerPunishment.js.map