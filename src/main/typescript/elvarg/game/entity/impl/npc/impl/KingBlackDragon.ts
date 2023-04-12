import { CombatMethod } from "../../../../content/combat/method/CombatMethod"
import { KingBlackDragonMethod } from "../../../../content/combat/method/impl/npcs/KingBlackDragonMethod"
import { NPC } from "../NPC"
import { Location } from "../../../../model/Location"


export class KingBlackDragon extends NPC {
    private static readonly COMBAT_METHOD: CombatMethod = new KingBlackDragonMethod();

    constructor(id: number, position: Location) {
        super(id, position);
    }
    public getCombatMethod(): CombatMethod {
        return KingBlackDragon.COMBAT_METHOD;
    }

}