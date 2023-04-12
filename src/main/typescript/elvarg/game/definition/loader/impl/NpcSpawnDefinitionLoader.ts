import fs from "fs-extra"
import { GameConstants } from "../../../GameConstants";
import { World } from "../../../World";
import { NpcSpawnDefinition } from "../../NpcSpawnDefinition";
import { DefinitionLoader } from "../DefinitionLoader";
import { NPC } from "../../../entity/impl/npc/NPC";



export class NpcSpawnDefinitionLoader extends DefinitionLoader {
    load() {
        const reader = fs(this.file());
        const defs: NpcSpawnDefinition[] = JSON.parse(reader.readAsText());
        for (const def of defs) {
            const npc = NPC.create(def.getId(), def.getPosition());
            npc.getMovementCoordinator().setRadius(def.getRadius());
            npc.setFace(def.getFacing());
            World.addNPCQueue.push(npc);
        }
        reader.close();
    }

    file(): string {
        return GameConstants.DEFINITIONS_DIRECTORY + "npc_spawns.json";
    }
}