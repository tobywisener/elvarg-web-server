"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecondGroundItemOptionPacketListener = void 0;
var ItemOnGroundManager_1 = require("../../../game/entity/impl/grounditem/ItemOnGroundManager");
var Firemaking_1 = require("../../../game/content/skill/skillable/impl/Firemaking");
var Location_1 = require("../../../game/model/Location");
var Firemaking_2 = require("../../../game/content/skill/skillable/impl/Firemaking");
var SecondGroundItemOptionPacketListener = /** @class */ (function () {
    function SecondGroundItemOptionPacketListener() {
    }
    SecondGroundItemOptionPacketListener.prototype.execute = function (player, packet) {
        var y = packet.readLEShort();
        var itemId = packet.readShort();
        var x = packet.readLEShort();
        var position = new Location_1.Location(x, y, player.getLocation().getZ());
        if (!player || player.getHitpoints() <= 0) {
            return;
        }
        player.getSkillManager().stopSkillable();
        if (!player.getLastItemPickup().elapsed())
            return;
        if (player.busy())
            return;
        if (Math.abs(player.getLocation().getX() - x) > 25 || Math.abs(player.getLocation().getY() - y) > 25) {
            player.getMovementQueue().reset();
            return;
        }
        player.getMovementQueue().walkToGroundItem(position, function () {
            var item = ItemOnGroundManager_1.ItemOnGroundManager.getGroundItem(player.getUsername(), itemId, position);
            if (item) {
                var log = Firemaking_2.LightableLog.getForItem(item.getItem().getId());
                if (log) {
                    player.getSkillManager().startSkillable(new Firemaking_1.Firemaking(Firemaking_2.LightableLog.getForItem(0)));
                }
            }
        });
    };
    return SecondGroundItemOptionPacketListener;
}());
exports.SecondGroundItemOptionPacketListener = SecondGroundItemOptionPacketListener;
//# sourceMappingURL=SecondGroundItemOptionPacketListener.js.map