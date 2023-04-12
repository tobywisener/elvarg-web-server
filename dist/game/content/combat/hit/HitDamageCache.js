"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HitDamageCache = void 0;
var HitDamageCache = /** @class */ (function () {
    function HitDamageCache(damage) {
        this.damage = damage;
    }
    HitDamageCache.prototype.getDamage = function () {
        return this.damage;
    };
    HitDamageCache.prototype.incrementDamage = function (damage) {
        this.startTime = performance.now();
        this.damage += damage;
        this.endTime = performance.now();
    };
    HitDamageCache.prototype.getStopwatch = function () {
        return this.endTime - this.startTime;
    };
    return HitDamageCache;
}());
exports.HitDamageCache = HitDamageCache;
//# sourceMappingURL=HitDamageCache.js.map