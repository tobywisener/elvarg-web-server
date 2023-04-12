import { Mobile } from "../../../../../entity/impl/Mobile";
import { MeleeCombatMethod } from "../MeleeCombatMethod";
import { RockCrab } from "../../../../../entity/impl/npc/impl/RockCrab";

export class RockCrabCombatMethod extends MeleeCombatMethod {
    onCombatBegan(character: Mobile, target: Mobile) {
        let npc = character.getAsNpc();

        if (npc == null) {
            return;
        }

        if (npc.getNpcTransformationId() == -1 ||
            RockCrab.ROCK_IDS.includes(npc.getNpcTransformationId())) {
            // Transform into an actual rock crab when combat starts
            npc.setNpcTransformationId(RockCrab.getTransformationId(npc.getId()));
        }

    }

    onCombatEnded(character: Mobile, target: Mobile) {
        let npc = character.getAsNpc();

        if (npc == null || npc.isDyingFunction()) {
            return;
        }

        let undoTransformId = RockCrab.getTransformationId(npc.getNpcTransformationId());
        npc.setNpcTransformationId(undoTransformId);
    }
}