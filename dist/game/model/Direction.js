"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Direction = exports.Directions = void 0;
var Misc_1 = require("../../util/Misc");
var Directions;
(function (Directions) {
})(Directions = exports.Directions || (exports.Directions = {}));
var Direction = exports.Direction = /** @class */ (function () {
    function Direction(id, x, y, opposite) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.opposite = opposite;
        this.diagonal = Object.keys(Direction)[id].includes('_');
    }
    Direction.prototype.getId = function () {
        return this.id;
    };
    Direction.prototype.getX = function () {
        return this.x;
    };
    Direction.prototype.getY = function () {
        return this.y;
    };
    Direction.prototype.getOpposite = function () {
        return this.opposite;
    };
    Direction.prototype.isDiagonal = function () {
        return this.diagonal;
    };
    Direction.valueOf = function (id) {
        switch (id) {
            case 0: return Direction.NORTH_WEST;
            case 1: return Direction.NORTH;
            case 2: return Direction.NORTH_EAST;
            case 3: return Direction.WEST;
            case 4: return Direction.EAST;
            case 5: return Direction.SOUTH_WEST;
            case 6: return Direction.SOUTH;
            case 7: return Direction.SOUTH_EAST;
            default: return Direction.NONE;
        }
    };
    Direction.random = function () {
        return this.valueOf(Misc_1.Misc.randomInclusive(0, 7));
    };
    Direction.fromDeltas = function (dx, dy) {
        if (dx < 0) {
            if (dy < 0) {
                return Direction.SOUTH_WEST;
            }
            else if (dy > 0) {
                return Direction.NORTH_WEST;
            }
            else {
                return Direction.WEST;
            }
        }
        else if (dx > 0) {
            if (dy < 0) {
                return Direction.SOUTH_EAST;
            }
            else if (dy > 0) {
                return Direction.NORTH_EAST;
            }
            else {
                return Direction.EAST;
            }
        }
        else {
            if (dy < 0) {
                return Direction.SOUTH;
            }
            else if (dy > 0) {
                return Direction.NORTH;
            }
            else {
                return Direction.NONE;
            }
        }
    };
    Direction.NORTH = new Direction(1, 0, 1, 6);
    Direction.NORTH_EAST = new Direction(2, 1, 1, 5);
    Direction.EAST = new Direction(4, 1, 0, 3);
    Direction.SOUTH_EAST = new Direction(7, 1, -1, 0);
    Direction.SOUTH = new Direction(6, 0, -1, 1);
    Direction.SOUTH_WEST = new Direction(5, -1, -1, 2);
    Direction.WEST = new Direction(3, -1, 0, 4);
    Direction.NORTH_WEST = new Direction(0, -1, 1, 7);
    Direction.NONE = new Direction(-1, 0, 0, -1);
    return Direction;
}());
//# sourceMappingURL=Direction.js.map