import { Server } from '../../../Server';
import { Claim } from '../../model/commands/impl/Claim'
import { ChangePassword } from '../../model/commands/impl/ChangePassword'
import { LockExperience } from '../../model/commands/impl/LockExperience'
import { CreationDate } from '../../model/commands/impl/CreationDate'
import { Kdr } from '../../model/commands/impl/Kdr'
import { Players } from '../../model/commands/impl/Players'
import { OpenThread } from '../../model/commands/impl/OpenThread'
import { TimePlayed } from '../../model/commands/impl/TimePlayed'
import { Store } from '../../model/commands/impl/Store'
import { MaxHit } from '../../model/commands/impl/MaxHit'
import { Yell } from '../../model/commands/impl/Yell'
import { Skull } from '../../model/commands/impl/Skull'
import { MutePlayer } from '../../model/commands/impl/MutePlayer'
import { UnMutePlayer } from '../../model/commands/impl/UnMutePlayer'
import { IpMutePlayer } from '../../model/commands/impl/IpMutePlayer'
import { BanPlayer } from '../../model/commands/impl/BanPlayer'
import { IpBanPlayer } from '../../model/commands/impl/IpBanPlayer'
import { UnBanPlayer } from '../../model/commands/impl/UnBanPlayer'
import { UnIpMutePlayer } from '../../model/commands/impl/UnIpMutePlayer'
import { TeleToPlayer } from '../../model/commands/impl/TeleToPlayer'
import { ExitClient } from '../../model/commands/impl/ExitClient'
import { KickPlayer } from '../../model/commands/impl/KickPlayer'
import { CopyBank } from '../../model/commands/impl/CopyBank'
import { Bank } from '../../model/commands/impl/Bank'
import { Title } from '../../model/commands/impl/Title'
import { Runes } from '../../model/commands/impl/Runes'
import { BarrageCommand } from '../../model/commands/impl/BarrageCommand'
import { DialogueCommand } from '../../model/commands/impl/DialogueCommand'
import { FloodCommand } from '../../model/commands/impl/FloodCommand'
import { MasterCommand } from '../../model/commands/impl/MasterCommand'
import { ResetCommand } from '../../model/commands/impl/ResetCommand'
import { PNPCCommand } from '../../model/commands/impl/PNPCCommand'
import { SpawnNPCCommand } from '../../model/commands/impl/SpawnNPCCommand'
import { SpawnPermanentNPCCommand } from '../../model/commands/impl/SpawnPermanentNPCCommand'
import { SpawnObjectCommand } from '../../model/commands/impl/SpawnObjectCommand'
import { PositionDebug } from '../../model/commands/impl/PositionDebug'
import { ConfigCommand } from '../../model/commands/impl/ConfigCommand'
import { SpecCommand } from '../../model/commands/impl/SpecCommand'
import { GFXCommand } from '../../model/commands/impl/GFXCommand'
import { SoundEffectCommand } from '../../model/commands/impl/SoundEffectCommand'
import { AnimationCommand } from '../../model/commands/impl/AnimationCommand'
import { InterfaceCommand } from '../../model/commands/impl/InterfaceCommand'
import { ChatboxInterfaceCommand } from '../../model/commands/impl/ChatboxInterfaceCommand'
import { UpdateServer } from '../../model/commands/impl/UpdateServer'
import { AreaDebug } from '../../model/commands/impl/AreaDebug'
import { InfiniteHealth } from '../../model/commands/impl/InfiniteHealth'
import { TaskDebug } from '../../model/commands/impl/TaskDebug'
import { Noclip } from '../../model/commands/impl/Noclip'
import { Up } from '../../model/commands/impl/Up'
import { Down } from '../../model/commands/impl/Down'
import { Save } from '../../model/commands/impl/Save'
import { CWarInterfaceCommand } from '../../model/commands/impl/CWarInterfaceCommand'
import { ListSizesCommand } from '../../model/commands/impl/ListSizesCommand'
import { AttackRange } from '../../model/commands/impl/AttackRange'
import { DebugCommand } from '../../model/commands/impl/DebugCommand'
import { Command } from '../../model/commands/Command'
import { GroundItemCommand } from '../../model/commands/GroundItemCommand'

export class CommandManager {

    public static commands: Map<string, Command> = new Map<string, Command>();

    private static put(command: Command, ...keys: string[]) {
        for (const key of keys) {
            CommandManager.commands.set(key, command);
        }
    }

    public static loadCommands(): void {
        CommandManager.commands.clear();

        /**
         * Players Command
         */
        CommandManager.put(new ChangePassword(), "changepassword");
        CommandManager.put(new LockExperience(), "lockxp");
        CommandManager.put(new Claim(), "claim");
        CommandManager.put(new CreationDate(), "creationdate");
        CommandManager.put(new Kdr(), "kdr");
        CommandManager.put(new Players(), "players");
        CommandManager.put(new OpenThread(), "thread");
        CommandManager.put(new TimePlayed(), "timeplayed");
        CommandManager.put(new GroundItemCommand(), "ground");
        CommandManager.put(new Store(), "store", "donate");
        CommandManager.put(new MaxHit(), "maxhit", "mh");

        /**
         * Donators Command
         */
        CommandManager.put(new Yell(), "yell");
        CommandManager.put(new Skull(), "skull", "redskull");

        /**
         * Moderators Commands
         */
        CommandManager.put(new MutePlayer(), "mute");
        CommandManager.put(new UnMutePlayer(), "unmute");
        CommandManager.put(new IpMutePlayer(), "ipmute");
        CommandManager.put(new BanPlayer(), "ban");
        CommandManager.put(new IpBanPlayer(), "ipban");
        CommandManager.put(new UnBanPlayer(), "unban");
        CommandManager.put(new UnIpMutePlayer(), "unipmute");
        CommandManager.put(new TeleToPlayer(), "teleto");
        CommandManager.put(new ExitClient(), "exit");
        CommandManager.put(new KickPlayer(), "kick");
        CommandManager.put(new CopyBank(), "copybank");
        CommandManager.put(new Bank(), "bank");
        CommandManager.put(new Title(), "title");
        CommandManager.put(new Runes(), "runes");
        CommandManager.put(new BarrageCommand(), "barrage");

        /**
         * Developer Commands
         */
        CommandManager.put(new DialogueCommand(), "dialogue");
        CommandManager.put(new FloodCommand(), "flood");
        CommandManager.put(new MasterCommand(), "master");
        CommandManager.put(new ResetCommand(), "reset");
        CommandManager.put(new PNPCCommand(), "pnpc");
        CommandManager.put(new SpawnNPCCommand(), "npc");
        CommandManager.put(new SpawnPermanentNPCCommand(), "n");
        CommandManager.put(new SpawnObjectCommand(), "object");
        CommandManager.put(new PositionDebug(), "mypos");
        CommandManager.put(new ConfigCommand(), "config");
        CommandManager.put(new SpecCommand(), "spec");
        CommandManager.put(new GFXCommand(), "gfx");
        CommandManager.put(new SoundEffectCommand(), "sound");
        CommandManager.put(new AnimationCommand(), "anim");
        CommandManager.put(new InterfaceCommand(), "interface");
        CommandManager.put(new ChatboxInterfaceCommand(), "chatboxinterface");
        CommandManager.put(new UpdateServer(), "update");
        CommandManager.put(new AreaDebug(), "area");
        CommandManager.put(new InfiniteHealth(), "infhp");
        CommandManager.put(new TaskDebug(), "taskdebug");
        CommandManager.put(new Noclip(), "noclip");
        CommandManager.put(new Up(), "up");
        CommandManager.put(new Down(), "down");
        CommandManager.put(new Save(), "save");
        CommandManager.put(new CWarInterfaceCommand(), "cwar");
        CommandManager.put(new ListSizesCommand(), "listsizes");
        CommandManager.put(new AttackRange(), "atkrange", "attackrange");

        if (!Server.PRODUCTION) {
            CommandManager.put(new DebugCommand(), "t");
        }

        CommandManager.loadCommands();

    }
}