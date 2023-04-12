import { World } from "../../../../World"
import { PendingHit } from "../../../../content/combat/hit/PendingHit"
import { CombatMethod } from "../../../../content/combat/method/CombatMethod"
import { ChaosFanaticCombatMethod } from "../../../../content/combat/method/impl/npcs/ChaosFanaticCombatMethod"
import { VetionCombatMethod } from "../../../../content/combat/method/impl/npcs/VetionCombatMethod"
import { NPC } from "../../npc/NPC"
import { Ids } from "../../../../model/Ids"
import { Location } from "../../../../model/Location"
import { Mobile } from "../../Mobile"
import { VetionHellhound } from "./VetionHellhound"
import { NpcIdentifiers } from "../../../../../util/NpcIdentifiers"

export class Vetion extends NPC {
    private static readonly COMBAT_METHOD = new VetionCombatMethod();
    private spawnedHellhounds = false;
    private rebornTimer = 0;
    private hellhounds: VetionHellhound[] = [];

    constructor(id: number, position: Location) {
        super(id, position);
        this.hellhounds = [];
        this.setNpcTransformationId(NpcIdentifiers.VETION);
    }

    public static getCombatMethod(): VetionCombatMethod {
        return Vetion.COMBAT_METHOD;
    }

    public process(): void {
        super.process();

        const target = this.getCombat().getTarget();
        if (target != null && this.getHitpoints() <= 125) {
            if (!this.spawnedHellhounds) {
                this.spawnHellhounds(target);
                this.spawnedHellhounds = true;
            }
        }

        if (this.getNpcTransformationId() == NpcIdentifiers.VETION_REBORN) {
            if (this.rebornTimer == 500) {
                this.spawnedHellhounds = true;
                this.setNpcTransformationId(NpcIdentifiers.VETION);
                this.rebornTimer = 0;
            }
            this.rebornTimer++;
        }
    }

    private spawnHellhounds(target: Mobile) {
        for (let i = 0; i < 2; i++) {
            let hellhoundId = NpcIdentifiers.VETION_HELLHOUND;
            if (this.getNpcTransformationId() == NpcIdentifiers.VETION_REBORN) {
                hellhoundId = NpcIdentifiers.GREATER_VETION_HELLHOUND;
            }
            const hellhound = NPC.create(hellhoundId, this.getLocation()) as VetionHellhound;
            hellhound.setVetion(this);
            this.hellhounds.push(hellhound);
            World.getAddNPCQueue().push(hellhound);
        }
    }

    public despawnHellhound(hellhound: VetionHellhound) {
        this.hellhounds.splice(this.hellhounds.indexOf(hellhound), 1);
    }
    public appendDeath() {
        for (const npc of this.hellhounds) {
            World.getRemoveNPCQueue().push(npc);
        }
        this.hellhounds = [];
        this.spawnedHellhounds = false;

        if (this.getNpcTransformationId() != NpcIdentifiers.VETION_REBORN) {
            this.setHitpoints(this.getDefinition().getHitpoints());
            this.setNpcTransformationId(NpcIdentifiers.VETION_REBORN);
            this.forceChat("Do it again!");
            return;
        }

        super.appendDeath();
    }

    public manipulateHit(hit: PendingHit): PendingHit {
        if (this.spawnedHellhounds && this.hellhounds.length > 0) {
            hit.setTotalDamage(0);
        }
        return hit;
    }
}
