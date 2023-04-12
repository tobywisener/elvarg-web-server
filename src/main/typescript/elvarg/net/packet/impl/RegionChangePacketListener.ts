
import { Player } from '../../../game/entity/impl/player/Player';
import { Packet } from '../Packet';
import { PacketExecutor } from '../PacketExecutor';
import { RegionManager } from '../../../game/collision/RegionManager';
import { ObjectManager } from '../../../game/entity/impl/object/ObjectManager';
import { NpcAggression } from '../../../game/entity/impl/npc/NpcAggression';
import { Barrows }  from '../../../game/content/minigames/impl/Barrows'
import { ItemOnGroundManager } from '../../../game/entity/impl/grounditem/ItemOnGroundManager';


export class RegionChangePacketListener implements PacketExecutor {
    execute(player: Player, packet: Packet) {
        if (player.isAllowRegionChangePacket()) {
            RegionManager.loadMapFiles(player.getLocation().getX(), player.getLocation().getY());
            player.getPacketSender().deleteRegionalSpawns();
            ItemOnGroundManager.onRegionChange(player);
            ObjectManager.onRegionChange(player);
            Barrows.brotherDespawn(player);
            player.getAggressionTolerance().start(NpcAggression.NPC_TOLERANCE_SECONDS);
            player.setAllowRegionChangePacket(false);
        }
    }
}
