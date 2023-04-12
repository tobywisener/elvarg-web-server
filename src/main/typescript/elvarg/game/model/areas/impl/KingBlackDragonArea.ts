import { Area } from '../../../model/areas/Area';
import { Boundary } from '../../../model/Boundary';
import { Player } from '../../../entity/impl/player/Player'
import { Mobile } from '../../../entity/impl/Mobile';
import { GameObject } from '../../../entity/impl/object/GameObject';

export class KingBlackDragonArea extends Area {
    public static BOUNDARY = new Boundary(2249, 2292, 4672, 4720, 0);

    process(character: Mobile) { }

    canTeleport(player: Player) {
        return true;
    }

    canTrade(player: Player, target: Player) {
        return true;
    }

    isMulti(character: Mobile) {
        return true;
    }

    canEat(player: Player, itemId: number) {
        return true;
    }

    canDrink(player: Player, itemId: number) {
        return true;
    }

    dropItemsOnDeath(player: Player, killer: Player) {
        return true;
    }

    handleDeath(player: Player, killer: Player) {
        return false;
    }

    onPlayerRightClick(player: Player, rightClicked: Player, option: number) { }

    defeated(player: Player, character: Mobile) { }

    handleObjectClick(player: Player, objectId: GameObject, type: number) {
        return false;
    }
}