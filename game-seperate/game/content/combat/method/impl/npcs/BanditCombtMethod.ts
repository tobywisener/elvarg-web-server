import { MeleeCombatMethod } from "../MeleeCombatMethod";
import { Mobile } from "../../../../../entity/impl/Mobile";
import { Equipment } from "../../../../../model/container/impl/Equipment";

export class BanditCombtMethod extends MeleeCombatMethod {
    public onCombatBegan(character: Mobile, target: Mobile) {
        if (!character || !target) {
            return;
        }

        const npc = character.getAsNpc();
        const player = target.getAsPlayer();

        if (!npc || !player) {
            return;
        }

        const zamorakItemCount = Equipment.getItemCount(player, "Zamorak", true);
        const saradominItemCount = Equipment.getItemCount(player, "Saradomin", true);

        if (saradominItemCount > 0) {
            npc.forceChat("Time to die, Saradominist filth!");
        } else if (zamorakItemCount > 0) {
            npc.forceChat("Prepare to suffer, Zamorakian scum!");
        } else {
            npc.forceChat("You chose the wrong place to start trouble!");
        }
    }
}
