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
exports.HitQueue = void 0;
var Flag_1 = require("../../../model/Flag");
var CombatFactory_1 = require("../../../content/combat/CombatFactory");
var HitQueue = /** @class */ (function () {
    function HitQueue() {
        this.pendingHits = [];
        this.pendingDamage = [];
    }
    HitQueue.prototype.process = function (character) {
        if (character.getHitpoints() <= 0) {
            this.pendingHits = [];
            this.pendingDamage = [];
            return;
        }
        for (var i = 0; i < this.pendingHits.length; i++) {
            var hit = this.pendingHits[i];
            if (hit == null || hit.getTarget() == null || hit.getAttacker() == null || hit.getTarget().isUntargetable() || hit.getAttacker().getHitpoints() <= 0) {
                this.pendingHits.splice(i, 1);
                continue;
            }
            if (hit.getAndDecrementDelay() <= 0) {
                CombatFactory_1.CombatFactory.executeHit(hit);
                this.pendingHits.splice(i, 1);
            }
        }
        if (this.pendingDamage.length > 0) {
            if (!character.getUpdateFlag().flagged(Flag_1.Flag.SINGLE_HIT)) {
                var firstHit = this.pendingDamage.shift();
                // Check if it's present
                if (firstHit != null) {
                    // Update entity hit data and deal the actual damage.
                    character.setPrimaryHit(character.decrementHealth(firstHit));
                    character.getUpdateFlag().flag(Flag_1.Flag.SINGLE_HIT);
                }
            }
            // Update the secondary hit for this entity.
            if (!character.getUpdateFlag().flagged(Flag_1.Flag.DOUBLE_HIT)) {
                // Attempt to fetch a second hit.
                var secondHit = this.pendingDamage.shift();
                // Check if it's present
                if (secondHit != null) {
                    // Update entity hit data and deal the actual damage.
                    character.setSecondaryHit(character.decrementHealth(secondHit));
                    character.getUpdateFlag().flag(Flag_1.Flag.DOUBLE_HIT);
                }
            }
        }
    };
    HitQueue.prototype.addPendingHit = function (c_h) {
        this.pendingHits.push(c_h);
    };
    HitQueue.prototype.addPendingDamage = function (hits) {
        var _this = this;
        hits.filter(function (h) { return h != null; }).forEach(function (h) { return _this.pendingDamage.push(h); });
    };
    HitQueue.prototype.getAccumulatedDamage = function () {
        var hitDmg = this.pendingHits.filter(function (pd) { return pd.getExecutedInTicks() < 2; }).map(function (pd) { return pd.getTotalDamage(); }).reduce(function (a, b) { return a + b; });
        var dmg = this.pendingDamage.map(function (h) { return h.getDamage(); }).reduce(function (a, b) { return a + b; });
        return hitDmg + dmg;
    };
    HitQueue.prototype.isEmpty = function (exception) {
        var e_1, _a;
        try {
            for (var _b = __values(this.pendingHits), _c = _b.next(); !_c.done; _c = _b.next()) {
                var hit = _c.value;
                if (hit == null) {
                    continue;
                }
                if (hit.getAttacker() != null) {
                    if (hit.getAttacker() !== exception) {
                        return false;
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return true;
    };
    return HitQueue;
}());
exports.HitQueue = HitQueue;
//# sourceMappingURL=HitQueue.js.map