import { CombatSpells } from "../../../../content/combat/magic/CombatSpells"
import { CombatMethod } from "../../../../content/combat/method/CombatMethod"
import { NPC } from "../NPC";
import { Location } from "../../../../model/Location"
import { CombatFactory } from "../../../../content/combat/CombatFactory"

export class AhrimTheBlighted extends NPC {
    constructor(id: number, position: Location) {
        super(id, position);
        this.getCombat().setAutocastSpell(CombatSpells.FIRE_WAVE.getSpell());
    }

    public getCombatMethod(): CombatMethod {
        return CombatFactory.MAGIC_COMBAT;
    }
}