import { DefinitionLoader } from '../DefinitionLoader';
import { ShopDefinition } from '../../ShopDefinition';
import { GameConstants } from '../../../GameConstants';
import { ShopManager } from "../../../model/container/shop/ShopManager"
import { Shop } from "../../../model/container/shop/Shop"
import fs from "fs-extra";


export class ShopDefinitionLoader extends DefinitionLoader {
    load() {
        const reader = fs(this.file());
        const defs: ShopDefinition[] = JSON.parse(reader.readAsText());
        for (const def of defs) {
            ShopManager.shops.set(def.getId(), new Shop(def.getId(), def.getName(), def.getOriginalStock()));
        }
        reader.close();

    }
    file(): string {
        return GameConstants.DEFINITIONS_DIRECTORY + "shops.json";
    }
}