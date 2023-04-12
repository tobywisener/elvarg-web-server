"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.Bank = void 0;
var Item_1 = require("../../Item");
var ItemContainer_1 = require("../ItemContainer");
var PlayerStatus_1 = require("../../PlayerStatus");
var DialogueChainBuilder_1 = require("../../dialogues/builders/DialogueChainBuilder");
var OptionDialogue_1 = require("../../dialogues/entries/impl/OptionDialogue");
var ItemDefinition_1 = require("../../../definition/ItemDefinition");
var StackType_1 = require("../StackType");
var Equipment_1 = require("./Equipment");
var GameConstants_1 = require("../../../GameConstants");
var WeaponInterfaces_1 = require("../../../content/combat/WeaponInterfaces");
var Inventory_1 = require("./Inventory");
var Flag_1 = require("../../Flag");
var BonusManager_1 = require("../../equipment/BonusManager");
var DialogueOption_1 = require("../../dialogues/DialogueOption");
var Bank = exports.Bank = /** @class */ (function (_super) {
    __extends(Bank, _super);
    function Bank(player) {
        var _this = _super.call(this, player) || this;
        _this.player = player;
        return _this;
    }
    Bank.prototype.full = function (itemId) {
        throw new Error("Method not implemented.");
    };
    Bank.withdraw = function (player, item, slot, amount, fromBankTab) {
        if (player.status !== PlayerStatus_1.PlayerStatus.BANKING && player.interfaceId !== 5292) {
            var itemTab = Bank.getTabForItem(player, item);
            if (itemTab !== fromBankTab) {
                if (!player.isSearchingBank) {
                    return;
                }
            }
            var maxAmount = player.getBank(itemTab).getAmount(item);
            if (amount === -1 || amount > maxAmount) {
                amount = maxAmount;
            }
            if (player.isSearchingBank) {
                if (!player.getBank(itemTab).contains(item) || !player.getBank(this.BANK_SEARCH_TAB_INDEX).contains(item)
                    || amount <= 0) {
                    return;
                }
                if (fromBankTab !== this.BANK_SEARCH_TAB_INDEX) {
                    return;
                }
                slot = player.getBank(itemTab).getSlotForItemId(item);
                player.getBank(itemTab).switchsItem(player.getInventory(), new Item_1.Item(item, amount), player.getBank(itemTab).getSlotForItemId(item), false, false);
                if (slot === 0) {
                    Bank.reconfigureTabs(player);
                }
                player.getBank(this.BANK_SEARCH_TAB_INDEX).refreshItems();
            }
            else {
                // Withdrawing an item which belongs in another tab from the main tab
                if (player.getCurrentBankTab() === 0 && fromBankTab !== 0) {
                    slot = player.getBank(itemTab).getSlotForItemId(item);
                }
                // Make sure the item is in the slot we've found
                if (player.getBank(itemTab).getItems()[slot].getId() !== item) {
                    return;
                }
                // Delete placeholder
                if (amount <= 0) {
                    player.getBank(itemTab).getItems()[slot].setId(-1);
                    player.getBank(player.getCurrentBankTab()).sortItems().refreshItems();
                    return;
                }
                // Perform the switch
                player.getBank(itemTab).switchItem(player.getInventory(), new Item_1.Item(item, amount), false, slot, false);
                // Update all tabs if we removed an item from the first item slot
                if (slot === 0) {
                    Bank.reconfigureTabs(player);
                }
                // Refresh items in our current tab
                player.getBank(player.getCurrentBankTab()).refreshItems();
            }
            // Refresh inventory
            player.getInventory().refreshItems();
        }
    };
    Bank.useItemOnDepositBox = function (player, item, slot, object) {
        if (!this.DEPOSIT_BOX_OBJECT_IDS.includes(object.getId())) {
            return false;
        }
        if (player.getInventory().getAmount(item.getId()) === 1) {
            Bank.deposit(player, item.getId(), slot, 1, true);
            return true;
        }
        var builder = new DialogueChainBuilder_1.DialogueChainBuilder();
        if (player.getInventory().getAmount(item.getId()) <= 5) {
            builder.add(new OptionDialogue_1.OptionDialogue(0, new bankAction(function (option) {
                if (option === DialogueOption_1.DialogueOption.FIRST_OPTION) {
                    Bank.deposit(player, item.getId(), slot, 1, true);
                }
                else {
                    Bank.deposit(player, item.getId(), slot, 5, true);
                }
                player.getPacketSender().sendInterfaceRemoval();
            }), "One", "Five"));
        }
        else if (player.getInventory().getAmount(item.getId()) <= 10) {
            builder.add(new OptionDialogue_1.OptionDialogue(0, new bankAction(function (option) {
                if (option === DialogueOption_1.DialogueOption.FIRST_OPTION) {
                    Bank.deposit(player, item.getId(), slot, 1, true);
                }
                else if (option === DialogueOption_1.DialogueOption.SECOND_OPTION) {
                    Bank.deposit(player, item.getId(), slot, 5, true);
                }
                else {
                    Bank.deposit(player, item.getId(), slot, 10, true);
                }
                player.getPacketSender().sendInterfaceRemoval();
            }), "One", "Five", "Ten"));
        }
        else {
            builder.add(new OptionDialogue_1.OptionDialogue(0, new bankAction(function (option) {
                if (option === DialogueOption_1.DialogueOption.FIRST_OPTION) {
                    Bank.deposit(player, item.getId(), slot, 1, true);
                }
                else if (option === DialogueOption_1.DialogueOption.SECOND_OPTION) {
                    Bank.deposit(player, item.getId(), slot, 5, true);
                }
                else if (option === DialogueOption_1.DialogueOption.THIRD_OPTION) {
                    Bank.deposit(player, item.getId(), slot, 10, true);
                }
                else {
                    Bank.deposit(player, item.getId(), slot, player.getInventory().getAmount(item.getId()), true);
                }
                player.getPacketSender().sendInterfaceRemoval();
            }), "One", "Five", "Ten", "All"));
        }
        player.getDialogueManager().startDialogues(builder);
        return true;
    };
    Bank.deposits = function (player, item, slot, amount) {
        this.deposit(player, item, slot, amount, false);
    };
    /**
     * Deposits an item to the bank.
     *
     * @param player
     * @param item
     * @param slot
     * @param amount
     */
    Bank.deposit = function (player, item, slot, amount, ignore) {
        if (ignore || player.getStatus() === PlayerStatus_1.PlayerStatus.BANKING
            && player.getInterfaceId() === 5292 /* Regular bank */
            || player.getInterfaceId() === 4465 /* Bank deposit booth */) {
            if (player.getInventory().getItems()[slot].getId() !== item) {
                return;
            }
            if (amount === -1 || amount > player.getInventory().getAmount(item)) {
                amount = player.getInventory().getAmount(item);
            }
            if (amount <= 0) {
                return;
            }
            var tab = Bank.getTabForItem(player, item);
            if (!player.isSearchingBank()) {
                player.setCurrentBankTab(tab);
            }
            player.getInventory().switchItem(player.getBank(tab), new Item_1.Item(item, amount), false, slot, !player.isSearchingBank());
            if (player.isSearchingBank()) {
                player.getBank(this.BANK_SEARCH_TAB_INDEX).refreshItems();
            }
            // Refresh inventory
            player.getInventory().refreshItems();
        }
    };
    Bank.search = function (player, syntax) {
        var e_1, _b;
        if (player.getStatus() === PlayerStatus_1.PlayerStatus.BANKING && player.getInterfaceId() === 5292) {
            // Set search fields
            player.setSearchSyntax(syntax);
            player.setSearchingBank(true);
            // Clear search bank tab
            player.getBank(this.BANK_SEARCH_TAB_INDEX).resetItems();
            // Refill search bank tab
            for (var i = 0; i < this.TOTAL_BANK_TABS; i++) {
                if (i === this.BANK_SEARCH_TAB_INDEX) {
                    continue;
                }
                var b = player.getBank(i);
                if (b !== null) {
                    b.sortItems();
                    try {
                        for (var _c = (e_1 = void 0, __values(b.getValidItems())), _d = _c.next(); !_d.done; _d = _c.next()) {
                            var item = _d.value;
                            if (item.getAmount() > 0) {
                                this.addToBankSearch(player, item.clone(), false);
                            }
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                }
            }
            player.setCurrentBankTab(0);
            // Open the search bank tab
            player.getBank(this.BANK_SEARCH_TAB_INDEX).open();
        }
    };
    Bank.exitSearch = function (player, openBank) {
        if (player.getStatus() === PlayerStatus_1.PlayerStatus.BANKING && player.getInterfaceId() === 5292) {
            // Set search fields
            player.setSearchSyntax("");
            player.setSearchingBank(false);
            // Clear search bank tab
            player.getBank(this.BANK_SEARCH_TAB_INDEX).resetItems();
            // Open last tab we had
            if (player.getCurrentBankTab() === this.BANK_SEARCH_TAB_INDEX) {
                player.setCurrentBankTab(0);
            }
            if (openBank) {
                player.getBank(player.getCurrentBankTab()).open();
            }
        }
    };
    Bank.addToBankSearch = function (player, item, refresh) {
        if (player.getBank(this.BANK_SEARCH_TAB_INDEX).getFreeSlots() === 0) {
            return;
        }
        if (item.getDefinition().getName().toLowerCase().includes(player.getSearchSyntax())) {
            player.getBank(this.BANK_SEARCH_TAB_INDEX).add(item, refresh);
        }
    };
    /**
     * Removes an item from the bank search tab
     *
     * @param player
     * @param item
     */
    Bank.removeFromBankSearch = function (player, item, refresh) {
        if (item.getDefinition().isNoted()) {
            item.setId(item.getDefinition().unNote());
        }
        player.getBank(this.BANK_SEARCH_TAB_INDEX).deleteBoolean(item, refresh);
    };
    /**
     * Moves an item from one slot to another using the insert method. It will shift
     * all other items to the right.
     *
     * @param player
     * @param fromSlot
     * @param toSlot
     */
    Bank.rearrange = function (player, bank, fromSlot, toSlot) {
        if (player.insertModeReturn()) {
            var tempFrom = fromSlot;
            for (var tempTo = toSlot; tempFrom !== tempTo;) {
                if (tempFrom > tempTo) {
                    bank.swap(tempFrom, tempFrom - 1);
                    tempFrom--;
                }
                else if (tempFrom < tempTo) {
                    bank.swap(tempFrom, tempFrom + 1);
                    tempFrom++;
                }
            }
        }
        else {
            bank.swap(fromSlot, toSlot);
        }
        if (player.getCurrentBankTab() === 0 && !player.isSearchingBank()) {
            player.getBank(0).refreshItems();
        }
        else {
            bank.refreshItems();
        }
        // Update all tabs if we moved an item from/to the first item slot
        if (fromSlot === 0 || toSlot === 0) {
            Bank.reconfigureTabs(player);
        }
    };
    Bank.handleButton = function (player, button, action) {
        var e_2, _b;
        if (player.getInterfaceId() == 32500) {
            // Handle bank settings
            switch (button) {
                case 32503:
                    player.getPacketSender().sendInterfaceRemoval();
                    break;
                case 32512:
                    player.getBank(player.getCurrentBankTab()).open();
                    break;
                case 32513:
                    player.setPlaceholders(!player.isPlaceholders());
                    player.getPacketSender().sendConfig(118, player.isPlaceholders() ? 1 : 0);
                    player.getPacketSender().sendMessage("Placeholders are now " + (player.isPlaceholders() ? "enabled" : "disabled") + ".");
                    break;
            }
            return true;
        }
        else if (player.getInterfaceId() == 5292) {
            if (player.getStatus() == PlayerStatus_1.PlayerStatus.BANKING) {
                var tab_select_start = 50070;
                for (var bankId = 0; bankId < this.TOTAL_BANK_TABS; bankId++) {
                    if (button == tab_select_start + (bankId * 4)) {
                        var searching = player.isSearchingBank();
                        if (searching) {
                            this.exitSearch(player, false);
                        }
                        // First, check if empty
                        var empty = bankId > 0 ? Bank.isEmpty(player.getBank(bankId)) : false;
                        if (action === 1) {
                            // Collapse tab!!!
                            if (bankId === 0) {
                                return true;
                            }
                            if (empty) {
                                return true;
                            }
                            var items = player.getBank(bankId).getValidItems();
                            if (player.getBank(0).getFreeSlots() < items.length) {
                                player.getPacketSender().sendMessage("You don't have enough free slots in your Main tab to do that.");
                                return true;
                            }
                            var noteWithdrawal = player.withdrawAsNote();
                            player.setNoteWithdrawal(false);
                            try {
                                for (var items_1 = (e_2 = void 0, __values(items)), items_1_1 = items_1.next(); !items_1_1.done; items_1_1 = items_1.next()) {
                                    var item = items_1_1.value;
                                    player.getBank(bankId).switchsItem(player.getInventory(), item.clone(), player.getBank(bankId).getSlotForItemId(item.getId()), false, false);
                                }
                            }
                            catch (e_2_1) { e_2 = { error: e_2_1 }; }
                            finally {
                                try {
                                    if (items_1_1 && !items_1_1.done && (_b = items_1.return)) _b.call(items_1);
                                }
                                finally { if (e_2) throw e_2.error; }
                            }
                            player.setNoteWithdrawal(noteWithdrawal);
                            this.reconfigureTabs(player);
                            player.getBank(player.getCurrentBankTab()).refreshItems();
                        }
                        else {
                            if (!empty || bankId === 0) {
                                player.setCurrentBankTab(bankId);
                                player.getBank(bankId).open();
                            }
                            else {
                                player.getPacketSender().sendMessage("To create a new tab, simply drag an item here.");
                                if (searching) {
                                    player.getBank(player.getCurrentBankTab()).open();
                                }
                            }
                        }
                        return true;
                    }
                }
                switch (button) {
                    case 50013:
                        // Show menu
                        player.getPacketSender().sendInterfaceRemoval();
                        player.getPacketSender().sendInterface(32500);
                        break;
                    case 5386:
                        player.setNoteWithdrawal(true);
                        break;
                    case 5387:
                        player.setNoteWithdrawal(false);
                        break;
                    case 8130:
                        player.setInsertMode(false);
                        break;
                    case 8131:
                        player.setInsertMode(true);
                        break;
                    case 50004:
                        this.depositItems(player, player.getInventory(), false);
                        break;
                    case 50007:
                        this.depositItems(player, player.getInventory(), false);
                        break;
                    case 5384:
                    case 50001:
                        player.getPacketSender().sendInterfaceRemoval();
                        break;
                    case 50010:
                        if (player.isSearchingBank()) {
                            this.exitSearch(player, true);
                            return true;
                        }
                        player.setEnteredSyntaxAction(new bankEntered(function (input) { Bank.search(player, input); }));
                        player.getPacketSender().sendEnterInputPrompt("What do you wish to search for?");
                        break;
                }
            }
            return true;
        }
        return false;
    };
    Bank.depositItems = function (player, from, ignoreReqs) {
        var e_3, _b;
        if (!ignoreReqs) {
            if (player.getStatus() !== PlayerStatus_1.PlayerStatus.BANKING || player.getInterfaceId() !== 5292) {
                return;
            }
        }
        try {
            for (var _c = __values(from.getValidItems()), _d = _c.next(); !_d.done; _d = _c.next()) {
                var item = _d.value;
                from.switchItems(player.getBank(Bank.getTabForItem(player, item.getId())), item.clone(), false, false);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
            }
            finally { if (e_3) throw e_3.error; }
        }
        from.refreshItems();
        if (player.isSearchingBank()) {
            player.getBank(this.BANK_SEARCH_TAB_INDEX).refreshItems();
        }
        else {
            player.getBank(player.getCurrentBankTab()).refreshItems();
        }
        if (from instanceof Equipment_1.Equipment) {
            WeaponInterfaces_1.WeaponInterfaces.assign(player);
            BonusManager_1.BonusManager.update(player);
            player.getUpdateFlag().flag(Flag_1.Flag.APPEARANCE);
        }
    };
    /**
     * Is a bank empty?
     *
     * @param bank
     * @return
     */
    Bank.isEmpty = function (bank) {
        return bank.sortItems().getValidItems().length <= 0;
    };
    /**
     * Reconfigures our bank tabs
     *
     * @param player
     */
    Bank.reconfigureTabs = function (player) {
        var updateRequired = false;
        for (var k = 1; k < this.BANK_SEARCH_TAB_INDEX - 1; k++) {
            if (this.isEmpty(player.getBank(k)) || updateRequired) {
                player.setBank(k, player.getBank(k + 1));
                player.setBank(k + 1, new Bank(player));
                updateRequired = true;
            }
        }
        // Check if we're in a tab that's empty
        // If so, open the next non-empty tab
        var total_tabs = this.getTabCount(player);
        if (!player.isSearchingBank()) {
            if (player.getCurrentBankTab() > total_tabs) {
                player.setCurrentBankTab(total_tabs);
                player.getBank(total_tabs).open();
                return true;
            }
        }
        return false;
    };
    Bank.getTabCount = function (player) {
        var tabs = 0;
        for (var i = 1; i < this.TOTAL_BANK_TABS; i++) {
            if (i === this.BANK_SEARCH_TAB_INDEX) {
                continue;
            }
            if (!this.isEmpty(player.getBank(i))) {
                tabs++;
            }
            else
                break;
        }
        return tabs;
    };
    /**
     * Gets the specific tab in which an item is.
     *
     * @param player
     * @param itemID
     * @return
     */
    Bank.getTabForItem = function (player, itemID) {
        if (ItemDefinition_1.ItemDefinition.forId(itemID).isNoted()) {
            itemID = ItemDefinition_1.ItemDefinition.forId(itemID).unNote();
        }
        for (var k = 0; k < this.TOTAL_BANK_TABS; k++) {
            if (k === this.BANK_SEARCH_TAB_INDEX) {
                continue;
            }
            if (player.getBank(k).contains(itemID)) {
                return k;
            }
        }
        // Find empty bank slot
        if (player.getBank(player.getCurrentBankTab()).getFreeSlots() > 0) {
            return player.getCurrentBankTab();
        }
        for (var k = 0; k < this.TOTAL_BANK_TABS; k++) {
            if (k === this.BANK_SEARCH_TAB_INDEX) {
                continue;
            }
            if (player.getBank(k).getFreeSlots() > 0) {
                return k;
            }
        }
        return 0;
    };
    Bank.contains = function (player, item) {
        var tab = this.getTabForItem(player, item.getId());
        return player.getBank(tab).getAmount(item.getId()) >= item.getAmount();
    };
    Bank.prototype.capacity = function () {
        return 352;
    };
    Bank.prototype.stackType = function () {
        return StackType_1.StackType.STACKS;
    };
    Bank.prototype.open = function () {
        // Update player status
        this.getPlayer().setStatus(PlayerStatus_1.PlayerStatus.BANKING);
        this.getPlayer().setEnteredSyntaxAction(null);
        // Sort and refresh items in the container
        this.sortItems().refreshItems();
        // Send configs
        this.getPlayer().getPacketSender().sendConfig(115, this.getPlayer().withdrawAsNote() ? 1 : 0)
            .sendConfig(304, this.getPlayer().insertModeReturn() ? 1 : 0)
            .sendConfig(117, this.getPlayer().isSearchingBank() ? 1 : 0)
            .sendConfig(118, this.getPlayer().isPlaceholders() ? 1 : 0).sendInterfaceSet(5292, 5063);
        // Resets the scroll bar in the interface
        this.getPlayer().getPacketSender().sendInterfaceScrollReset(Bank.BANK_SCROLL_BAR_INTERFACE_ID);
        return this;
    };
    Bank.prototype.refreshItems = function () {
        // Reconfigure bank tabs.
        if (Bank.reconfigureTabs(this.getPlayer())) {
            return this;
        }
        // Send capacity information about the current bank we're in
        this.getPlayer().getPacketSender().sendString("" + this.getValidItems().length, 50053);
        this.getPlayer().getPacketSender().sendString("" + this.capacity(), 50054);
        // Send all bank tabs and their contents
        for (var i = 0; i < Bank.TOTAL_BANK_TABS; i++) {
            this.getPlayer().getPacketSender().sendItemContainers(this.getPlayer().getBank(i), Bank.CONTAINER_START + i);
        }
        // Send inventory
        this.getPlayer().getPacketSender().sendItemContainer(this.getPlayer().getInventory(), Bank.INVENTORY_INTERFACE_ID);
        // Update bank title
        if (this.getPlayer().isSearchingBank()) {
            this.getPlayer().getPacketSender().sendString("Results for " + this.getPlayer().getSearchSyntax() + "..", 5383)
                .sendConfig(117, 1);
        }
        else {
            this.getPlayer().getPacketSender().sendString("Bank of " + GameConstants_1.GameConstants.NAME, 5383).sendConfig(117, 0);
        }
        // Send current bank tab being viewed and total tabs!
        var current_tab = this.getPlayer().isSearchingBank() ? Bank.BANK_SEARCH_TAB_INDEX : this.getPlayer().getCurrentBankTab();
        this.getPlayer().getPacketSender().sendCurrentBankTab(current_tab);
        return this;
    };
    Bank.prototype.fulls = function () {
        this.getPlayer().getPacketSender().sendMessage("Not enough space in bank.");
        return this;
    };
    Bank.prototype.switchsItem = function (to, item, slot, sort, refresh) {
        // Make sure we're actually banking!
        if (this.getPlayer().getStatus() != PlayerStatus_1.PlayerStatus.BANKING || this.getPlayer().getInterfaceId() != 5292) {
            return this;
        }
        // Make sure we have the item!
        if (this.getItems()[slot].getId() != item.getId() || !this.contains(item.getId())) {
            return this;
        }
        // Get the item definition for the item which is being withdrawn
        var def = ItemDefinition_1.ItemDefinition.forId(item.getId() + 1);
        if (def == null) {
            return this;
        }
        // Make sure we have enough space in the other container
        if (to.getFreeSlots() <= 0 && (!(to.contains(item.getId()) && item.getDefinition().isStackable()))
            && !(this.getPlayer().withdrawAsNote() && def != null && def.isNoted() && to.contains(def.getId()))) {
            to.full();
            return this;
        }
        // If bank > inventory and item.amount > inventory.freeslots,
        // change the item amount to the free slots we have in inventory.
        if (item.getAmount() > to.getFreeSlots() && !item.getDefinition().isStackable()) {
            if (to instanceof Inventory_1.Inventory) {
                if (this.getPlayer().withdrawAsNote()) {
                    if (def == null || !def.isNoted())
                        item.setAmount(to.getFreeSlots());
                }
                else
                    item.setAmount(to.getFreeSlots());
            }
        }
        // Make sure we aren't taking more than we have.
        if (item.getAmount() > this.getAmount(item.getId())) {
            item.setAmount(this.getAmount(item.getId()));
        }
        if (to instanceof Inventory_1.Inventory) {
            var withdrawAsNote = this.getPlayer().withdrawAsNote() && def != null && def.isNoted()
                && item.getDefinition() != null && def.getName().toLowerCase() == item.getDefinition().getName().toLowerCase();
            var checkId = withdrawAsNote ? item.getId() + 1 : item.getId();
            if (to.getAmount(checkId) + item.getAmount() > Number.MAX_SAFE_INTEGER
                || to.getAmount(checkId) + item.getAmount() <= 0) {
                item.setAmount(Number.MAX_SAFE_INTEGER - (to.getAmount(item.getId())));
                if (item.getAmount() <= 0) {
                    this.getPlayer().getPacketSender()
                        .sendMessage("You cannot withdraw that entire amount into your inventory.");
                    return this;
                }
            }
        }
        // Make sure the item is still valid
        if (item.getAmount() <= 0) {
            return this;
        }
        this.deleteItemContainer(item, slot, refresh, to);
        // Check if we can actually withdraw the item as a note.
        if (this.getPlayer().withdrawAsNote()) {
            var def_1 = ItemDefinition_1.ItemDefinition.forId(item.getId() + 1);
            if (def_1 != null && def_1.isNoted() && item.getDefinition() != null
                && def_1.getName().toLowerCase() == item.getDefinition().getName().toLowerCase()
                && !def_1.getName().includes("Torva") && !def_1.getName().includes("Virtus")
                && !def_1.getName().includes("Pernix") && !def_1.getName().includes("Torva"))
                item.setId(item.getId() + 1);
            else
                this.getPlayer().getPacketSender().sendMessage("This item cannot be withdrawn as a note.");
        }
        // Add the item to the other container
        to.add(item, refresh);
        // Sort this container
        if (sort && this.getAmount(item.getId()) <= 0)
            this.sortItems();
        // Refresh containers
        if (refresh) {
            this.refreshItems();
            to.refreshItems();
        }
        if (this.getPlayer().isSearchingBank()) {
            Bank.removeFromBankSearch(this.getPlayer(), item.clone(), true);
        }
        return this;
    };
    var _a;
    _a = Bank;
    Bank.TOTAL_BANK_TABS = 11;
    Bank.CONTAINER_START = 50300;
    Bank.BANK_SEARCH_TAB_INDEX = _a.TOTAL_BANK_TABS - 1;
    Bank.BANK_SCROLL_BAR_INTERFACE_ID = 5385;
    Bank.BANK_TAB_INTERFACE_ID = 5383;
    Bank.INVENTORY_INTERFACE_ID = 5064;
    Bank.DEPOSIT_BOX_OBJECT_IDS = [9398, 6948];
    return Bank;
}(ItemContainer_1.ItemContainer));
var bankAction = /** @class */ (function () {
    function bankAction(execFunc) {
        this.execFunc = execFunc;
    }
    bankAction.prototype.executeOption = function (option) {
        this.execFunc();
    };
    return bankAction;
}());
var bankEntered = /** @class */ (function () {
    function bankEntered(execFunc) {
        this.execFunc = execFunc;
    }
    bankEntered.prototype.execute = function (syntax) {
        this.execFunc();
    };
    return bankEntered;
}());
//# sourceMappingURL=Bank.js.map