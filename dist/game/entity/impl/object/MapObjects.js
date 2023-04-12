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
exports.MapObjects = void 0;
var RegionManager_1 = require("../../../collision/RegionManager");
var PlayerRights_1 = require("../../../model/rights/PlayerRights");
var GameObject_1 = require("./GameObject");
var MapObjects = exports.MapObjects = /** @class */ (function () {
    function MapObjects() {
    }
    MapObjects.getPrivateArea = function (player, id, location) {
        var object = this.get(id, location, player.getPrivateArea());
        if (object == null && player.getRights() == PlayerRights_1.PlayerRights.DEVELOPER) {
            player.getPacketSender().sendMessage("@red@Object with id " + id + " does not exist.");
            object = new GameObject_1.GameObject(id, location, 10, 0, player.getPrivateArea());
        }
        return object;
    };
    MapObjects.get = function (id, location, privateArea) {
        var e_1, _a, e_2, _b;
        // Check instanced objects..
        if (privateArea != null) {
            try {
                for (var _c = __values(privateArea.getObjects()), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var object = _d.value;
                    if (object.getId() == id && object.getLocation().equals(location)) {
                        return object;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        // Load region..
        RegionManager_1.RegionManager.loadMapFiles(location.getX(), location.getY());
        // Get hash..
        if (location.getZ() >= 4) {
            location = location.clone().setZ(0);
        }
        var hash = this.getHash(location.getX(), location.getY(), location.getZ());
        // Check if the map contains the hash..
        if (!this.mapObjects.has(hash)) {
            return null;
        }
        // Go through the objects in the list..
        var list = this.mapObjects.get(hash);
        if (list != null) {
            try {
                for (var list_1 = __values(list), list_1_1 = list_1.next(); !list_1_1.done; list_1_1 = list_1.next()) {
                    var o = list_1_1.value;
                    if (o.getId() == id && o.getLocation().equals(location)) {
                        return o;
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (list_1_1 && !list_1_1.done && (_b = list_1.return)) _b.call(list_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
        return null;
    };
    MapObjects.getType = function (location, type, privateArea) {
        var e_3, _a, e_4, _b;
        // Check instanced objects..
        if (privateArea != null) {
            try {
                for (var _c = __values(privateArea.getObjects()), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var object = _d.value;
                    if (object.getType() == type && object.getLocation().equals(location)) {
                        return object;
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }
        // Load region..
        RegionManager_1.RegionManager.loadMapFiles(location.getX(), location.getY());
        // Get hash..
        if (location.getZ() >= 4) {
            location = location.clone().setZ(0);
        }
        var hash = MapObjects.getHash(location.getX(), location.getY(), location.getZ());
        // Check if the map contains the hash..
        if (!this.mapObjects.has(hash)) {
            return null;
        }
        // Go through the objects in the list..
        var list = this.mapObjects.get(hash);
        if (list != null) {
            try {
                for (var list_2 = __values(list), list_2_1 = list_2.next(); !list_2_1.done; list_2_1 = list_2.next()) {
                    var o = list_2_1.value;
                    if (o.getType() == type && o.getLocation().equals(location)) {
                        return o;
                    }
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (list_2_1 && !list_2_1.done && (_b = list_2.return)) _b.call(list_2);
                }
                finally { if (e_4) throw e_4.error; }
            }
        }
        return null;
    };
    MapObjects.exists = function (object) {
        return this.get(object.getId(), object.getLocation(), object.getPrivateArea()) === object;
    };
    MapObjects.add = function (object) {
        if (!object.getPrivateArea()) {
            var hash = this.getHash(object.getLocation().getX(), object.getLocation().getY(), object.getLocation().getZ());
            if (this.mapObjects.has(hash)) {
                var exists_1 = false;
                var list = this.mapObjects.get(hash);
                list.forEach(function (o) {
                    if (o === object) {
                        exists_1 = true;
                        return;
                    }
                });
                if (!exists_1) {
                    this.mapObjects.get(hash).push(object);
                }
            }
            else {
                this.mapObjects.set(hash, [object]);
            }
        }
        RegionManager_1.RegionManager.addObjectClipping(object);
    };
    MapObjects.remove = function (object) {
        var hash = this.getHash(object.getLocation().getX(), object.getLocation().getY(), object.getLocation().getZ());
        if (this.mapObjects.has(hash)) {
            var list = this.mapObjects.get(hash);
            for (var i = 0; i < list.length; i++) {
                if (list[i].getId() === object.getId() && list[i].getLocation().equals(object.getLocation())) {
                    list.splice(i, 1);
                }
            }
        }
        RegionManager_1.RegionManager.removeObjectClipping(object);
    };
    MapObjects.clear = function (position, clipShift) {
        var hash = this.getHash(position.getX(), position.getY(), position.getZ());
        if (this.mapObjects.has(hash)) {
            var list = this.mapObjects.get(hash);
            for (var i = 0; i < list.length; i++) {
                if (list[i].getLocation().equals(position)) {
                    list.splice(i, 1);
                }
            }
        }
        RegionManager_1.RegionManager.removeClipping(position.getX(), position.getY(), position.getZ(), clipShift, null);
    };
    MapObjects.getHash = function (x, y, z) {
        return z + (x << 24) + (y << 48);
    };
    MapObjects.mapObjects = new Map();
    return MapObjects;
}());
//# sourceMappingURL=MapObjects.js.map