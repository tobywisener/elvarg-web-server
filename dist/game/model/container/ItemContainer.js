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
exports.ItemContainer = void 0;
var Item_1 = require("../Item");
var Player_1 = require("../../entity/impl/player/Player");
var StackType_1 = require("./StackType");
var Bank_1 = require("./impl/Bank");
var Inventory_1 = require("./impl/Inventory");
var Equipment_1 = require("./impl/Equipment");
var ItemDefinition_1 = require("../../definition/ItemDefinition");
var Task_1 = require("../../task/Task");
var ItemOnGroundManager_1 = require("../../entity/impl/grounditem/ItemOnGroundManager");
var TaskManager_1 = require("../../task/TaskManager");
var ItemContainer = /** @class */ (function () {
    function ItemContainer(arg1, arg2) {
        this.items = new Array(this.capacity());
        if (arg1 instanceof Player_1.Player) {
            this.player = arg1;
            this.items = new Array(arg2 || 0);
        }
        else if (typeof arg1 === 'number') {
            this.items = new Array(arg1);
        }
        else {
            this.items = new Array(0);
        }
        for (var i = 0; i < this.capacity(); i++) {
            this.items[i] = new Item_1.Item(-1, 0);
        }
    }
    ItemContainer.prototype.getPlayer = function () {
        return this.player;
    };
    ItemContainer.prototype.setPlayer = function (player) {
        this.player = player;
        return this;
    };
    ItemContainer.prototype.getItems = function () {
        return this.items;
    };
    ItemContainer.prototype.getItemIdsArray = function () {
        var array = new Array(this.items.length);
        for (var i = 0; i < this.items.length; i++) {
            array[i] = this.items[i].getId();
        }
        return array;
    };
    ItemContainer.prototype.setItems = function (items) {
        this.items = items;
        return this;
    };
    ItemContainer.prototype.getCopiedItems = function () {
        var it = new Array(this.items.length);
        for (var i = 0; i < it.length; i++) {
            it[i] = this.items[i].clone();
        }
        return it;
    };
    ItemContainer.prototype.getValidItems = function () {
        var e_1, _a;
        var items = [];
        try {
            for (var _b = __values(this.items), _c = _b.next(); !_c.done; _c = _b.next()) {
                var item = _c.value;
                if (item != null && item.getId() > 0) {
                    if (item.getAmount() > 0 || (this instanceof Bank_1.Bank && item.getAmount() == 0)) {
                        items.push(item);
                    }
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
        return items;
    };
    ItemContainer.prototype.getValidItemsArray = function () {
        var items = this.getValidItems();
        var array = new Array(items.length);
        for (var i = 0; i < items.length; i++) {
            array[i] = items[i];
        }
        return array;
    };
    ItemContainer.prototype.copyValidItemsArray = function () {
        var items = this.getValidItems();
        var array = new Array(items.length);
        for (var i = 0; i < items.length; i++) {
            array[i] = new Item_1.Item(items[i].getId(), items[i].getAmount());
        }
        return array;
    };
    ItemContainer.prototype.setItem = function (slot, item) {
        this.items[slot] = item;
        return this;
    };
    ItemContainer.prototype.isSlotOccupied = function (slot) {
        return this.items[slot] != null && this.items[slot].getId() > 0 && this.items[slot].getAmount() > 0;
    };
    ItemContainer.prototype.swap = function (fromSlot, toSlot) {
        var temporaryItem = this.getItems()[fromSlot];
        if (temporaryItem == null || temporaryItem.getId() <= 0) {
            return this;
        }
        this.setItem(fromSlot, this.getItems()[toSlot]);
        this.setItem(toSlot, temporaryItem);
        return this;
    };
    ItemContainer.prototype.shiftSwap = function (fromSlot, toSlot) {
        var temporaryItem = this.getItems()[fromSlot];
        if (temporaryItem == null || temporaryItem.getId() <= 0) {
            return this;
        }
        return this;
    };
    ItemContainer.prototype.getFreeSlots = function () {
        var e_2, _a;
        var space = 0;
        try {
            for (var _b = __values(this.items), _c = _b.next(); !_c.done; _c = _b.next()) {
                var item = _c.value;
                if (item.getId() == -1) {
                    space++;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return space;
    };
    ItemContainer.prototype.isFull = function () {
        return this.getEmptySlot() == -1;
    };
    ItemContainer.prototype.isEmpty = function () {
        return this.getFreeSlots() == this.capacity();
    };
    ItemContainer.prototype.containsNumber = function (id) {
        var e_3, _a;
        try {
            for (var _b = __values(this.items), _c = _b.next(); !_c.done; _c = _b.next()) {
                var items = _c.value;
                if (items.getId() == id) {
                    return true;
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return false;
    };
    ItemContainer.prototype.containsItem = function (item) {
        return this.getAmount(item.getId()) >= item.getAmount();
    };
    ItemContainer.prototype.containsArray = function (item) {
        var e_4, _a;
        if (item.length == 0) {
            return false;
        }
        try {
            for (var item_1 = __values(item), item_1_1 = item_1.next(); !item_1_1.done; item_1_1 = item_1.next()) {
                var nextItem = item_1_1.value;
                if (nextItem == null) {
                    continue;
                }
                if (!this.containsNumber(nextItem.getId())) {
                    return false;
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (item_1_1 && !item_1_1.done && (_a = item_1.return)) _a.call(item_1);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return true;
    };
    ItemContainer.prototype.containsAnyIds = function (itemIds) {
        var e_5, _a;
        if (itemIds.length == 0 || this.isEmpty()) {
            return false;
        }
        try {
            for (var itemIds_1 = __values(itemIds), itemIds_1_1 = itemIds_1.next(); !itemIds_1_1.done; itemIds_1_1 = itemIds_1.next()) {
                var itemId = itemIds_1_1.value;
                if (itemId == -1) {
                    continue;
                }
                if (this.containsNumber(itemId)) {
                    return true;
                }
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (itemIds_1_1 && !itemIds_1_1.done && (_a = itemIds_1.return)) _a.call(itemIds_1);
            }
            finally { if (e_5) throw e_5.error; }
        }
        return false;
    };
    ItemContainer.prototype.getEmptySlot = function () {
        for (var i = 0; i < this.capacity(); i++) {
            if (this.items[i].getId() <= 0 || this.items[i].getAmount() <= 0 && !(this instanceof Bank_1.Bank)) {
                return i;
            }
        }
        return -1;
    };
    ItemContainer.prototype.getSlot = function (slotId) {
        if (this.items.length < slotId || !this.items[slotId].isValid()) {
            return -1;
        }
        return this.items[slotId].getId();
    };
    ItemContainer.prototype.getSlotForItemId = function (id) {
        for (var i = 0; i < this.capacity(); i++) {
            if (this.items[i].getId() == id) {
                if (this.items[i].getAmount() > 0 || (this instanceof Bank_1.Bank && this.items[i].getAmount() == 0)) {
                    return i;
                }
            }
        }
        return -1;
    };
    ItemContainer.prototype.getAmount = function (id) {
        var e_6, _a;
        var totalAmount = 0;
        try {
            for (var _b = __values(this.items), _c = _b.next(); !_c.done; _c = _b.next()) {
                var item = _c.value;
                if (item.getId() == id) {
                    totalAmount += item.getAmount();
                }
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_6) throw e_6.error; }
        }
        return totalAmount;
    };
    ItemContainer.prototype.getAmountForSlot = function (slot) {
        return this.items[slot].getAmount();
    };
    ItemContainer.prototype.resetItems = function () {
        for (var i = 0; i < this.capacity(); i++) {
            this.items[i] = new Item_1.Item(-1, 0);
        }
        return this;
    };
    ItemContainer.prototype.forSlot = function (slot) {
        return this.items[slot];
    };
    ItemContainer.prototype.switchItem = function (to, item, sort, slot, refresh) {
        if (this.getItems()[slot].getId() !== item.getId()) {
            return this;
        }
        if (to.getFreeSlots() <= 0 && !(to.containsNumber(item.getId()) && item.getDefinition().isStackable())) {
            to.full();
            return this;
        }
        if ((this instanceof Inventory_1.Inventory || this instanceof Equipment_1.Equipment) && to instanceof Bank_1.Bank) {
            if (to.getAmount(item.getId()) + item.getAmount() > Number.MAX_SAFE_INTEGER
                || to.getAmount(item.getId()) + item.getAmount() <= 0) {
                item.setAmount(Number.MAX_SAFE_INTEGER - (to.getAmount(item.getId())));
                if (item.getAmount() <= 0) {
                    this.getPlayer().getPacketSender()
                        .sendMessage("You cannot deposit that entire amount into your bank.");
                    return this;
                }
            }
        }
        this.deleteItemContainer(item, slot, refresh, to);
        // Noted items should not be in bank. Un-note if it's noted..
        if (to instanceof Bank_1.Bank && ItemDefinition_1.ItemDefinition.forId(item.getId()).isNoted()
            && !ItemDefinition_1.ItemDefinition.forId(item.getId() - 1).isNoted()) {
            item.setId(item.getId() - 1);
        }
        to.add(item, refresh);
        if (sort && this.getAmount(item.getId()) <= 0) {
            this.sortItems();
        }
        if (refresh) {
            this.refreshItems();
            to.refreshItems();
        }
        // Add item to bank search aswell!!
        if (to instanceof Bank_1.Bank) {
            if (this.getPlayer().isSearchingBank()) {
                Bank_1.Bank.addToBankSearch(this.getPlayer(), item, false);
            }
        }
        return this;
    };
    ItemContainer.prototype.switchItems = function (to, item, sort, refresh) {
        if (to.getFreeSlots() <= 0 && !(to.containsNumber(item.getId()) && item.getDefinition().isStackable())) {
            to.full();
            return this;
        }
        var proper_amt = this.getAmount(item.getId());
        if (item.getAmount() > proper_amt) {
            item.setAmount(proper_amt);
        }
        if (item.getAmount() <= 0) {
            return this;
        }
        this.deleteBoolean(item, refresh);
        to.add(item, refresh);
        if (sort && this.getAmount(item.getId()) <= 0) {
            this.sortItems();
        }
        if (refresh) {
            this.refreshItems();
            to.refreshItems();
        }
        return this;
    };
    /*
        * Checks if container is full
        */
    ItemContainer.prototype.fullBoolean = function (itemId) {
        return this.getFreeSlots() <= 0 && !(this.containsNumber(itemId) && ItemDefinition_1.ItemDefinition.forId(itemId).isStackable());
    };
    ItemContainer.prototype.addItems = function (items, refresh) {
        var e_7, _a;
        if (items == null) {
            return this;
        }
        try {
            for (var items_1 = __values(items), items_1_1 = items_1.next(); !items_1_1.done; items_1_1 = items_1.next()) {
                var item = items_1_1.value;
                if (item.getId() > 0 && (item.getAmount() > 0
                    || (item.getAmount() == 0 && this instanceof Bank_1.Bank))) {
                    this.add(item, refresh);
                }
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (items_1_1 && !items_1_1.done && (_a = items_1.return)) _a.call(items_1);
            }
            finally { if (e_7) throw e_7.error; }
        }
        return this;
    };
    ItemContainer.prototype.sortItems = function () {
        for (var k = 0; k < this.capacity(); k++) {
            if (this.getItems()[k] == null) {
                continue;
            }
            for (var i = 0; i < (this.capacity() - 1); i++) {
                if (this.getItems()[i] == null || this.getItems()[i].getId() <= 0
                    || (this.getItems()[i].getAmount() <= 0 && !(this instanceof Bank_1.Bank))) {
                    this.swap((i + 1), i);
                }
            }
        }
        return this;
    };
    /**
     * Adds an item to the item container.
     *
     * @param item The item to add.
     * @return The ItemContainer instance.
     */
    ItemContainer.prototype.addItem = function (item) {
        return this.add(item, true);
    };
    /**
     * Adds an item to the item container.
     *
     * @param id     The id of the item.
     * @param amount The amount of the item.
     * @return The ItemContainer instance.
     */
    ItemContainer.prototype.adds = function (id, amount) {
        return this.addItem(new Item_1.Item(id, amount));
    };
    ItemContainer.prototype.add = function (item, refresh) {
        if (item.getId() <= 0 || (item.getAmount() <= 0 && !(this instanceof Bank_1.Bank))) {
            return this;
        }
        if (ItemDefinition_1.ItemDefinition.forId(item.getId()).isStackable() || this.stackType() == StackType_1.StackType.STACKS) {
            var slot = this.getSlotForItemId(item.getId());
            if (slot == -1) {
                slot = this.getEmptySlot();
            }
            if (slot == -1) {
                if (this.getPlayer() != null) {
                    this.getPlayer().getPacketSender().sendMessage("You couldn't hold all those items.");
                }
                if (refresh) {
                    this.refreshItems();
                }
                return this;
            }
            var totalAmount = (this.items[slot].getAmount() + item.getAmount());
            this.items[slot].setId(item.getId());
            if (totalAmount > Number.MAX_SAFE_INTEGER) {
                this.items[slot].setAmount(Number.MAX_SAFE_INTEGER);
            }
            else {
                this.items[slot].setAmount(this.items[slot].getAmount() + item.getAmount());
            }
        }
        else {
            var amount = item.getAmount();
            while (amount > 0) {
                var slot = this.getEmptySlot();
                if (slot == -1) {
                    this.getPlayer().getPacketSender().sendMessage("You couldn't hold all those items.");
                    if (refresh) {
                        this.refreshItems();
                    }
                    return this;
                }
                else {
                    this.items[slot].setId(item.getId());
                    this.items[slot].setAmount(1);
                }
                amount--;
            }
        }
        if (refresh) {
            this.refreshItems();
        }
        return this;
    };
    ItemContainer.prototype.deletes = function (item) {
        return this.deleteNumber(item.getId(), item.getAmount());
    };
    /**
     * Deletes an item from the item container.
     *
     * @param item The item to delete.
     * @param slot The slot of the item (used to delete the item from said slot, not
     *             the first one found).
     * @return The ItemContainer instance.
     */
    ItemContainer.prototype.deleteItem = function (item, slot) {
        return this.deletedItem(item, slot, true);
    };
    /**
     * Deletes an item from the item container.
     *
     * @param id     The id of the item to delete.
     * @param amount The amount of the item to delete.
     * @return The ItemContainer instance.
     */
    ItemContainer.prototype.delete = function (id, amount) {
        return this.deleted(id, amount, true);
    };
    ItemContainer.prototype.deleteNumber = function (id, amount) {
        return this.deleted(id, amount, true);
    };
    ItemContainer.prototype.deleteBoolean = function (item, refresh) {
        return this.deleted(item.getId(), item.getAmount(), refresh);
    };
    /**
     * Deletes an item from the item container.
     *
     * @param id      The id of the item to delete.
     * @param amount  The amount of the item to delete.
     * @param refresh If <code>true</code> the item container interface will refresh.
     * @return The ItemContainer instance.
     */
    ItemContainer.prototype.deleted = function (id, amount, refresh) {
        return this.deletedItem(new Item_1.Item(id, amount), this.getSlotForItemId(id), refresh);
    };
    ItemContainer.prototype.deletedItem = function (item, slot, refresh) {
        return this.deleteItemContainer(item, slot, refresh, null);
    };
    ItemContainer.prototype.deleteItemContainer = function (item, slot, refresh, toContainer) {
        if (item.getId() <= 0 || (item.getAmount() <= 0 && !(this instanceof Bank_1.Bank)) || slot < 0) {
            return this;
        }
        var leavePlaceHolder = (toContainer instanceof Inventory_1.Inventory && this instanceof Bank_1.Bank
            && this.getPlayer().isPlaceholders());
        if (item.getAmount() > this.getAmount(item.getId())) {
            item.setAmount(this.getAmount(item.getId()));
        }
        if (item.getDefinition().isStackable() || this.stackType() == StackType_1.StackType.STACKS) {
            this.items[slot].setAmount(this.items[slot].getAmount() - item.getAmount());
            if (this.items[slot].getAmount() < 1) {
                this.items[slot].setAmount(0);
                if (!leavePlaceHolder) {
                    this.items[slot].setId(-1);
                }
            }
        }
        else {
            var amount = item.getAmount();
            while (amount > 0) {
                if (slot == -1 || (toContainer != null && toContainer.isFull())) {
                    break;
                }
                if (!leavePlaceHolder) {
                    this.items[slot].setId(-1);
                }
                this.items[slot].setAmount(0);
                slot = this.getSlotForItemId(item.getId());
                amount--;
            }
        }
        if (refresh) {
            this.refreshItems();
        }
        return this;
    };
    ItemContainer.prototype.deleteItemAny = function (optional) {
        var e_8, _a;
        if (optional) {
            try {
                for (var optional_1 = __values(optional), optional_1_1 = optional_1.next(); !optional_1_1.done; optional_1_1 = optional_1.next()) {
                    var deleteItem = optional_1_1.value;
                    if (!deleteItem) {
                        continue;
                    }
                    this.deletes(deleteItem);
                }
            }
            catch (e_8_1) { e_8 = { error: e_8_1 }; }
            finally {
                try {
                    if (optional_1_1 && !optional_1_1.done && (_a = optional_1.return)) _a.call(optional_1);
                }
                finally { if (e_8) throw e_8.error; }
            }
        }
    };
    ItemContainer.prototype.getById = function (id) {
        for (var i = 0; i < this.items.length; i++) {
            if (!this.items[i]) {
                continue;
            }
            if (this.items[i].id === id) {
                return this.items[i];
            }
        }
        return null;
    };
    ItemContainer.prototype.contains = function (id) {
        var e_9, _a;
        try {
            for (var _b = __values(this.items), _c = _b.next(); !_c.done; _c = _b.next()) {
                var item = _c.value;
                if (item.getId() === id) {
                    return true;
                }
            }
        }
        catch (e_9_1) { e_9 = { error: e_9_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_9) throw e_9.error; }
        }
        return false;
    };
    ItemContainer.prototype.containsAllAny = function (ids) {
        var _this = this;
        return ids.every(function (id) { return _this.containsNumber(id); });
    };
    ItemContainer.prototype.containsAllItem = function (items) {
        var _this = this;
        return items.filter(function (item) { return item; }).every(function (item) { return _this.containsNumber(item.id); });
    };
    ItemContainer.prototype.containsAny = function (ids) {
        var _this = this;
        return ids.some(function (id) { return _this.containsNumber(id); });
    };
    ItemContainer.prototype.set = function (slot, item) {
        this.items[slot] = item;
    };
    ItemContainer.prototype.get = function (slot) {
        return this.items[slot];
    };
    ItemContainer.prototype.isSlotFree = function (slot) {
        return !this.items[slot] || this.items[slot].id === -1;
    };
    ItemContainer.prototype.toSafeArray = function () {
        return this.items.filter(function (item) { return item; });
    };
    ItemContainer.prototype.moveItems = function (to, refreshOrig, refreshTo) {
        var e_10, _a;
        if (refreshOrig === void 0) { refreshOrig = true; }
        if (refreshTo === void 0) { refreshTo = true; }
        try {
            for (var _b = __values(this.getValidItems()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var it = _c.value;
                if (to.getFreeSlots() <= 0 && !(to.containsNumber(it.id) && it.getDefinition().isStackable())) {
                    break;
                }
                to.add(it, false);
                this.deleted(it.id, it.amount, false);
            }
        }
        catch (e_10_1) { e_10 = { error: e_10_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_10) throw e_10.error; }
        }
        if (refreshOrig) {
            this.refreshItems();
        }
        if (refreshTo) {
            to.refreshItems();
        }
    };
    ItemContainer.prototype.addItemSet = function (item) {
        var e_11, _a;
        try {
            for (var item_2 = __values(item), item_2_1 = item_2.next(); !item_2_1.done; item_2_1 = item_2.next()) {
                var addItem = item_2_1.value;
                if (!addItem) {
                    continue;
                }
                this.addItem(addItem);
            }
        }
        catch (e_11_1) { e_11 = { error: e_11_1 }; }
        finally {
            try {
                if (item_2_1 && !item_2_1.done && (_a = item_2.return)) _a.call(item_2);
            }
            finally { if (e_11) throw e_11.error; }
        }
    };
    ItemContainer.prototype.deleteItemSet = function (optional) {
        var e_12, _a;
        var deleteItem;
        try {
            for (var optional_2 = __values(optional), optional_2_1 = optional_2.next(); !optional_2_1.done; optional_2_1 = optional_2.next()) {
                deleteItem = optional_2_1.value;
                if (deleteItem == null) {
                    continue;
                }
                this.deletes(deleteItem);
            }
        }
        catch (e_12_1) { e_12 = { error: e_12_1 }; }
        finally {
            try {
                if (optional_2_1 && !optional_2_1.done && (_a = optional_2.return)) _a.call(optional_2);
            }
            finally { if (e_12) throw e_12.error; }
        }
    };
    ItemContainer.prototype.forceAdd = function (player, item) {
        if (this.getFreeSlots() <= 0 && !(this.containsNumber(item.id) && item.getDefinition().isStackable())) {
            TaskManager_1.TaskManager.submit(new ItemContainerTask(function () {
                ItemOnGroundManager_1.ItemOnGroundManager.registers(player, item);
            }));
        }
        else {
            this.addItem(item);
        }
    };
    ItemContainer.prototype.getTotalValue = function () {
        var e_13, _a;
        var value = 0;
        try {
            for (var _b = __values(this.getValidItems()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var item = _c.value;
                value += item.getDefinition().getValue() * item.amount;
            }
        }
        catch (e_13_1) { e_13 = { error: e_13_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_13) throw e_13.error; }
        }
        if (value >= Number.MAX_SAFE_INTEGER) {
            return "Too High!";
        }
        return value.toString();
    };
    ItemContainer.prototype.hasAts = function (slot, item) {
        var at = this.items[slot];
        return at != null && at.id === item;
    };
    ItemContainer.prototype.hasAt = function (slot) {
        return slot >= 0 && slot < this.items.length && this.items[slot] != null;
    };
    return ItemContainer;
}());
exports.ItemContainer = ItemContainer;
var ItemContainerTask = /** @class */ (function (_super) {
    __extends(ItemContainerTask, _super);
    function ItemContainerTask(execFunc) {
        var _this = _super.call(this, 1) || this;
        _this.execFunc = execFunc;
        return _this;
    }
    ItemContainerTask.prototype.execute = function () {
        this.execFunc();
    };
    return ItemContainerTask;
}(Task_1.Task));
//# sourceMappingURL=ItemContainer.js.map