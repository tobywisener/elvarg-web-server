
import { CombatMethod } from '../../../../../content/combat/method/CombatMethod';
import { NPC } from '../../NPC';
import { Location } from '../../../../../model/Location';
import { ShifterCombatMethod } from '../../../../../content/combat/method/impl/npcs/pestcontrol/ShifterCombatMethod';
import { NpcIdentifiers } from '../../../../../../util/NpcIdentifiers';
function Ids(ids: number[]) {
    return function(target: any) {
      target.ids = ids;
    }
}

@Ids([NpcIdentifiers.SHIFTER, NpcIdentifiers.SHIFTER_3, NpcIdentifiers.SHIFTER_5, NpcIdentifiers.SHIFTER_7, NpcIdentifiers.SHIFTER_9])
export class ShifterNPC extends NPC {
    private static readonly COMBAT_METHOD: CombatMethod = new ShifterCombatMethod();

    constructor(id: number, position: Location) {
        super(id, position);
    }

    public getCombatMethod(): CombatMethod {
        return ShifterNPC.COMBAT_METHOD;
    }
}