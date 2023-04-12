
import { CombatMethod } from '../../../../../content/combat/method/CombatMethod';
import { NPC } from '../../NPC';
import { Location } from '../../../../../model/Location';
import { SpinnerCombatMethod } from '../../../../../content/combat/method/impl/npcs/pestcontrol/SpinnerCombatMethod';
import { NpcIdentifiers } from '../../../../../../util/NpcIdentifiers';

function Ids(ids: number[]) {
    return function(target: any) {
      target.ids = ids;
    }
}

@Ids([NpcIdentifiers.SPINNER, NpcIdentifiers.SPINNER_2, NpcIdentifiers.SPINNER_3, NpcIdentifiers.SPINNER_4, NpcIdentifiers.SPINNER_5])
export class SpinnerNPC extends NPC {
    private static readonly COMBAT_METHOD: CombatMethod = new SpinnerCombatMethod();

    constructor(id: number, position: Location) {
        super(id, position);
    }

    public getCombatMethod(): CombatMethod {
        return SpinnerNPC.COMBAT_METHOD;
    }
}