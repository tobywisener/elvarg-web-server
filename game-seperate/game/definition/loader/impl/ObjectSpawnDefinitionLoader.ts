import { DefinitionLoader } from '../DefinitionLoader';
import { GameConstants } from '../../../GameConstants';
import { ObjectSpawnDefinition } from '../../ObjectSpawnDefinition';
import { GameObject } from '../../../entity/impl/object/GameObject';
import { ObjectManager } from '../../../entity/impl/object/ObjectManager';
import fs from "fs-extra";

export class ObjectSpawnDefinitionLoader extends DefinitionLoader {
    load() {
        let def: ObjectSpawnDefinition
        const reader = new fs(this.file());
        const defs: ObjectSpawnDefinition[] = JSON.parse(reader.readAsText());
        for (def of defs) {
            ObjectManager.register(new GameObject(def.getId(), def.getPosition(), def.getType(), def.getFace(), null), true);
        }
        reader.close();
    }

    file(): string {
        return GameConstants.DEFINITIONS_DIRECTORY + "object_spawns.json";
    }
}