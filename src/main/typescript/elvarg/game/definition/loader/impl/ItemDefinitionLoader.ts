import { GameConstants } from "../../../GameConstants";
import { ItemDefinition } from "../../ItemDefinition";
import { DefinitionLoader } from "../DefinitionLoader";
import fs from "fs-extra";

export class ItemDefinitionLoader extends DefinitionLoader {
    load() {
        ItemDefinition.definitions.clear();
        const reader = fs(this.file());
        const defs: ItemDefinition[] = JSON.parse(reader.readAsText());
        for (const def of defs) {
            ItemDefinition.definitions.set(def.getId(), def);
        }
        reader.close();
    }

    file(): string {
        return GameConstants.DEFINITIONS_DIRECTORY + "items.json";
    }
}