"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeleportPacketListener = void 0;
var TeleportHandler_1 = require("../../../game/model/teleportation/TeleportHandler");
var PlayerRights_1 = require("../../../game/model/rights/PlayerRights");
var Teleportable_1 = require("../../../game/model/teleportation/Teleportable");
var TeleportPacketListener = /** @class */ (function () {
    function TeleportPacketListener() {
    }
    TeleportPacketListener.prototype.execute = function (player, packet) {
        var e_1, _a;
        if (player.getHitpoints() <= 0)
            return;
        var type = packet.readByte();
        var index = packet.readByte();
        if (!player.isTeleportInterfaceOpen()) {
            player.getPacketSender().sendInterfaceRemoval();
            return;
        }
        if (player.getRights() == PlayerRights_1.PlayerRights.DEVELOPER) {
            player.getPacketSender().sendMessage("Selected a teleport. Type: ".concat(type, ", index: ").concat(index, "."));
        }
        try {
            for (var _b = __values(Object.values(Teleportable_1.Teleportable)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var teleport = _c.value;
                if (teleport.getType() == type && teleport.getIndex() == index) {
                    var teleportPosition = teleport.getPosition();
                    if (TeleportHandler_1.TeleportHandler.checkReqs(player, teleportPosition)) {
                        player.getPreviousTeleports().set(teleport.getTeleportButton(), teleportPosition);
                        TeleportHandler_1.TeleportHandler.teleport(player, teleportPosition, player.getSpellbook().getTeleportType(), true);
                    }
                    break;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    return TeleportPacketListener;
}());
exports.TeleportPacketListener = TeleportPacketListener;
//# sourceMappingURL=TeleportPacketListener.js.map