import { Misc } from "./Misc";
import { fs } from 'fs-extra';

export class PlayerPunishment {
    private static readonly BAN_DIRECTORY = "./data/saves/";
    private static readonly MUTE_DIRECTORY = "./data/saves/";

    public static IPSBanned: string[] = [];
    public static IPSMuted: string[] = [];
    public static AccountsBanned: string[] = [];
    public static AccountsMuted: string[] = [];

    public static init() {
        // In case we're reloading bans, reset lists first.
        this.IPSBanned = [];
        this.IPSMuted = [];
        this.AccountsBanned = [];
        this.AccountsMuted = [];

        this.initializeList(this.BAN_DIRECTORY, "IPBans", this.IPSBanned);
        this.initializeList(this.BAN_DIRECTORY, "Bans", this.AccountsBanned);
        this.initializeList(this.MUTE_DIRECTORY, "IPMutes", this.IPSMuted);
        this.initializeList(this.MUTE_DIRECTORY, "Mutes", this.AccountsMuted);
    }

    public static initializeList(directory: string, file: string, list: string[]) {
        try {
            const data = fs.readFileSync(`${directory}${file}.txt`, 'utf8');
            list.push(...data.split('\n'));
        } catch (e) {
            console.error(e);
        }
    }

    public static addBannedIP(IP: string) {
        if (!this.IPSBanned.includes(IP)) {
            this.addToFile(`${this.BAN_DIRECTORY}IPBans.txt`, IP);
        }
        this.IPSBanned.push(IP);
    }
    public static addMutedIP(IP: string) {
        if (!this.IPSMuted.includes(IP)) {
            this.addToFile(`${this.MUTE_DIRECTORY}IPMutes.txt`, IP);
        }
        this.IPSMuted.push(IP);
    }

    public static ban(p: string) {
        p = Misc.formatPlayerName(p.toLowerCase());
        if (!this.AccountsBanned.includes(p)) {
            this.addToFile(`${this.BAN_DIRECTORY}Bans.txt`, p);
        }
        this.AccountsBanned.push(p);
    }

    public static mute(p: string) {
        p = Misc.formatPlayerName(p.toLowerCase());
        if (!this.AccountsMuted.includes(p)) {
            this.addToFile(`${this.MUTE_DIRECTORY}Mutes.txt`, p);
        }
        this.AccountsMuted.push(p);
    }

    public static banned(player: string): boolean {
        player = Misc.formatPlayerName(player.toLowerCase());
        return this.AccountsBanned.includes(player);
    }

    public static muted(player: string): boolean {
        player = Misc.formatPlayerName(player.toLowerCase());
        return this.AccountsMuted.includes(player);
    }

    public static IPBanned(IP: string): boolean {
        return this.IPSBanned.includes(IP);
    }

    public static IPMuted(IP: string): boolean {
        return this.IPSMuted.includes(IP);
    }

    public static unban(player: string) {
        player = Misc.formatPlayerName(player.toLowerCase());
        this.deleteFromFile(`${this.BAN_DIRECTORY}Bans.txt`, player);
        this.AccountsBanned = this.AccountsBanned.filter(p => p !== player);
    }

    public static unmute(player: string) {
        player = Misc.formatPlayerName(player.toLowerCase());
        this.deleteFromFile(`${this.MUTE_DIRECTORY}Mutes.txt`, player);
        this.AccountsMuted = this.AccountsMuted.filter(p => p !== player);
    }

    public static reloadIPBans() {
        this.IPSBanned = [];
        this.initializeList(this.BAN_DIRECTORY, "IPBans", this.IPSBanned);
    }

    public static reloadIPMutes() {
        this.IPSMuted = [];
        this.initializeList(this.MUTE_DIRECTORY, "IPMutes", this.IPSMuted);
    }

    public static deleteFromFile(file: string, player: string) {
        try {
            let data = fs.readFileSync(file, 'utf8');
            data = data.split('\n').filter(p => p !== player).join('\n');
            fs.writeFileSync(file, data);
        } catch (e) {
            console.error(e);
        }
    }

    public static addToFile(file: string, player: string) {
        try {
            fs.appendFileSync(file, player + '\n');
        } catch (e) {
            console.error(e);
        }
    }
}