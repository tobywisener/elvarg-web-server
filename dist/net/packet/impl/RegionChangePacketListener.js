"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegionChangePacketListener = void 0;
var RegionManager_1 = require("../../../game/collision/RegionManager");
var ObjectManager_1 = require("../../../game/entity/impl/object/ObjectManager");
var NpcAggression_1 = require("../../../game/entity/impl/npc/NpcAggression");
var Barrows_1 = require("../../../game/content/minigames/impl/Barrows");
var ItemOnGroundManager_1 = require("../../../game/entity/impl/grounditem/ItemOnGroundManager");
var RegionChangePacketListener = /** @class */ (function () {
    function RegionChangePacketListener() {
    }
    RegionChangePacketListener.prototype.execute = function (player, packet) {
        if (player.isAllowRegionChangePacket()) {
            RegionManager_1.RegionManager.loadMapFiles(player.getLocation().getX(), player.getLocation().getY());
            player.getPacketSender().deleteRegionalSpawns();
            ItemOnGroundManager_1.ItemOnGroundManager.onRegionChange(player);
            ObjectManager_1.ObjectManager.onRegionChange(player);
            Barrows_1.Barrows.brotherDespawn(player);
            player.getAggressionTolerance().start(NpcAggression_1.NpcAggression.NPC_TOLERANCE_SECONDS);
            player.setAllowRegionChangePacket(false);
        }
    };
    return RegionChangePacketListener;
}());
exports.RegionChangePacketListener = RegionChangePacketListener;
//# sourceMappingURL=RegionChangePacketListener.js.map