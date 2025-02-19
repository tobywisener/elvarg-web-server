import { CombatMethod } from '../../../../../content/combat/method/CombatMethod';
import { NPC } from '../../NPC';
import { Location } from '../../../../../model/Location';
import { Player } from '../../../player/Player';
import { PestControlPortalCombatMethod } from '../../../../../content/combat/method/impl/npcs/pestcontrol/PestControlPortalCombatMethod';
import { NpcIdentifiers } from '../../../../../../util/NpcIdentifiers';

function Ids(ids: number[]) {
  return function(target: any) {
    target.ids = ids;
  }
}

@Ids([NpcIdentifiers.PORTAL_13, NpcIdentifiers.PORTAL_14, NpcIdentifiers.PORTAL_15, NpcIdentifiers.PORTAL_16, NpcIdentifiers.PORTAL_9, NpcIdentifiers.PORTAL_10, NpcIdentifiers.PORTAL_11, NpcIdentifiers.PORTAL_12])
export class PestControlPortalNPC extends NPC {
  private static readonly COMBAT_METHOD: CombatMethod = new PestControlPortalCombatMethod();

  constructor(id: number, position: Location) {
    super(id, position);
  }

  public isAggressiveTo(player: Player): boolean {
    return false;
  }

  public getCombatMethod(): CombatMethod {
    return PestControlPortalNPC.COMBAT_METHOD;
  }
}