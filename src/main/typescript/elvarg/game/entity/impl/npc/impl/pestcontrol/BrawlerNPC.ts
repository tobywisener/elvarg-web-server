import { NPC } from "../../NPC";
import { CombatMethod } from "../../../../../content/combat/method/CombatMethod";
import { Location } from "../../../../../model/Location";
import { BrawlerCombatMethod } from "../../../../../content/combat/method/impl/npcs/pestcontrol/BrawlerCombatMethod";
import { NpcIdentifiers } from "../../../../../../util/NpcIdentifiers";
function Ids(ids: number[]) {
  return function(target: any) {
    target.ids = ids;
  }
}

@Ids([NpcIdentifiers.BRAWLER, NpcIdentifiers.BRAWLER_2, NpcIdentifiers.BRAWLER_3, NpcIdentifiers.BRAWLER_4, NpcIdentifiers.BRAWLER_5])
class BrawlerNPC extends NPC {
  private static readonly COMBAT_METHOD: CombatMethod = new BrawlerCombatMethod();

  constructor(id: number, position: Location) {
    super(id, position);
  }

  public getCombatMethod(): CombatMethod {
    return BrawlerNPC.COMBAT_METHOD;
  }
}