import { CombatMethod } from "../../../../content/combat/method/CombatMethod"
import { JadCombatMethod } from "../../../../content/combat/method/impl/npcs/JadCombatMethod"
import { NPC } from "../NPC";
import { Player } from "../../player/Player";
import { Location } from "../../../../model/Location"
import { FightCavesArea } from "../../../../model/areas/impl/FightCavesArea"

export class TztokJad extends NPC {
    private static readonly COMBAT_METHOD: CombatMethod = new JadCombatMethod();

constructor( player: Player, area: FightCavesArea, id: number, position: Location) {
    super(id, position);
    this.setOwner(player);
    area.add(this);
}

    aggressionDistance(): number {
        return 64;
    }

    getCombatMethod(): CombatMethod {
        return TztokJad.COMBAT_METHOD;
    }
}
