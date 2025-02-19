import { CombatMethod } from "../../../../content/combat/method/CombatMethod"
import { CrazyArchaeologistCombatMethod } from "../../../../content/combat/method/impl/npcs/CrazyArchaeologistCombatMethod"
import { NPC } from "../NPC";
import { Ids } from "../../../../model/Ids"
import { Location } from "../../../../model/Location"
import { NpcIdentifiers } from "../../../../../util/NpcIdentifiers"

export class CrazyArchaeologist extends NPC {

    private static COMBAT_METHOD = new CrazyArchaeologistCombatMethod();

    constructor(id: number, position: Location) {
        super(id, position);
    }

    public static getCombatMethod() {
        return CrazyArchaeologist.COMBAT_METHOD;
    }

}
