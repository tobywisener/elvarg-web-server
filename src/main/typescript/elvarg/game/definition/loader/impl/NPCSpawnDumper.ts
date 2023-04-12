import { DefinitionLoader } from '../DefinitionLoader';
import { NpcSpawnDefinition } from "../../NpcSpawnDefinition"
import { GameConstants } from '../../../GameConstants';
import { FacingDirection } from '../../../model/FacingDirection';
import { Location } from '../../../model/Location';
import fs from "fs-extra";
import { Direction } from '../../../model/Direction';

export class NPCSpawnDumper extends DefinitionLoader {
    async load(): Promise<void> {
        const r = fs.createReadStream(this.file(), { encoding: 'utf-8' });
        let s: string;

        const path = fs.require('path');
        const file = path.join(GameConstants.DEFINITIONS_DIRECTORY, "gay.json");
        fs.mkdirSync(path.dirname(file), { recursive: true });
        const w = fs.createWriteStream(file, { flags: 'a' });
        const builder = JSON.stringify(JSON.stringify({ }, null, 2));

        const lineReader = fs.require('readline').createInterface({ input: r });
        for await (const line of lineReader) {
            s = line;
            if (s.startsWith("/"))
                continue;
            const data = s.split(" ");
            const id = parseInt(data[0]);
            const x = parseInt(data[2]);
            const y = parseInt(data[3]);
            const z = parseInt(data[4]);

            w.write(JSON.stringify(new NpcSpawnDefinition(id, new Location(x, y), Direction.SOUTH, 2)));
            w.write(",");
            w.write("\n");
        }
        r.close();
        w.close();
    }

    file(): string {
        return GameConstants.DEFINITIONS_DIRECTORY + "dump.txt";
    }
}