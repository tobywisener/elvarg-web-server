
import { CombatMethod } from '../../../../../content/combat/method/CombatMethod';
import { NPC } from '../../NPC';
import { Location } from '../../../../../model/Location';
import { TorcherCombatMethod } from '../../../../../content/combat/method/impl/npcs/pestcontrol/TorcherCombatMethod';
import { NpcIdentifiers } from '../../../../../../util/NpcIdentifiers';

function Ids(ids: number[]) {
    return function(target: any) {
      target.ids = ids;
    }
  }

@Ids([NpcIdentifiers.TORCHER, NpcIdentifiers.TORCHER_3, NpcIdentifiers.TORCHER_5, NpcIdentifiers.TORCHER_7, NpcIdentifiers.TORCHER_9, NpcIdentifiers.TORCHER_10])
export class TorcherNPC extends NPC {
    private static readonly COMBAT_METHOD: CombatMethod = new TorcherCombatMethod();

    constructor(id: number, position: Location) {
        super(id, position);
    }

    public getCombatMethod(): CombatMethod {
        return TorcherNPC.COMBAT_METHOD;
    }
}