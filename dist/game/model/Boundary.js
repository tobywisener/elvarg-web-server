"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Boundary = void 0;
var Boundary = /** @class */ (function () {
    function Boundary(x, x2, y, y2, height) {
        this.x = x;
        this.x2 = x2;
        this.y = y;
        this.y2 = y2;
        this.height = height;
    }
    Boundary.prototype.getX = function () {
        return this.x;
    };
    Boundary.prototype.getX2 = function () {
        return this.x2;
    };
    Boundary.prototype.getY = function () {
        return this.y;
    };
    Boundary.prototype.getY2 = function () {
        return this.y2;
    };
    Boundary.prototype.inside = function (p) {
        return p.getX() >= this.x && p.getX() <= this.x2 && p.getY() >= this.y && p.getY() <= this.y2 && this.height == p.getZ();
    };
    return Boundary;
}());
exports.Boundary = Boundary;
//# sourceMappingURL=Boundary.js.map