import { Command } from '../../../model/commands/Command';
import { Player } from '../../../entity/impl/player/Player';
import { PlayerRights } from '../../rights/PlayerRights';
import { Sound} from '../../../../game/Sound'
import { Sounds } from '../../../../game/Sounds';

export class SoundEffectCommand implements Command {
    execute(player: Player, command: string, parts: string[]) {
        let soundId: Sound = new Sound(parseInt(parts[1]), null, null, null);
        let delay: number = parts.length == 3 ? parseInt(parts[2]) : 0;
        let loopType: number = parts.length == 4 ? parseInt(parts[3]) : 0;
        let volume: number = parts.length == 5 ? parseInt(parts[4]) : 2;
        Sounds.sendSound(player, soundId);
    }
    canUse(player: Player) {
        return player.getRights() == PlayerRights.OWNER || player.getRights() == PlayerRights.DEVELOPER;
    }
}