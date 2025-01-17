import { GameConstants } from "../../../GameConstants";
import { NpcDefinition } from "../../NpcDefinition";
import { DefinitionLoader } from "../DefinitionLoader";
import { fs } from "fs-extra";

export class NpcDefinitionLoader extends DefinitionLoader {
    load() {
        NpcDefinition.definitions.clear();
        const reader = fs(this.file());
        const defs: NpcDefinition[] = JSON.parse(reader.readAsText());
        for (const def of defs) {
            NpcDefinition.definitions.set(def.getId(), def);
        }
        reader.close();
    }

    file(): string {
        return GameConstants.DEFINITIONS_DIRECTORY + "npc_defs.json";
    }
}