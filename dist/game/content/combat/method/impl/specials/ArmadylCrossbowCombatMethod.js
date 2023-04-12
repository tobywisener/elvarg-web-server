"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArmadylCrossbowCombatMethod = void 0;
var RangedCombatMethod_1 = require("../RangedCombatMethod");
var Animation_1 = require("../../../../../model/Animation");
var PendingHit_1 = require("../../../hit/PendingHit");
var CombatSpecial_1 = require("../../../CombatSpecial");
var RangedData_1 = require("../../../ranged/RangedData");
var CombatFactory_1 = require("../../../CombatFactory");
var Projectile_1 = require("../../../../../model/Projectile");
var ArmadylCrossbowCombatMethod = exports.ArmadylCrossbowCombatMethod = /** @class */ (function (_super) {
    __extends(ArmadylCrossbowCombatMethod, _super);
    function ArmadylCrossbowCombatMethod() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ArmadylCrossbowCombatMethod.prototype.hits = function (character, target) {
        return [new PendingHit_1.PendingHit(character, target, this, 2)];
    };
    ArmadylCrossbowCombatMethod.prototype.canAttack = function (character, target) {
        var player = character.getAsPlayer();
        if (player.getCombat().getRangedWeapon() != RangedData_1.RangedWeapon.ARMADYL_CROSSBOW) {
            return false;
        }
        if (!CombatFactory_1.CombatFactory.checkAmmo(player, 1)) {
            return false;
        }
        return true;
    };
    ArmadylCrossbowCombatMethod.prototype.start = function (character, target) {
        var player = character.getAsPlayer();
        CombatSpecial_1.CombatSpecial.drain(player, CombatSpecial_1.CombatSpecial.ARMADYL_CROSSBOW.getDrainAmount());
        player.performAnimation(ArmadylCrossbowCombatMethod.ANIMATION);
        Projectile_1.Projectile.createProjectile(character, target, 301, 50, 70, 44, 35).sendProjectile();
        CombatFactory_1.CombatFactory.decrementAmmo(player, target.getLocation(), 1);
    };
    ArmadylCrossbowCombatMethod.ANIMATION = new Animation_1.Animation(4230);
    return ArmadylCrossbowCombatMethod;
}(RangedCombatMethod_1.RangedCombatMethod));
//# sourceMappingURL=ArmadylCrossbowCombatMethod.js.map