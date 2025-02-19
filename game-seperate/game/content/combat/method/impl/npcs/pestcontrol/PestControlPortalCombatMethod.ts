import { CombatMethod } from '../../../CombatMethod';
import { CombatType } from '../../../../CombatType';
import { Mobile } from '../../../../../../entity/impl/Mobile';
import { NPC } from '../../../../../../entity/impl/npc/NPC';
import { PendingHit } from '../../../../hit/PendingHit';
import { Player } from '../../../../../../entity/impl/player/Player';
import { PestControl } from '../../../../../minigames/impl/pestcontrols/PestControl'

export class PestControlPortalCombatMethod extends CombatMethod {
    public type(): CombatType {
        return CombatType.MELEE;
    }

    public hits(character: Mobile, target: Mobile): PendingHit[] {
        return [];
    }

    public attackDistance(character: Mobile): number {
        return 5;
    }

    public canAttack(character: Mobile, target: Mobile): boolean {
        return PestControl.isPortal(character.getAsNpc().getId(), false);
    }

    public onDeath(npc: NPC, killer?: Player): void {
        PestControl.healKnight(npc);
    }
}