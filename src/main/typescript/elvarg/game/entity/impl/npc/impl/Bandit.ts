import { CombatMethod } from "../../../../content/combat/method/CombatMethod"
import { BanditCombtMethod } from "../../../../content/combat/method/impl/npcs/BanditCombtMethod"
import { NPC } from "../NPC";
import { Player } from "../../player/Player";
import { Location } from "../../../../model/Location"
import { Equipment } from "../../../../model/container/impl/Equipment"

export class Bandit extends NPC {
    private static COMBAT_METHOD: CombatMethod = new BanditCombtMethod();

    constructor(id: number, position: Location) {
        super(id, position);
    }

    public isAggressiveTo(player: Player): boolean {
        // Bandits are only aggressive towards players who have god affiliated items
        const saradominItemCount = Equipment.ITEM_COUNT;
        const zamorakItemCount = Equipment.ITEM_COUNT;

        return saradominItemCount > 0 || zamorakItemCount > 0;
    }

    public getCombatMethod(): CombatMethod {
        return Bandit.COMBAT_METHOD;
    }

}