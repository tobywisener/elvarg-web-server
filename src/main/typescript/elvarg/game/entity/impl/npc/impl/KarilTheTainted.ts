import { CombatMethod } from "../../../../content/combat/method/CombatMethod"
import { RangedData, Ammunition, RangedWeapon } from "../../../../content/combat/ranged/RangedData"
import { NPC } from "../NPC"
import { Location } from "../../../../model/Location"
import { CombatFactory } from "../../../../content/combat/CombatFactory"

export class KarilTheTainted extends NPC {

    constructor(id: number, position: Location) {
        super(id, position);

        this.getCombat().setRangedWeapon(RangedWeapon.KARILS_CROSSBOW);
        this.getCombat().setAmmunition(Ammunition.BOLT_RACK);
    }

    public getCombatMethod(): CombatMethod {
        return CombatFactory.RANGED_COMBAT;
    }

}
