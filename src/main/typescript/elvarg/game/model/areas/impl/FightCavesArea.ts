import { Boundary } from '../../../model/Boundary';
import { Player } from '../../../entity/impl/player/Player'
import { Mobile } from '../../../entity/impl/Mobile'
import { Item } from '../../../model/Item'
import { FightCaves } from '../../../content/minigames/impl/FightCaves';
import { PrivateArea } from '../impl/PrivateArea'
import { NpcIdentifiers } from '../../../../util/NpcIdentifiers'
import { GameObject } from '../../../entity/impl/object/GameObject';


export class FightCavesArea extends PrivateArea {
    public static readonly BOUNDARY = new Boundary(2368, 5056, 2431, 5119, 0);

    public postLeave(mobile: Mobile, logout: boolean): void {
        if (mobile.isPlayer() && logout) {
            mobile.moveTo(FightCaves.EXIT);
        }
    }

    public process(mobile: Mobile): void { }

    public canTeleport(player: Player): boolean {
        return false;
    }

    public canTrade(player: Player, target: Player): boolean {
        return false;
    }

    public isMulti(character: Mobile): boolean {
        return true;
    }

    public canEat(player: Player, itemId: number): boolean {
        return true;
    }

    public canDrink(player: Player, itemId: number): boolean {
        return true;
    }

    public dropItemsOnDeath(player: Player, killer: Player): boolean {
        return false;
    }
    
    public handleDeath(player: Player, killer: Player): boolean {
        player.moveTo(FightCaves.EXIT);
        //DialogueManager.start(player, 24);
        return true;
    }

    public onPlayerRightClick(player: Player, rightClicked: Player, option: number): void { }

    public defeated(player: Player, character: Mobile): void {
        if (character.isNpc()) {
            let npc = character.getAsNpc();
            if (npc.getId() === NpcIdentifiers.TZTOK_JAD) {
                player.getInventory().forceAdd(player, new Item(6570, 1));
                player.resetAttributes();
                player.getCombat().reset();
                player.moveTo(FightCaves.EXIT);
                //DialogueManager.start(player, 25);
            }
        }
    }

    public overridesNpcAggressionTolerance(player: Player, npcId: number): boolean {
        return true;
    }

    public handleObjectClick(player: Player, objectId: GameObject, type: number): boolean {
        return false;
    }
}