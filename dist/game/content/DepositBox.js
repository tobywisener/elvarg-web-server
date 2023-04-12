"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepositBox = void 0;
var Bank_1 = require("../model/container/impl/Bank");
var INTERFACE_ID = 4465;
var DepositBox = /** @class */ (function () {
    function DepositBox() {
    }
    DepositBox.open = function (player) {
        player.getPacketSender().sendInterface(INTERFACE_ID);
        this.refresh(player);
    };
    DepositBox.refresh = function (player) {
        player.getPacketSender().clearItemOnInterface(7423);
        player.getPacketSender().sendItemContainer(player.getInventory(), 7423);
        player.getPacketSender().sendInterfaceSet(4465, 192);
    };
    DepositBox.deposit = function (player, slotId, itemId, amount) {
        /** Item in requested Slot **/
        var inventoryItem = player.getInventory().forSlot(slotId);
        if (inventoryItem == null) {
            /** No Item for slot **/
            return;
        }
        /** When depositing over your current item amount **/
        if (player.getInventory().getAmount(itemId) < amount) {
            amount = player.getInventory().getAmount(itemId);
        }
        var item_for_slot = inventoryItem.getId();
        if (item_for_slot != itemId) {
            /** Contains a different itemId **/
            console.log("different item. invItem=" + item_for_slot + " itemIdOnInter=" + itemId);
            return;
        }
        /** If containers 0 amount of the item **/
        if (amount <= 0)
            return;
        /** Adds item to the bank **/
        Bank_1.Bank.deposits(player, itemId, slotId, amount);
        /** Refreshes interface / Inventory **/
        this.refresh(player);
    };
    return DepositBox;
}());
exports.DepositBox = DepositBox;
//# sourceMappingURL=DepositBox.js.map