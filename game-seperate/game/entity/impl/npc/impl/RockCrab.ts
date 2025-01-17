import { CombatMethod } from "../../../../content/combat/method/CombatMethod";
import { RockCrabCombatMethod } from "../../../../content/combat/method/impl/npcs/RockCrabCombatMethod";
import { NPC } from "../NPC";
import { Player } from "../../player/Player";
import { Animation } from "../../../../model/Animation";
import { Location } from "../../../../model/Location";
import { NpcIdentifiers } from "../../../../../util/NpcIdentifiers";


export class RockCrab extends NPC {
    private static readonly COMBAT_METHOD = new RockCrabCombatMethod();
    public static readonly ROCK_IDS = [NpcIdentifiers.ROCKS, NpcIdentifiers.ROCKS_2];

    public constructor(id: number, position: Location) {
        super(id, position);
    }

    public isAggressiveTo(player: Player): boolean {
        // Rock crabs always attack players, regardless of combat level
        // Otherwise, there would be no way for Players over combat level 26 to attack them
        return true;
    }

    public aggressionDistance(): number {
        // Rock crabs only attack when Player is right beside them
        return 1;
    }

    public getCombatMethod(): CombatMethod {
        return RockCrab.COMBAT_METHOD;
    }

    public static getTransformationId(rockNpcId: number): number {
        switch (rockNpcId) {
            // Rock is transforming into a Rock Crab
            case NpcIdentifiers.ROCKS:
                return NpcIdentifiers.ROCK_CRAB;
            case NpcIdentifiers.ROCKS_2:
                return NpcIdentifiers.ROCK_CRAB_2;
            // Rock Crab is transforming back into a Rock
            case NpcIdentifiers.ROCK_CRAB:
                return NpcIdentifiers.ROCKS;
            case NpcIdentifiers.ROCK_CRAB_2:
                return NpcIdentifiers.ROCKS_2;
        }
        return NpcIdentifiers.ROCK_CRAB;
    }
}
