"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandManager = void 0;
var Server_1 = require("../../../Server");
var Claim_1 = require("../../model/commands/impl/Claim");
var ChangePassword_1 = require("../../model/commands/impl/ChangePassword");
var LockExperience_1 = require("../../model/commands/impl/LockExperience");
var CreationDate_1 = require("../../model/commands/impl/CreationDate");
var Kdr_1 = require("../../model/commands/impl/Kdr");
var Players_1 = require("../../model/commands/impl/Players");
var OpenThread_1 = require("../../model/commands/impl/OpenThread");
var TimePlayed_1 = require("../../model/commands/impl/TimePlayed");
var Store_1 = require("../../model/commands/impl/Store");
var MaxHit_1 = require("../../model/commands/impl/MaxHit");
var Yell_1 = require("../../model/commands/impl/Yell");
var Skull_1 = require("../../model/commands/impl/Skull");
var MutePlayer_1 = require("../../model/commands/impl/MutePlayer");
var UnMutePlayer_1 = require("../../model/commands/impl/UnMutePlayer");
var IpMutePlayer_1 = require("../../model/commands/impl/IpMutePlayer");
var BanPlayer_1 = require("../../model/commands/impl/BanPlayer");
var IpBanPlayer_1 = require("../../model/commands/impl/IpBanPlayer");
var UnBanPlayer_1 = require("../../model/commands/impl/UnBanPlayer");
var UnIpMutePlayer_1 = require("../../model/commands/impl/UnIpMutePlayer");
var TeleToPlayer_1 = require("../../model/commands/impl/TeleToPlayer");
var ExitClient_1 = require("../../model/commands/impl/ExitClient");
var KickPlayer_1 = require("../../model/commands/impl/KickPlayer");
var CopyBank_1 = require("../../model/commands/impl/CopyBank");
var Bank_1 = require("../../model/commands/impl/Bank");
var Title_1 = require("../../model/commands/impl/Title");
var Runes_1 = require("../../model/commands/impl/Runes");
var BarrageCommand_1 = require("../../model/commands/impl/BarrageCommand");
var DialogueCommand_1 = require("../../model/commands/impl/DialogueCommand");
var FloodCommand_1 = require("../../model/commands/impl/FloodCommand");
var MasterCommand_1 = require("../../model/commands/impl/MasterCommand");
var ResetCommand_1 = require("../../model/commands/impl/ResetCommand");
var PNPCCommand_1 = require("../../model/commands/impl/PNPCCommand");
var SpawnNPCCommand_1 = require("../../model/commands/impl/SpawnNPCCommand");
var SpawnPermanentNPCCommand_1 = require("../../model/commands/impl/SpawnPermanentNPCCommand");
var SpawnObjectCommand_1 = require("../../model/commands/impl/SpawnObjectCommand");
var PositionDebug_1 = require("../../model/commands/impl/PositionDebug");
var ConfigCommand_1 = require("../../model/commands/impl/ConfigCommand");
var SpecCommand_1 = require("../../model/commands/impl/SpecCommand");
var GFXCommand_1 = require("../../model/commands/impl/GFXCommand");
var SoundEffectCommand_1 = require("../../model/commands/impl/SoundEffectCommand");
var AnimationCommand_1 = require("../../model/commands/impl/AnimationCommand");
var InterfaceCommand_1 = require("../../model/commands/impl/InterfaceCommand");
var ChatboxInterfaceCommand_1 = require("../../model/commands/impl/ChatboxInterfaceCommand");
var UpdateServer_1 = require("../../model/commands/impl/UpdateServer");
var AreaDebug_1 = require("../../model/commands/impl/AreaDebug");
var InfiniteHealth_1 = require("../../model/commands/impl/InfiniteHealth");
var TaskDebug_1 = require("../../model/commands/impl/TaskDebug");
var Noclip_1 = require("../../model/commands/impl/Noclip");
var Up_1 = require("../../model/commands/impl/Up");
var Down_1 = require("../../model/commands/impl/Down");
var Save_1 = require("../../model/commands/impl/Save");
var CWarInterfaceCommand_1 = require("../../model/commands/impl/CWarInterfaceCommand");
var ListSizesCommand_1 = require("../../model/commands/impl/ListSizesCommand");
var AttackRange_1 = require("../../model/commands/impl/AttackRange");
var DebugCommand_1 = require("../../model/commands/impl/DebugCommand");
var GroundItemCommand_1 = require("../../model/commands/GroundItemCommand");
var CommandManager = exports.CommandManager = /** @class */ (function () {
    function CommandManager() {
    }
    CommandManager.put = function (command) {
        var e_1, _a;
        var keys = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            keys[_i - 1] = arguments[_i];
        }
        try {
            for (var keys_1 = __values(keys), keys_1_1 = keys_1.next(); !keys_1_1.done; keys_1_1 = keys_1.next()) {
                var key = keys_1_1.value;
                CommandManager.commands.set(key, command);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (keys_1_1 && !keys_1_1.done && (_a = keys_1.return)) _a.call(keys_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    CommandManager.loadCommands = function () {
        CommandManager.commands.clear();
        /**
         * Players Command
         */
        CommandManager.put(new ChangePassword_1.ChangePassword(), "changepassword");
        CommandManager.put(new LockExperience_1.LockExperience(), "lockxp");
        CommandManager.put(new Claim_1.Claim(), "claim");
        CommandManager.put(new CreationDate_1.CreationDate(), "creationdate");
        CommandManager.put(new Kdr_1.Kdr(), "kdr");
        CommandManager.put(new Players_1.Players(), "players");
        CommandManager.put(new OpenThread_1.OpenThread(), "thread");
        CommandManager.put(new TimePlayed_1.TimePlayed(), "timeplayed");
        CommandManager.put(new GroundItemCommand_1.GroundItemCommand(), "ground");
        CommandManager.put(new Store_1.Store(), "store", "donate");
        CommandManager.put(new MaxHit_1.MaxHit(), "maxhit", "mh");
        /**
         * Donators Command
         */
        CommandManager.put(new Yell_1.Yell(), "yell");
        CommandManager.put(new Skull_1.Skull(), "skull", "redskull");
        /**
         * Moderators Commands
         */
        CommandManager.put(new MutePlayer_1.MutePlayer(), "mute");
        CommandManager.put(new UnMutePlayer_1.UnMutePlayer(), "unmute");
        CommandManager.put(new IpMutePlayer_1.IpMutePlayer(), "ipmute");
        CommandManager.put(new BanPlayer_1.BanPlayer(), "ban");
        CommandManager.put(new IpBanPlayer_1.IpBanPlayer(), "ipban");
        CommandManager.put(new UnBanPlayer_1.UnBanPlayer(), "unban");
        CommandManager.put(new UnIpMutePlayer_1.UnIpMutePlayer(), "unipmute");
        CommandManager.put(new TeleToPlayer_1.TeleToPlayer(), "teleto");
        CommandManager.put(new ExitClient_1.ExitClient(), "exit");
        CommandManager.put(new KickPlayer_1.KickPlayer(), "kick");
        CommandManager.put(new CopyBank_1.CopyBank(), "copybank");
        CommandManager.put(new Bank_1.Bank(), "bank");
        CommandManager.put(new Title_1.Title(), "title");
        CommandManager.put(new Runes_1.Runes(), "runes");
        CommandManager.put(new BarrageCommand_1.BarrageCommand(), "barrage");
        /**
         * Developer Commands
         */
        CommandManager.put(new DialogueCommand_1.DialogueCommand(), "dialogue");
        CommandManager.put(new FloodCommand_1.FloodCommand(), "flood");
        CommandManager.put(new MasterCommand_1.MasterCommand(), "master");
        CommandManager.put(new ResetCommand_1.ResetCommand(), "reset");
        CommandManager.put(new PNPCCommand_1.PNPCCommand(), "pnpc");
        CommandManager.put(new SpawnNPCCommand_1.SpawnNPCCommand(), "npc");
        CommandManager.put(new SpawnPermanentNPCCommand_1.SpawnPermanentNPCCommand(), "n");
        CommandManager.put(new SpawnObjectCommand_1.SpawnObjectCommand(), "object");
        CommandManager.put(new PositionDebug_1.PositionDebug(), "mypos");
        CommandManager.put(new ConfigCommand_1.ConfigCommand(), "config");
        CommandManager.put(new SpecCommand_1.SpecCommand(), "spec");
        CommandManager.put(new GFXCommand_1.GFXCommand(), "gfx");
        CommandManager.put(new SoundEffectCommand_1.SoundEffectCommand(), "sound");
        CommandManager.put(new AnimationCommand_1.AnimationCommand(), "anim");
        CommandManager.put(new InterfaceCommand_1.InterfaceCommand(), "interface");
        CommandManager.put(new ChatboxInterfaceCommand_1.ChatboxInterfaceCommand(), "chatboxinterface");
        CommandManager.put(new UpdateServer_1.UpdateServer(), "update");
        CommandManager.put(new AreaDebug_1.AreaDebug(), "area");
        CommandManager.put(new InfiniteHealth_1.InfiniteHealth(), "infhp");
        CommandManager.put(new TaskDebug_1.TaskDebug(), "taskdebug");
        CommandManager.put(new Noclip_1.Noclip(), "noclip");
        CommandManager.put(new Up_1.Up(), "up");
        CommandManager.put(new Down_1.Down(), "down");
        CommandManager.put(new Save_1.Save(), "save");
        CommandManager.put(new CWarInterfaceCommand_1.CWarInterfaceCommand(), "cwar");
        CommandManager.put(new ListSizesCommand_1.ListSizesCommand(), "listsizes");
        CommandManager.put(new AttackRange_1.AttackRange(), "atkrange", "attackrange");
        if (!Server_1.Server.PRODUCTION) {
            CommandManager.put(new DebugCommand_1.DebugCommand(), "t");
        }
        CommandManager.loadCommands();
    };
    CommandManager.commands = new Map();
    return CommandManager;
}());
//# sourceMappingURL=CommandManager.js.map