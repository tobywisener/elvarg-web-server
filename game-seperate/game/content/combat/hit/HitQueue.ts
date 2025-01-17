import { HitDamage } from "./HitDamage"
import { PendingHit } from "./PendingHit";
import { Mobile } from "../../../entity/impl/Mobile";
import { Flag } from "../../../model/Flag";
import { CombatFactory } from "../../../content/combat/CombatFactory";


export class HitQueue {
    private pendingHits: PendingHit[] = [];
    private pendingDamage: HitDamage[] = [];

    public process(character: Mobile) {
        if (character.getHitpoints() <= 0) {
            this.pendingHits = [];
            this.pendingDamage = [];
            return;
        }

        for (let i = 0; i < this.pendingHits.length; i++) {
            const hit = this.pendingHits[i];
            if (hit == null || hit.getTarget() == null || hit.getAttacker() == null || hit.getTarget().isUntargetable() || hit.getAttacker().getHitpoints() <= 0) {
                this.pendingHits.splice(i, 1);
                continue;
            }

            if (hit.getAndDecrementDelay() <= 0) {
                CombatFactory.executeHit(hit);
                this.pendingHits.splice(i, 1);
            }
        }

        if (this.pendingDamage.length > 0) {
            if (!character.getUpdateFlag().flagged(Flag.SINGLE_HIT)) {
                const firstHit = this.pendingDamage.shift();

                // Check if it's present
                if (firstHit != null) {

                    // Update entity hit data and deal the actual damage.
                    character.setPrimaryHit(character.decrementHealth(firstHit));
                    character.getUpdateFlag().flag(Flag.SINGLE_HIT);
                }
            }

            // Update the secondary hit for this entity.
            if (!character.getUpdateFlag().flagged(Flag.DOUBLE_HIT)) {

                // Attempt to fetch a second hit.
                const secondHit = this.pendingDamage.shift();

                // Check if it's present
                if (secondHit != null){
                

                    // Update entity hit data and deal the actual damage.
                    character.setSecondaryHit(character.decrementHealth(secondHit));
                    character.getUpdateFlag().flag(Flag.DOUBLE_HIT);
                }
            }
        }
    }

    public addPendingHit(c_h: PendingHit) {
        this.pendingHits.push(c_h);
    }

    public addPendingDamage(hits: HitDamage[]) {
        hits.filter(h => h != null).forEach(h => this.pendingDamage.push(h));
    }

    public getAccumulatedDamage(): number {
        let hitDmg = this.pendingHits.filter(pd => pd.getExecutedInTicks() < 2).map(pd => pd.getTotalDamage()).reduce((a, b) => a + b);
        let dmg = this.pendingDamage.map(h => h.getDamage()).reduce((a, b) => a + b);
        return hitDmg + dmg;
    }

    public isEmpty(exception: Mobile): boolean {
        for (let hit of this.pendingHits) {
          if (hit == null) {
            continue;
          }
          if (hit.getAttacker() != null) {
            if (hit.getAttacker() !== exception) {
              return false;
            }
          }
        }
        return true;
      }
}
