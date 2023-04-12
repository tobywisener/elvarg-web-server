import { CombatMethod } from "../../../../content/combat/method/CombatMethod"
import { CallistoCombatMethod } from "../../../../content/combat/method/impl/npcs/CallistoCombatMethod"
import { NPC } from "../NPC";
import { Location } from "../../../../model/Location"

export class Callisto extends NPC {

    private static COMBAT_METHOD = new CallistoCombatMethod();

    constructor(id: number, position: Location) {
        super(id, position);
    }

    public getCombatMethod(): CombatMethod {
        return Callisto.COMBAT_METHOD;
    }
}
