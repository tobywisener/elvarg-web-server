"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterfaceActionClickOpcode = void 0;
var ClanChatManager_1 = require("../../../game/content/clan/ClanChatManager");
var Bank_1 = require("../../../game/model/container/impl/Bank");
var Presetables_1 = require("../../../game/content/presets/Presetables");
var TeleportHandler_1 = require("../../../game/model/teleportation/TeleportHandler");
var InterfaceActionClickOpcode = /** @class */ (function () {
    function InterfaceActionClickOpcode() {
    }
    InterfaceActionClickOpcode.prototype.execute = function (player, packet) {
        var interfaceId = packet.readInt();
        var action = packet.readByte();
        if (player == null || player.getHitpoints() <= 0
            || player.isTeleportingReturn()) {
            return;
        }
        if (Bank_1.Bank.handleButton(player, interfaceId, action)) {
            return;
        }
        if (ClanChatManager_1.ClanChatManager.handleButton(player, interfaceId, action)) {
            return;
        }
        if (Presetables_1.Presetables.handleButton(player, interfaceId)) {
            return;
        }
        if (TeleportHandler_1.TeleportHandler.handleButton(player, interfaceId, action)) {
            return;
        }
    };
    return InterfaceActionClickOpcode;
}());
exports.InterfaceActionClickOpcode = InterfaceActionClickOpcode;
//# sourceMappingURL=InterfaceActionClickOpcode.js.map