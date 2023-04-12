"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CombatMethod = void 0;
var CombatMethod = /** @class */ (function () {
    function CombatMethod() {
    }
    CombatMethod.prototype.start = function (character, target) {
    };
    CombatMethod.prototype.finished = function (character, target) {
    };
    CombatMethod.prototype.onCombatBegan = function (character, target) {
    };
    CombatMethod.prototype.onCombatEnded = function (character, target) {
    };
    CombatMethod.prototype.handleAfterHitEffects = function (hit) {
    };
    CombatMethod.prototype.canAttack = function (character, target) {
        return true;
    };
    CombatMethod.prototype.attackSpeed = function (character) {
        return character.getBaseAttackSpeed();
    };
    CombatMethod.prototype.attackDistance = function (character) {
        return 1;
    };
    return CombatMethod;
}());
exports.CombatMethod = CombatMethod;
//# sourceMappingURL=CombatMethod.js.map