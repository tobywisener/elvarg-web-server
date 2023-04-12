import { PlayerRights } from '../../../model/rights/PlayerRights';
import { Command } from '../../../model/commands/Command';
import { Player } from '../../../entity/impl/player/Player';
import { Graphic } from '../../Graphic';

export class GFXCommand implements Command {
    execute(player: Player, command: string, parts: string[]) {
        let gfx = parseInt(parts[1]);
        player.performGraphic(new Graphic(gfx, 0));
    }
    canUse(player: Player) {
        return player.getRights() == PlayerRights.OWNER || player.getRights() == PlayerRights.DEVELOPER;
    }
}