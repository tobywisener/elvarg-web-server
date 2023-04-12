"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TileUtils = void 0;
var TileUtils = /** @class */ (function () {
    function TileUtils() {
    }
    TileUtils.getDistance = function (source, dest) {
        return TileUtils.calculateDistance(source.getX(), source.getY(), dest.getX(), dest.getY());
    };
    TileUtils.hasGetDistance = function (source, destX, destY) {
        return TileUtils.calculateDistance(source.getX(), source.getY(), destX, destY);
    };
    TileUtils.calculateDistance = function (x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    };
    return TileUtils;
}());
exports.TileUtils = TileUtils;
//# sourceMappingURL=TileUtils.js.map