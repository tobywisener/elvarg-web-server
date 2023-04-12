import { NPC } from "../../../../../../entity/impl/npc/NPC";
import { Mobile } from "../../../../../../entity/impl/Mobile";
import { MeleeCombatMethod } from "../../MeleeCombatMethod";
export class SpinnerCombatMethod extends MeleeCombatMethod {

    onTick(npc: NPC, target: Mobile | null): void {
      console.error(target === null);
    }
  
  }