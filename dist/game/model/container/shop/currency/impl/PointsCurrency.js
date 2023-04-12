"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PointsCurrency = void 0;
var PointsCurrency = /** @class */ (function () {
    function PointsCurrency() {
    }
    PointsCurrency.prototype.getName = function () {
        return "Points";
    };
    PointsCurrency.prototype.getAmountForPlayer = function (player) {
        return player.getPoints();
    };
    PointsCurrency.prototype.decrementForPlayer = function (player, amount) {
        player.setPoints(player.getPoints() - amount);
    };
    PointsCurrency.prototype.incrementForPlayer = function (player, amount) {
        player.setPoints(player.getPoints() + amount);
    };
    return PointsCurrency;
}());
exports.PointsCurrency = PointsCurrency;
//# sourceMappingURL=PointsCurrency.js.map