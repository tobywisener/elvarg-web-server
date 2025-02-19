import {Mobile} from '../../../entity/impl/Mobile'
import {Player} from '../../../entity/impl/player/Player'
import {GodwarsFollower} from '../../../entity/impl/npc/impl/GodwarsFollower'
import {Boundary} from '../../../model/Boundary';
import {Area} from '../../../model/areas/Area';
import { GameObject } from '../../../entity/impl/object/GameObject';

export class GodwarsDungeonArea extends Area {
    public static BOUNDARY = new Boundary(2800, 2950, 5200, 5400,0);

    constructor(){
        super([GodwarsDungeonArea.BOUNDARY]);
    }
    
    postEnter(character: Mobile) {
        if (character.isPlayer()) {
            let player = character.getAsPlayer();
            this.updateInterface(player);
            player.getPacketSender().sendWalkableInterface(42569);
        }
    }

    postLeave(character: Mobile, logout: boolean) {
        if (character.isPlayer()) {
            let player = character.getAsPlayer();
            player.getPacketSender().sendWalkableInterface(-1);
            for (let i = 0; i < player.getGodwarsKillcount().length; i++) {
                player.setGodwarsKillcount(i, 0);
            }
            player.getPacketSender().sendMessage("Your Godwars killcount has been reset.");
        }
    }

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

    defeated(player: Player, character: Mobile) {
        if (character instanceof GodwarsFollower) {
          let gwdFoller: GodwarsFollower = character as GodwarsFollower;
          let index: number[] = gwdFoller.getGod().getItems();
          let current: number = player.getGodwarsKillcount().length;
          player.setGodwarsKillcount(index.length, current + 1);
          this.updateInterface(player);
        }
    }

    handleObjectClick(player: Player, objectId: GameObject, type: number) {
        return false;
    }

    private updateInterface(player: Player) {
        for (let i = 0; i < player.getGodwarsKillcount().length; i++) {
            player.getPacketSender().sendString( player.getGodwarsKillcount()[i].toString(), 42575 + i);
        }
    }
}