import { MeleeCombatMethod } from "../../MeleeCombatMethod";
import { CombatType } from "../../../../CombatType";
import { Player } from "../../../../../../entity/impl/player/Player";
import { Graphic } from "../../../../../../model/Graphic";
import { Mobile } from "../../../../../../entity/impl/Mobile";
import { World } from "../../../../../../World";
import { NPC } from "../../../../../../entity/impl/npc/NPC";
import { HitDamage } from "../../../../hit/HitDamage";
import { HitMask } from "../../../../hit/HitMask";
import { Misc } from "../../../../../../../util/Misc";
export class SplatterCombatMethod extends MeleeCombatMethod {

    type(): CombatType {
      return CombatType.MELEE;
    }
  
    onDeath(npc: NPC, killer: Player | null): void {
      npc.performGraphic(new Graphic(650));
      const inDistance: Mobile[] = [];
      World.getPlayers().forEach((p) => {
        if (p && !p.isDyingReturn() && p.getLocation().isWithinDistance(npc.getLocation(), 1)) {
          inDistance.push(p);
        }
      });
      World.getNpcs().forEach((n) => {
        if (n && !n.isDyingFunction() && n.getDefinition().isAttackable() && n.getLocation().isWithinDistance(npc.getLocation(), 1)) {
          inDistance.push(n);
        }
      });
      for (const entity of inDistance) {
        if (entity) {
          if (entity.getLocation().isWithinDistance(npc.getLocation(), 1)) {
            entity.getCombat().getHitQueue().addPendingDamage([new HitDamage(Misc.random(5, 25), HitMask.RED)]);
          }
        }
      }
    }
  
  }
  
  
  
  
  
  