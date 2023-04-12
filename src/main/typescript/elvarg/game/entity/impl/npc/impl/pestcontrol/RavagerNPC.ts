import { CombatMethod } from '../../../../../content/combat/method/CombatMethod';
import { NPC } from '../../NPC';
import { Location } from '../../../../../model/Location';
import { RavagerCombatMethod } from '../../../../../content/combat/method/impl/npcs/pestcontrol/RavagerCombatMethod';
import { NpcIdentifiers } from '../../../../../../util/NpcIdentifiers';

function Ids(ids: number[]) {
  return function(target: any) {
    target.ids = ids;
  }
}

@Ids([NpcIdentifiers.RAVAGER, NpcIdentifiers.RAVAGER_2, NpcIdentifiers.RAVAGER_3, NpcIdentifiers.RAVAGER_4, NpcIdentifiers.RAVAGER_5])
class RavagerNPC extends NPC {
  private static readonly COMBAT_METHOD: CombatMethod = new RavagerCombatMethod();

  constructor(id: number, position: Location) {
    super(id, position);
  }

  public getCombatMethod(): CombatMethod {
    return RavagerNPC.COMBAT_METHOD;
  }
}
