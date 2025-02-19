import { Command } from '../../../model/commands/Command';
import { Player } from '../../../entity/impl/player/Player';
import { PlayerRights } from '../../rights/PlayerRights';
import { NPC } from '../../../entity/impl/npc/NPC';
import { World } from '../../../World';
import { NpcDefinition } from '../../../definition/NpcDefinition';
import { Location } from '../../Location';
import { NpcSpawnDefinition } from '../../../definition/NpcSpawnDefinition';
import { GameConstants } from '../../../GameConstants';
import { fs } from 'fs-extra'
import { Direction } from '../../Direction';

export class SpawnPermanentNPCCommand implements Command {

    execute(player: Player, command: string, parts: string[]) {
        try {
            let npcId = parseInt(parts[1]);
            let radius = parts.length > 2 ? parseInt(parts[1]) : 2;
            let npcDef = NpcDefinition.forId(npcId);
            let locationName = player.getArea() == null ? "Unknown area" : player.getArea().getName();
            let description = locationName + " " + npcDef.getName();
            this.write(npcId, player.getLocation().clone(), radius, description);
            player.getPacketSender().sendMessage("Permanently spawned " + description);
        } catch (e) {
            console.error(e);
        }
    
        let npc = NPC.create(parseInt(parts[1]), player.getLocation().clone());
        World.getAddNPCQueue().push(npc);
        if (player.getPrivateArea() != null) {
            player.getPrivateArea().add(npc);
        }
    }
    
    canUse(player: Player) {
        let rights = player.getRights();
        return (rights == PlayerRights.OWNER || rights == PlayerRights.DEVELOPER);
    }

    public write(npcId: number, npcLocation: Location, npcRadius: number, description: string): void {
        const gson = require('gson');
        const filePath = GameConstants.DEFINITIONS_DIRECTORY + 'npc_spawns.json';
    
        const reader = fs.readFileSync(filePath, 'utf8');
        const definitionArray: NpcSpawnDefinition[] = gson.fromJson(reader, NpcSpawnDefinition);
    
        if (!definitionArray) {
            return;
        }
    
        const writer = fs.createWriteStream(filePath);
    
        const list = definitionArray.concat([new NpcSpawnDefinition(npcId, npcLocation, Direction.SOUTH, 2, description)]);
    
        const finalArray: NpcSpawnDefinition[] = list;
    
        const builder = gson.newBuilder().setPrettyPrinting().create();
        builder.toJson(finalArray, writer);
        writer.close();
    }
}