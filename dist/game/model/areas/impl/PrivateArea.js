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
exports.PrivateArea = void 0;
var Area_1 = require("../Area");
var World_1 = require("../../../World");
var ObjectManager_1 = require("../../../entity/impl/object/ObjectManager");
var ItemOnGroundManager_1 = require("../../../entity/impl/grounditem/ItemOnGroundManager");
var GameObject_1 = require("../../../entity/impl/object/GameObject");
var PrivateArea = /** @class */ (function (_super) {
    __extends(PrivateArea, _super);
    function PrivateArea(boundaries) {
        var _this = _super.call(this, boundaries) || this;
        _this.entities = [];
        _this.clips = new Map();
        _this.destroyed = false;
        return _this;
    }
    PrivateArea.prototype.postLeave = function (mobile, logout) {
        this.remove(mobile);
        if (this.getPlayers().length === 0) {
            this.destroy();
        }
    };
    PrivateArea.prototype.postEnter = function (mobile) {
        this.add(mobile);
    };
    PrivateArea.prototype.remove = function (entity) {
        this.entities = this.entities.filter(function (e) { return e !== entity; });
        entity.setArea(null);
    };
    PrivateArea.prototype.add = function (entity) {
        if (!this.entities.includes(entity)) {
            this.entities.push(entity);
        }
        entity.setArea(this);
    };
    PrivateArea.prototype.destroy = function () {
        var e_1, _a, e_2, _b, e_3, _c;
        if (this.destroyed) {
            return;
        }
        try {
            for (var _d = __values(this.getNpcs()), _e = _d.next(); !_e.done; _e = _d.next()) {
                var npc = _e.value;
                if (npc.isRegistered()) {
                    World_1.World.getRemoveNPCQueue().push(npc);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            for (var _f = __values(this.getObjects()), _g = _f.next(); !_g.done; _g = _f.next()) {
                var object = _g.value;
                ObjectManager_1.ObjectManager.deregister(object, false);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
            }
            finally { if (e_2) throw e_2.error; }
        }
        try {
            for (var _h = __values(World_1.World.getItems()), _j = _h.next(); !_j.done; _j = _h.next()) {
                var item = _j.value;
                if (item.getPrivateArea() === this) {
                    ItemOnGroundManager_1.ItemOnGroundManager.deregister(item);
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_j && !_j.done && (_c = _h.return)) _c.call(_h);
            }
            finally { if (e_3) throw e_3.error; }
        }
        this.entities = [];
        this.clips.clear();
        this.destroyed = true;
    };
    PrivateArea.prototype.getObjects = function () {
        var e_4, _a;
        var objects = [];
        try {
            for (var _b = __values(this.entities), _c = _b.next(); !_c.done; _c = _b.next()) {
                var entity = _c.value;
                if (entity instanceof GameObject_1.GameObject) {
                    objects.push(entity);
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return objects;
    };
    PrivateArea.prototype.setClip = function (location, mask) {
        this.clips.set(location, mask);
    };
    PrivateArea.prototype.removeClip = function (location) {
        this.clips.delete(location);
    };
    PrivateArea.prototype.getClip = function (location) {
        return this.clips.get(location) || 0;
    };
    PrivateArea.prototype.isDestroyed = function () {
        return this.destroyed;
    };
    return PrivateArea;
}(Area_1.Area));
exports.PrivateArea = PrivateArea;
//# sourceMappingURL=PrivateArea.js.map