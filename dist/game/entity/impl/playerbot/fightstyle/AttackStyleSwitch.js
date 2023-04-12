"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttackStyleSwitch = void 0;
var AttackStyleSwitch = /** @class */ (function () {
    function AttackStyleSwitch(combatType, combatSwitch) {
        this.combatType = combatType;
        this.combatSwitch = combatSwitch;
        this.attackRoll = 9999999;
        this.maxHit = 120;
        this.hitSpeed = 4;
    }
    AttackStyleSwitch.prototype.getCombatType = function () {
        return this.combatType;
    };
    AttackStyleSwitch.prototype.getCombatSwitch = function () {
        return this.combatSwitch;
    };
    AttackStyleSwitch.prototype.getMaxHit = function () {
        return this.maxHit;
    };
    AttackStyleSwitch.prototype.setMaxHit = function (maxHit) {
        this.maxHit = maxHit;
    };
    AttackStyleSwitch.prototype.getAttackRoll = function () {
        return this.attackRoll;
    };
    AttackStyleSwitch.prototype.setAttackRoll = function (attackRoll) {
        this.attackRoll = attackRoll;
    };
    AttackStyleSwitch.prototype.getHitSpeed = function () {
        return this.hitSpeed;
    };
    AttackStyleSwitch.prototype.setHitSpeed = function (hitSpeed) {
        this.hitSpeed = hitSpeed;
    };
    return AttackStyleSwitch;
}());
exports.AttackStyleSwitch = AttackStyleSwitch;
//# sourceMappingURL=AttackStyleSwitch.js.map