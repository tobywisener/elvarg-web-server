import { Player } from '../../../entity/impl/player/Player'
import { Mobile } from '../../../entity/impl/Mobile'
import { Boundary } from '../../../model/Boundary';
import { Barrows } from '../../../content/minigames/impl/Barrows'
import { Area } from '../../../model/areas/Area';
import { GameObject } from '../../../entity/impl/object/GameObject';

export class BarrowsArea extends Area {
    constructor() {
        super([new Boundary(3521, 3582, 9662, 9724, 0), new Boundary(3545, 3583, 3265, 3306, 0)]);
    }

    postEnter(character: Mobile) {
        if (character.isPlayer()) {
            let player = character.getAsPlayer();
            player.getPacketSender().sendWalkableInterface(Barrows.KILLCOUNTER_INTERFACE_ID);
            Barrows.updateInterface(player);
        }
    }

    postLeave(character: Mobile, logout: boolean) {
        if (character.isPlayer()) {
            character.getAsPlayer().getPacketSender().sendWalkableInterface(-1);
        }
    }

    process(character: Mobile) {
    }

    canTeleport(player: Player): boolean {
        return true;
    }

    canTrade(player: Player, target: Player): boolean {
        return true;
    }

    isMulti(character: Mobile): boolean {
        return false;
    }

    canEat(player: Player, itemId: number): boolean {
        return true;
    }

    canDrink(player: Player, itemId: number): boolean {
        return true;
    }

    dropItemsOnDeath(player: Player, killer: Player): boolean {
        return true;
    }

    handleDeath(player: Player, killer: Player): boolean {
        return false;
    }

    onPlayerRightClick(player: Player, rightClicked: Player, option: number) {
    }

    defeated(player: Player, character: Mobile) {
        if (character.isNpc()) {
            Barrows.brotherDeath(player, character.getAsNpc());
        }
    }

    handleObjectClick(player: Player, objectId: GameObject, type: number): boolean {
        return Barrows.handleObject(player, objectId.getId());
    }
}