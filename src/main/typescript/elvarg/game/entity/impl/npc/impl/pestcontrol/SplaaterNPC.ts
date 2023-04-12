
import { CombatMethod } from '../../../../../content/combat/method/CombatMethod';
import { NPC } from '../../NPC';
import { Location } from '../../../../../model/Location';
import { Player } from '../../../player/Player';
import { SplatterCombatMethod } from '../../../../../content/combat/method/impl/npcs/pestcontrol/SplatterCombatMethod';
import { NpcIdentifiers } from '../../../../../../util/NpcIdentifiers';

function Ids(ids: number[]) {
    return function(target: any) {
      target.ids = ids;
    }
}

@Ids([NpcIdentifiers.SPLATTER, NpcIdentifiers.SPLATTER_2, NpcIdentifiers.SPLATTER_3, NpcIdentifiers.SPLATTER_4, NpcIdentifiers.SPLATTER_5])
export class SplatterNPC extends NPC {
    private static readonly COMBAT_METHOD: CombatMethod = new SplatterCombatMethod();

    constructor(id: number, position: Location) {
        super(id, position);
    }

    public isAggressiveTo(player: Player): boolean {
        return false;
    }

    public getCombatMethod(): CombatMethod {
        return SplatterNPC.COMBAT_METHOD;
    }
}