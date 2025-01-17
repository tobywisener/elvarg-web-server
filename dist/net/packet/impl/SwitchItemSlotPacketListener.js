"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwitchItemSlotPacketListener = void 0;
// import { Bank } from "../../../game/model/container/impl/Bank";
// import { Inventory } from "../../../game/model/container/impl/Inventory";
var SwitchItemSlotPacketListener = /** @class */ (function () {
    function SwitchItemSlotPacketListener() {
    }
    // execute(player: Player, packet: Packet) {
    SwitchItemSlotPacketListener.prototype.execute = function (player, packet) {
        if (player.getHitpoints() <= 0)
            return;
        var interfaceId = packet.readInt();
        packet.readByteC();
        var fromSlot = packet.readLEShortA();
        var toSlot = packet.readLEShort();
        if (player == null || player.getHitpoints() <= 0) {
            return;
        }
        // if (interfaceId >= Bank.CONTAINER_START && interfaceId < Bank.CONTAINER_START + Bank.TOTAL_BANK_TABS) {
        //     let tab = player.isSearchingBank() ? Bank.BANK_SEARCH_TAB_INDEX : interfaceId - Bank.CONTAINER_START;
        //     if (fromSlot >= 0 && fromSlot < player.getBank(tab).capacity() && toSlot >= 0 && toSlot < player.getBank(tab).capacity() && toSlot != fromSlot) {
        //         Bank.rearrange(player, player.getBank(tab), fromSlot, toSlot);
        //     }
        //     return;
        // }
        switch (interfaceId
        // case Inventory.INTERFACE_ID:
        // case Bank.INVENTORY_INTERFACE_ID:
        //     if (fromSlot >= 0 && fromSlot < player.getInventory().capacity() && toSlot >= 0 && toSlot < player.getInventory().capacity() && toSlot != fromSlot) {
        //         player.getInventory().swap(fromSlot, toSlot).refreshItems();
        //     }
        //     break;
        ) {
        }
    };
    return SwitchItemSlotPacketListener;
}());
exports.SwitchItemSlotPacketListener = SwitchItemSlotPacketListener;
//# sourceMappingURL=SwitchItemSlotPacketListener.js.map