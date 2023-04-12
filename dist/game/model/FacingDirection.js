"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacingDirection = void 0;
var Direction_1 = require("./Direction");
var FacingDirection = exports.FacingDirection = /** @class */ (function () {
    function FacingDirection(direction) {
        this.direction = direction;
    }
    FacingDirection.prototype.getDirection = function () {
        return this.direction;
    };
    FacingDirection.NORTH = new FacingDirection(Direction_1.Direction.NORTH);
    FacingDirection.SOUTH = new FacingDirection(Direction_1.Direction.SOUTH);
    FacingDirection.EAST = new FacingDirection(Direction_1.Direction.EAST);
    FacingDirection.WEST = new FacingDirection(Direction_1.Direction.WEST);
    return FacingDirection;
}());
//# sourceMappingURL=FacingDirection.js.map