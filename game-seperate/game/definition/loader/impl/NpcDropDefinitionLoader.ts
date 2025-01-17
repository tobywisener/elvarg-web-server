import { GameConstants } from "../../../GameConstants";
import { DefinitionLoader } from "../DefinitionLoader";
import { NpcDropDefinition } from "../../NpcDropDefinition";
import { fs } from "fs-extra"

export class NpcDropDefinitionLoader extends DefinitionLoader {
    load() {
        NpcDropDefinition.definitions.clear();
        const reader = fs(this.file());
        const defs: NpcDropDefinition[] = JSON.parse(reader.readAsText());
        for (const def of defs) {
            for (const npcId of def.getNpcIds()) {
                NpcDropDefinition.definitions.set(npcId, def);
            }
        }
        reader.close();
    }

    file(): string {
        return GameConstants.DEFINITIONS_DIRECTORY + "npc_drops.json";
    }
}