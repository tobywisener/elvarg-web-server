import { MeleeCombatMethod } from "../MeleeCombatMethod";
import { Animation } from "../../../../../model/Animation";
import { Graphic } from "../../../../../model/Graphic";
import { Priority } from "../../../../../model/Priority";
import { PendingHit } from "../../../hit/PendingHit";
import { Mobile } from "../../../../../entity/impl/Mobile";
import { CombatSpecial } from "../../../CombatSpecial";
import { GraphicHeight } from "../../../../../model/GraphicHeight";
import { Player } from '../../../../../entity/impl/player/Player';
export class AbyssalWhipCombatMethod extends MeleeCombatMethod {
    private static readonly ANIMATION = new Animation(1658);
    private static readonly GRAPHIC = new Graphic(341, GraphicHeight.HIGH);

    start(character: Mobile, target: Mobile) {
        CombatSpecial.drain(character, CombatSpecial.ABYSSAL_WHIP.getDrainAmount());
        character.performAnimation(AbyssalWhipCombatMethod.ANIMATION);
    }

    handleAfterHitEffects(hit: PendingHit) {
        const target = hit.getTarget();
        if (target.getHitpoints() <= 0) {
            return;
        }
        target.performGraphic(AbyssalWhipCombatMethod.GRAPHIC);
        if (target.isPlayer()) {
            const player = target as Player;
            let totalRunEnergy = player.getRunEnergy() - 25;
            if (totalRunEnergy < 0) {
                totalRunEnergy = 0;
            }
            player.setRunEnergy(totalRunEnergy);
            player.getPacketSender().sendRunEnergy();
            if (totalRunEnergy === 0) {
                player.setRunning(false);
                player.getPacketSender().sendRunStatus();
            }
        }
    }
}