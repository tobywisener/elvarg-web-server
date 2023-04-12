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
exports.GameObject = void 0;
var Entity_1 = require("../../Entity");
var ObjectDefinition_1 = require("../../../definition/ObjectDefinition");
var World_1 = require("../../../World");
var GameObject = /** @class */ (function (_super) {
    __extends(GameObject, _super);
    function GameObject(id, position, type, face, privateArea) {
        var _this = _super.call(this, position) || this;
        _this.id = id;
        _this.type = type;
        _this.face = face;
        if (privateArea != null) {
            privateArea.add(_this);
        }
        _this.privateArea = privateArea;
        return _this;
    }
    GameObject.prototype.getId = function () {
        return this.id;
    };
    GameObject.prototype.getType = function () {
        return this.type;
    };
    GameObject.prototype.setType = function (type) {
        this.type = type;
    };
    GameObject.prototype.getFace = function () {
        return this.face;
    };
    GameObject.prototype.setFace = function (face) {
        this.face = face;
    };
    GameObject.prototype.getDefinition = function () {
        return ObjectDefinition_1.ObjectDefinition.forId(this.id);
    };
    GameObject.prototype.performAnimation = function (animation) {
        var e_1, _a;
        try {
            for (var _b = __values(World_1.World.getPlayers()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var player = _c.value;
                if (player == null) {
                    continue;
                }
                if (player.getPrivateArea() !== this.getPrivateArea()) {
                    continue;
                }
                if (!player.getLocation().isViewableFrom(this.getLocation())) {
                    continue;
                }
                player.getPacketSender().sendObjectAnimation(this, animation);
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
    GameObject.prototype.performGraphic = function (graphic) {
        var e_2, _a;
        try {
            for (var _b = __values(World_1.World.getPlayers()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var player = _c.value;
                if (player == null) {
                    continue;
                }
                if (player.getPrivateArea() !== this.getPrivateArea()) {
                    continue;
                }
                if (!player.getLocation().isViewableFrom(this.getLocation())) {
                    continue;
                }
                player.getPacketSender().sendGraphic(graphic, this.getLocation());
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
    GameObject.prototype.getSize = function () {
        var definition = this.getDefinition();
        if (definition == null) {
            return 1;
        }
        return (definition.getSizeX() + definition.getSizeY()) - 1;
    };
    GameObject.prototype.equals = function (o) {
        if (!(o instanceof GameObject))
            return false;
        var object = o;
        return object.getLocation().equals(this.getLocation()) && object.getId() === this.getId() && object.getFace() === this.getFace()
            && object.getType() === this.getType() && object.getPrivateArea() === this.getPrivateArea();
    };
    GameObject.prototype.clone = function () {
        return new GameObject(this.getId(), this.getLocation(), this.getType(), this.getFace(), this.getPrivateArea());
    };
    return GameObject;
}(Entity_1.Entity));
exports.GameObject = GameObject;
//# sourceMappingURL=GameObject.js.map