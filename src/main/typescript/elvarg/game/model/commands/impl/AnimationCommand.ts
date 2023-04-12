import {Player} from '../../../entity/impl/player/Player';
import {Command} from '../../../model/commands/Command';
import { Animation } from '../../Animation';
import {PlayerRights} from '../../../model/rights/PlayerRights';


export class AnimationCommand implements Command {
    execute(player: Player, command: string, parts: string[]): void {
        let anim = parseInt(parts[1]);
        player.performAnimation(new Animation(anim));
    }

    canUse(player: Player): boolean {
        let rights = player.getRights();
        return (rights == PlayerRights.OWNER || rights == PlayerRights.DEVELOPER);
    }
}