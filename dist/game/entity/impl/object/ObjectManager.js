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
exports.OperationType = exports.ObjectManager = void 0;
var World_1 = require("../../../World");
var RegionManager_1 = require("../../../collision/RegionManager");
var MapObjects_1 = require("./MapObjects");
var ObjectManager = /** @class */ (function () {
    function ObjectManager() {
    }
    ObjectManager.onRegionChange = function (player) {
        World_1.World.getObjects().forEach(function (o) { return ObjectManager.perform(o, OperationType.SPAWN); });
        World_1.World.getRemovedObjects().forEach(function (o) { return player.getPacketSender().sendObjectRemoval(o); });
    };
    ObjectManager.register = function (object, playerUpdate) {
        // Check for matching object on this tile.
        World_1.World.getObjects().forEach(function (o, index) {
            if (o.getLocation().equals(object.getLocation()) && object.getPrivateArea() == o.getPrivateArea()) {
                World_1.World.getObjects().splice(index, 1);
            }
        });
        var matchingObjects = World_1.World.getRemovedObjects().filter(function (o) { return o.getType() == object.getType() && o.getLocation().equals(object.getLocation()); });
        matchingObjects.forEach(RegionManager_1.RegionManager.removeObjectClipping);
        matchingObjects.forEach(function (o) { return World_1.World.getRemovedObjects().splice(World_1.World.getRemovedObjects().indexOf(o), 1); });
        World_1.World.getObjects().push(object);
        if (playerUpdate) {
            ObjectManager.perform(object, OperationType.SPAWN);
        }
    };
    ObjectManager.deregister = function (object, playerUpdate) {
        World_1.World.getObjects().filter(function (o) { return o.equals(object); });
        ObjectManager.perform(object, OperationType.DESPAWN);
        World_1.World.getRemovedObjects().push(object);
    };
    /**
     * Performs the given OperationType on the given GameObject.
     * Used for spawning and despawning objects. If the object has an owner, it will
     * only be spawned for them. Otherwise, it will act as global.
     *
     * @param object
     * @param type
     */
    ObjectManager.perform = function (object, type) {
        var e_1, _a;
        if (object.getId() == -1) {
            type = OperationType.DESPAWN;
        }
        /**
         * We add/remove to/from mapobjects aswell. This is because the server handles
         * clipping via the map objects and also checks for cheatclients via them.
         */
        switch (type) {
            case OperationType.SPAWN:
                MapObjects_1.MapObjects.add(object);
                break;
            case OperationType.DESPAWN:
                MapObjects_1.MapObjects.remove(object);
                break;
        }
        /**
         * Send the object to nearby players.
         */
        switch (type) {
            case OperationType.SPAWN:
            case OperationType.DESPAWN:
                try {
                    for (var _b = __values(World_1.World.getPlayers()), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var player = _c.value;
                        if (player == null)
                            continue;
                        if (player.getPrivateArea() != object.getPrivateArea()) {
                            continue;
                        }
                        if (!player.getLocation().isWithinDistance(object.getLocation(), 64)) {
                            continue;
                        }
                        if (type == OperationType.SPAWN) {
                            player.getPacketSender().sendObject(object);
                        }
                        else {
                            player.getPacketSender().sendObjectRemoval(object);
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
                break;
        }
    };
    /**
     * Checks if a GameObject exists at the given location.
     *
     * @param position
     * @return
     */
    ObjectManager.exists = function (id, position) {
        var e_2, _a;
        try {
            for (var _b = __values(World_1.World.getObjects()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var object = _c.value;
                if (object.getLocation().equals(position) && object.getId() == id) {
                    return true;
                }
                if (object.getLocation().equals(position)) {
                    return true;
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
        return false;
    };
    ObjectManager.existsLocation = function (position) {
        var e_3, _a;
        var objects = World_1.World.getObjects();
        try {
            for (var objects_1 = __values(objects), objects_1_1 = objects_1.next(); !objects_1_1.done; objects_1_1 = objects_1.next()) {
                var object = objects_1_1.value;
                if (object.getLocation().equals(position)) {
                    return true;
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (objects_1_1 && !objects_1_1.done && (_a = objects_1.return)) _a.call(objects_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return false;
    };
    return ObjectManager;
}());
exports.ObjectManager = ObjectManager;
var OperationType;
(function (OperationType) {
    OperationType[OperationType["SPAWN"] = 0] = "SPAWN";
    OperationType[OperationType["DESPAWN"] = 1] = "DESPAWN";
})(OperationType = exports.OperationType || (exports.OperationType = {}));
//# sourceMappingURL=ObjectManager.js.map