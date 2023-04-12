import { CombatMethod } from "../../../../content/combat/method/CombatMethod"
import { ChaosFanaticCombatMethod } from "../../../../content/combat/method/impl/npcs/ChaosFanaticCombatMethod"
import { NPC } from "../NPC";
import { Location } from "../../../../model/Location"


export class ChaosFanatic extends NPC {

    private static COMBAT_METHOD = new ChaosFanaticCombatMethod();

    constructor(id: number, position: Location) {
        super(id, position);
    }

    public getCombatMethod(): CombatMethod {
        return ChaosFanatic.COMBAT_METHOD;
    }
}
