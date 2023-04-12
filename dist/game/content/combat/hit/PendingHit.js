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
exports.PendingHit = void 0;
var CombatFactory_1 = require("../CombatFactory");
var HitDamage_1 = require("./HitDamage");
var AccuracyFormulasDpsCalc_1 = require("../formula/AccuracyFormulasDpsCalc");
var HitMask_1 = require("./HitMask");
var PendingHit = /** @class */ (function () {
    function PendingHit(attacker, target, method, delay, handleAfterHitEffects) {
        this.attacker = attacker;
        this.target = target;
        this.method = method;
        this.combatType = method.type();
        this.hits = this.prepareHits(1, true);
        this.delay = delay ? delay : 0;
        this.handleAfterHitEffects = handleAfterHitEffects ? handleAfterHitEffects : true;
    }
    PendingHit.prototype.getAttacker = function () {
        return this.attacker;
    };
    PendingHit.prototype.getTarget = function () {
        return this.target;
    };
    PendingHit.prototype.getCombatMethod = function () {
        return this.method;
    };
    PendingHit.prototype.getHits = function () {
        return this.hits;
    };
    PendingHit.prototype.getAndDecrementDelay = function () {
        return this.delay--;
    };
    PendingHit.prototype.getExecutedInTicks = function () {
        return this.delay;
    };
    PendingHit.prototype.getTotalDamage = function () {
        return this.totalDamage;
    };
    PendingHit.prototype.isAccurate = function () {
        return this.accurate;
    };
    PendingHit.prototype.setTotalDamage = function (damage) {
        var e_1, _a;
        try {
            for (var _b = __values(this.hits), _c = _b.next(); !_c.done; _c = _b.next()) {
                var hit = _c.value;
                hit.setDamage(damage);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        this.updateTotalDamage();
    };
    PendingHit.prototype.setHandleAfterHitEffects = function (handleAfterHitEffects) {
        this.handleAfterHitEffects = handleAfterHitEffects;
        return this;
    };
    PendingHit.prototype.getHandleAfterHitEffects = function () {
        return this.handleAfterHitEffects;
    };
    PendingHit.prototype.prepareHits = function (hitAmount, rollAccuracy) {
        // Check the hit amounts.
        if (hitAmount > 4) {
            throw new Error("Illegal number of hits! The maximum number of hits per turn is 4.");
        }
        else if (hitAmount < 0) {
            throw new Error("Illegal number of hits! The minimum number of hits per turn is 0.");
        }
        if (this.attacker == null || this.target == null) {
            return null;
        }
        var hits = new Array(hitAmount);
        for (var i = 0; i < hits.length; i++) {
            this.accurate = !rollAccuracy || AccuracyFormulasDpsCalc_1.AccuracyFormulasDpsCalc.rollAccuracy(this.attacker, this.target, this.combatType);
            var damage = this.accurate ? CombatFactory_1.CombatFactory.getHitDamage(this.attacker, this.target, this.combatType) : new HitDamage_1.HitDamage(0, HitMask_1.HitMask.BLUE);
            this.totalDamage += damage.getDamage();
            hits[i] = damage;
        }
        return hits;
    };
    PendingHit.prototype.updateTotalDamage = function () {
        this.totalDamage = 0;
        for (var i = 0; i < this.hits.length; i++) {
            this.totalDamage += this.hits[i].getDamage();
        }
    };
    PendingHit.prototype.getSkills = function () {
        if (this.attacker.isNpc()) {
            return new Array();
        }
        return (this.attacker.getFightType().constructor().getStyle().skill(this.combatType));
    };
    PendingHit.prototype.getCombatType = function () {
        return this.combatType;
    };
    return PendingHit;
}());
exports.PendingHit = PendingHit;
//# sourceMappingURL=PendingHit.js.map