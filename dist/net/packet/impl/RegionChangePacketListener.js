"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegionChangePacketListener = void 0;
// import { RegionManager } from '../../../game/collision/RegionManager';
// import { ObjectManager } from '../../../game/entity/impl/object/ObjectManager';
// import { NpcAggression } from '../../../game/entity/impl/npc/NpcAggression';
// import { Barrows }  from '../../../game/content/minigames/impl/Barrows'
// import { ItemOnGroundManager } from '../../../game/entity/impl/grounditem/ItemOnGroundManager';
var RegionChangePacketListener = /** @class */ (function () {
    function RegionChangePacketListener() {
    }
    // execute(player: Player, packet: Packet) {
    RegionChangePacketListener.prototype.execute = function (player, packet) {
        if (player.isAllowRegionChangePacket()) {
            // RegionManager.loadMapFiles(player.getLocation().getX(), player.getLocation().getY());
            player.getPacketSender().deleteRegionalSpawns();
            // ItemOnGroundManager.onRegionChange(player);
            // ObjectManager.onRegionChange(player);
            // Barrows.brotherDespawn(player);
            // player.getAggressionTolerance().start(NpcAggression.NPC_TOLERANCE_SECONDS);
            player.setAllowRegionChangePacket(false);
        }
    };
    return RegionChangePacketListener;
}());
exports.RegionChangePacketListener = RegionChangePacketListener;
//# sourceMappingURL=RegionChangePacketListener.js.map