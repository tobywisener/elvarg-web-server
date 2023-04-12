"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HitDamage = void 0;
var HitMask_1 = require("./HitMask");
var HitDamage = /** @class */ (function () {
    function HitDamage(damage, hitmask) {
        this.damage = damage;
        this.hitmask = hitmask;
        this.startHitmask = hitmask;
        this.update();
    }
    HitDamage.prototype.getDamage = function () {
        return this.damage;
    };
    HitDamage.prototype.setDamage = function (damage) {
        this.damage = damage;
        this.update();
    };
    HitDamage.prototype.incrementDamage = function (damage) {
        this.damage += damage;
        this.update();
    };
    HitDamage.prototype.multiplyDamage = function (mod) {
        this.damage *= mod;
        this.update();
    };
    HitDamage.prototype.update = function () {
        if (this.damage > 0) {
            this.hitmask = this.startHitmask == HitMask_1.HitMask.BLUE ? HitMask_1.HitMask.RED : this.startHitmask;
        }
        else {
            this.damage = 0;
            this.hitmask = HitMask_1.HitMask.BLUE;
        }
    };
    HitDamage.prototype.getHitmask = function () {
        return this.hitmask;
    };
    HitDamage.prototype.setHitmask = function (hitmask) {
        this.hitmask = hitmask;
    };
    return HitDamage;
}());
exports.HitDamage = HitDamage;
//# sourceMappingURL=HitDamage.js.map