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
exports.OperationType = exports.ItemOnGroundManager = void 0;
var GameConstants_1 = require("../../../GameConstants");
var World_1 = require("../../../World");
var TaskManager_1 = require("../../../task/TaskManager");
var ItemOnGround_1 = require("./ItemOnGround");
var ItemOnGround_2 = require("./ItemOnGround");
var GroundItemRespawnTask_1 = require("../../../task/impl/GroundItemRespawnTask");
//import { Optional } from "java.util"
var ItemOnGroundManager = exports.ItemOnGroundManager = /** @class */ (function () {
    function ItemOnGroundManager() {
    }
    ItemOnGroundManager.onRegionChange = function (player) {
        var e_1, _a;
        try {
            for (var _b = __values(World_1.World.getItems()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var item = _c.value;
                ItemOnGroundManager.performPlayer(player, item, OperationType.CREATE);
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
    ItemOnGroundManager.process = function () {
        var e_2, _a;
        try {
            for (var _b = __values(World_1.World.getItems()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var item = _c.value;
                item.process();
                if (item.isPendingRemoval()) {
                    if (item.respawns()) {
                        TaskManager_1.TaskManager.submit(new GroundItemRespawnTask_1.GroundItemRespawnTask(item, item.getRespawnTimer()));
                    }
                    var index = World_1.World.getItems().indexOf(item);
                    World_1.World.getItems().splice(index, 1);
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
    };
    ItemOnGroundManager.perform = function (item, type) {
        var e_3, _a;
        switch (item.getState()) {
            case ItemOnGround_2.State.SEEN_BY_PLAYER:
                var owner = World_1.World.getPlayerByName(item.getOwner());
                if (owner != null) {
                    ItemOnGroundManager.performPlayer(owner, item);
                }
                break;
            case ItemOnGround_2.State.SEEN_BY_EVERYONE:
                try {
                    for (var _b = __values(World_1.World.getPlayers()), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var player = _c.value;
                        if (player) {
                            ItemOnGroundManager.performPlayer(player, item);
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
                break;
            default:
                break;
        }
    };
    ItemOnGroundManager.performPlayer = function (player, item, type) {
        if (item.isPendingRemoval()) {
            type = OperationType.DELETE;
        }
        if (item.getPosition().getZ() != player.getLocation().getZ())
            return;
        if (player.getPrivateArea() != item.getPrivateArea()) {
            return;
        }
        if (item.getPosition().getDistance(player.getLocation()) > 64)
            return;
        switch (type) {
            case OperationType.ALTER:
                player.getPacketSender().alterGroundItem(item);
                break;
            case OperationType.DELETE:
                player.getPacketSender().deleteGroundItem(item);
                break;
            case OperationType.CREATE:
                if (!ItemOnGroundManager.isOwner(player.getUsername(), item)) {
                    if (item.getState() == ItemOnGround_2.State.SEEN_BY_PLAYER)
                        return;
                    if (!item.getItem().getDefinition().isTradeable() || !item.getItem().getDefinition().isDropable())
                        return;
                }
                player.getPacketSender().createGroundItem(item);
                break;
            default:
                throw new Error("Unsupported operation (" + type.toString() + ") on: " + item.toString());
        }
    };
    ItemOnGroundManager.register = function (item) {
        // No point spamming with spawned items...
        var spawnable = Array.from(GameConstants_1.GameConstants.ALLOWED_SPAWNS).includes(item.getItem().getId());
        if (spawnable) {
            return;
        }
        // Check for merge with existing stackables..
        if (item.getItem().getDefinition().isStackable()) {
            if (this.merge(item)) {
                return;
            }
        }
        // We didn't need to modify a previous item.
        // Simply register the given item to the world..
        World_1.World.getItems().push(item);
        ItemOnGroundManager.perform(item, OperationType.CREATE);
    };
    ItemOnGroundManager.merge = function (item) {
        var e_4, _a;
        var iterator = World_1.World.getItems().values();
        try {
            for (var iterator_1 = __values(iterator), iterator_1_1 = iterator_1.next(); !iterator_1_1.done; iterator_1_1 = iterator_1.next()) {
                var item_ = iterator_1_1.value;
                if (item_ == null || item_.isPendingRemoval() || item_ === item) {
                    continue;
                }
                if (!item_.getPosition().equals(item.getPosition())) {
                    continue;
                }
                // Check if the ground item is private...
                // If we aren't the owner, we shouldn't modify it.
                if (item_.getState() === ItemOnGround_2.State.SEEN_BY_PLAYER) {
                    var flag = true;
                    if (item_.getOwner() && item.getOwner()) {
                        if (item_.getOwner() === item.getOwner()) {
                            flag = false;
                        }
                    }
                    if (flag) {
                        continue;
                    }
                }
                // Modify the existing item.
                if (item_.getItem().getId() === item.getItem().getId()) {
                    var oldAmount = item_.getItem().getAmount();
                    item_.getItem().incrementAmountBy(item.getItem().getAmount());
                    item_.setOldAmount(oldAmount);
                    item_.setTick(0);
                    ItemOnGroundManager.perform(item_, OperationType.ALTER);
                    return true;
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (iterator_1_1 && !iterator_1_1.done && (_a = iterator_1.return)) _a.call(iterator_1);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return false;
    };
    ItemOnGroundManager.deregister = function (item) {
        item.setPendingRemoval(true);
        ItemOnGroundManager.perform(item, OperationType.DELETE);
    };
    ItemOnGroundManager.registers = function (player, item) {
        return this.registerLocation(player, item, player.getLocation().clone());
    };
    ItemOnGroundManager.registerLocation = function (player, item, position) {
        var i = new ItemOnGround_1.ItemOnGround(ItemOnGround_2.State.SEEN_BY_PLAYER, player.getUsername(), position, item, true, -1, player.getPrivateArea());
        this.register(i);
        return i;
    };
    ItemOnGroundManager.registerNonGlobal = function (player, item) {
        this.registerNonGlobals(player, item, player.getLocation().clone());
    };
    ItemOnGroundManager.registerNonGlobals = function (player, item, position) {
        this.register(new ItemOnGround_1.ItemOnGround(ItemOnGround_2.State.SEEN_BY_PLAYER, player.getUsername(), position, item, false, -1, player.getPrivateArea()));
    };
    ItemOnGroundManager.registerGlobal = function (player, item) {
        this.register(new ItemOnGround_1.ItemOnGround(ItemOnGround_2.State.SEEN_BY_EVERYONE, player.getUsername(), player.getLocation().clone(), item, false, -1, player.getPrivateArea()));
    };
    ItemOnGroundManager.getGroundItem = function (owner, id, position) {
        var e_5, _a;
        var iterator = World_1.World.getItems().values();
        try {
            for (var iterator_2 = __values(iterator), iterator_2_1 = iterator_2.next(); !iterator_2_1.done; iterator_2_1 = iterator_2.next()) {
                var item = iterator_2_1.value;
                if (item == null || item.isPendingRemoval()) {
                    continue;
                }
                if (item.getState() === ItemOnGround_2.State.SEEN_BY_PLAYER) {
                    if (!owner || !this.isOwner(owner, item)) {
                        continue;
                    }
                }
                if (id !== item.getItem().getId()) {
                    continue;
                }
                if (!item.getPosition().equals(position)) {
                    continue;
                }
                return item;
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (iterator_2_1 && !iterator_2_1.done && (_a = iterator_2.return)) _a.call(iterator_2);
            }
            finally { if (e_5) throw e_5.error; }
        }
        return null;
    };
    ItemOnGroundManager.exists = function (item) {
        return this.getGroundItem(item.getOwner(), item.getItem().getId(), item.getPosition()) !== undefined;
    };
    ItemOnGroundManager.isOwner = function (username, item) {
        return item.getOwner() === username;
        return false;
    };
    ItemOnGroundManager.STATE_UPDATE_DELAY = 50;
    return ItemOnGroundManager;
}());
var OperationType = exports.OperationType = /** @class */ (function () {
    function OperationType() {
    }
    OperationType.CREATE = new OperationType();
    OperationType.DELETE = new OperationType();
    OperationType.ALTER = new OperationType();
    return OperationType;
}());
//# sourceMappingURL=ItemOnGroundManager.js.map