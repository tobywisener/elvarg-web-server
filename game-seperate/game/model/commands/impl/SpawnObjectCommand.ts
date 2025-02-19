import { Command } from '../../../model/commands/Command';
import { Player } from '../../../entity/impl/player/Player';
import { GameObject } from '../../../entity/impl/object/GameObject';
import { ObjectManager } from '../../../entity/impl/object/ObjectManager';
import { PlayerRights } from '../../rights/PlayerRights';

export class SpawnObjectCommand implements Command {

    execute(player: Player, command: string, parts: string[]) {
        let id = parseInt(parts[1]);
        let type = parts.length == 3 ? parseInt(parts[2]) : 10;
        let face = parts.length == 4 ? parseInt(parts[3]) : 0;
        let gameObject = new GameObject(id, player.getLocation().clone(), type, face, player.getPrivateArea());
        ObjectManager.register(gameObject, true);
    }

    canUse(player: Player) {
        let rights = player.getRights();
        return (rights == PlayerRights.OWNER || rights == PlayerRights.DEVELOPER);
    }
}