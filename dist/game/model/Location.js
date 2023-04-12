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
exports.Location = void 0;
var Misc_1 = require("../../util/Misc");
var Location = /** @class */ (function () {
    /**
     * The Position constructor.
     *
     * @param x The x-type coordinate of the position.
     * @param y The y-type coordinate of the position.
     * @param z The height of the position.
     */
    function Location(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    /**
     * Gets the x coordinate of this position.
     *
     * @return The associated x coordinate.
     */
    Location.prototype.getX = function () {
        return this.x;
    };
    Location.prototype.setX = function (x) {
        this.x = x;
        return this;
    };
    Location.prototype.getY = function () {
        return this.y;
    };
    Location.prototype.setY = function (y) {
        this.y = y;
        return this;
    };
    Location.prototype.getZ = function () {
        return this.z;
    };
    Location.prototype.setZ = function (z) {
        this.z = z;
        return this;
    };
    Location.prototype.set = function (x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    };
    Location.prototype.setAs = function (other) {
        this.x = other.x;
        this.y = other.y;
        this.z = other.z;
    };
    Location.prototype.getLocalX = function (position) {
        return this.x - 8 * position.getRegionX();
    };
    Location.prototype.getLocalY = function (position) {
        return this.y - 8 * position.getRegionY();
    };
    Location.prototype.getRegionX = function () {
        return (this.x >> 3) - 6;
    };
    Location.prototype.getRegionY = function () {
        return (this.y >> 3) - 6;
    };
    Location.prototype.add = function (x, y) {
        this.x += x;
        this.y += y;
        return this;
    };
    Location.prototype.addX = function (x) {
        this.x += x;
        return this;
    };
    Location.prototype.addY = function (y) {
        this.y += y;
        return this;
    };
    Location.prototype.transform = function (x, y) {
        return this.clone().addX(x).addY(y);
    };
    Location.prototype.clone = function () {
        var location = new Location(this.x, this.y);
        location.x = this.x;
        location.y = this.y;
        location.z = this.z;
        return location;
    };
    Location.prototype.isPerpendicularTo = function (other) {
        var delta = Misc_1.Misc.delta(this, other);
        return delta.x !== delta.y && delta.x === 0 || delta.y === 0;
    };
    Location.prototype.isWithinDistance = function (other, distance) {
        if (this.z !== other.z) {
            return false;
        }
        var deltaX = Math.abs(this.x - other.x);
        var deltaY = Math.abs(this.y - other.y);
        return deltaX <= distance && deltaY <= distance;
    };
    Location.prototype.isWithinInteractionDistance = function (other) {
        if (this.z !== other.z) {
            return false;
        }
        var deltaX = other.x - this.x, deltaY = other.y - this.y;
        return deltaX <= 2 && deltaX >= -3 && deltaY <= 2 && deltaY >= -3;
    };
    Location.prototype.getDistance = function (other) {
        var deltaX = this.x - other.x;
        var deltaY = this.y - other.y;
        return Math.ceil(Math.sqrt(deltaX * deltaX + deltaY * deltaY));
    };
    Location.prototype.move = function (position) {
        var x = (this.x + position.x);
        var y = (this.y + position.y);
        var z = (this.z + position.z);
        return new Location(x, y);
    };
    Location.prototype.getMove = function (direction) {
        return this.move(new Location(direction.x, direction.y));
    };
    Location.delta = function (a, b) {
        return new Location(b.x - a.x, b.y - a.y);
    };
    Location.prototype.distanceToPoint = function (pointX, pointY) {
        return Math.sqrt(Math.pow(this.x - pointX, 2) + Math.pow(this.y - pointY, 2));
    };
    Location.prototype.calculateDistance = function (other) {
        var xDiff = this.x - other.x;
        var yDiff = this.y - other.y;
        var distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
        return Math.floor(distance);
    };
    Location.calculateDistance = function (tiles, otherTiles) {
        var e_1, _a, e_2, _b;
        var lowestCount = Number.MAX_SAFE_INTEGER;
        try {
            for (var tiles_1 = __values(tiles), tiles_1_1 = tiles_1.next(); !tiles_1_1.done; tiles_1_1 = tiles_1.next()) {
                var tile = tiles_1_1.value;
                try {
                    for (var otherTiles_1 = (e_2 = void 0, __values(otherTiles)), otherTiles_1_1 = otherTiles_1.next(); !otherTiles_1_1.done; otherTiles_1_1 = otherTiles_1.next()) {
                        var toTile = otherTiles_1_1.value;
                        if (tile === toTile) {
                            return 0;
                        }
                        var distance = tile.calculateDistance(toTile);
                        if (distance < lowestCount) {
                            lowestCount = distance;
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (otherTiles_1_1 && !otherTiles_1_1.done && (_b = otherTiles_1.return)) _b.call(otherTiles_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (tiles_1_1 && !tiles_1_1.done && (_a = tiles_1.return)) _a.call(tiles_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return lowestCount;
    };
    Location.prototype.toString = function () {
        return "[" + this.x + ", " + this.y + ", " + this.z + "]";
    };
    Location.prototype.hashCode = function () {
        return this.z << 30 | this.x << 15 | this.y;
    };
    Location.prototype.equals = function (other) {
        if (!(other instanceof Location)) {
            return false;
        }
        var position = other;
        return position.x == this.x && position.y == this.y && position.z == this.z;
    };
    Location.prototype.isViewableFrom = function (other) {
        if (this.z !== other.z) {
            return false;
        }
        var p = Misc_1.Misc.delta(this, other);
        return p.x <= 15 && p.x >= -15 && p.y <= 15 && p.y >= -15;
    };
    Location.prototype.getTranslate = function (x, y) {
        return this.translate(x, y, 0);
    };
    Location.prototype.translate = function (x, y, z) {
        return new Location(this.x + x, this.y + y);
    };
    Location.prototype.rotate = function (degrees) {
        var rx = Math.floor((this.x * Math.cos(degrees)) - (this.y * Math.sin(degrees)));
        var ry = Math.floor((this.x * Math.sin(degrees)) + (this.y * Math.cos(degrees)));
        return new Location(rx, ry);
    };
    return Location;
}());
exports.Location = Location;
//# sourceMappingURL=Location.js.map