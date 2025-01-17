import { CombatSpells } from "../../../../content/combat/magic/CombatSpells"
import { CombatMethod } from "../../../../content/combat/method/CombatMethod"
import { RangedData } from "../../../../content/combat/ranged/RangedData"
import { Ids } from "../../../../model/Ids"
import { Location } from "../../../../model/Location"
import { CombatFactory } from "../../../../content/combat/CombatFactory"
import { NpcIdentifiers } from "../../../../../util/NpcIdentifiers"
import { NPC } from "../NPC"


export class ElderChaosDruid extends NPC {

    constructor(id: number, position: Location) {
        super(id, position);

        this.getCombat().setAutocastSpell(CombatSpells.WIND_WAVE.getSpell());
    }

    public getCombatMethod(): CombatMethod {
        return CombatFactory.MAGIC_COMBAT;
    }
}
