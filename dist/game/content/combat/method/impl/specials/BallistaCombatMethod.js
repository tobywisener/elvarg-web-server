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
exports.BallistaCombatMethod = void 0;
var RangedCombatMethod_1 = require("../RangedCombatMethod");
var Animation_1 = require("../../../../../model/Animation");
var PendingHit_1 = require("../../../hit/PendingHit");
var CombatSpecial_1 = require("../../../CombatSpecial");
var RangedData_1 = require("../../../ranged/RangedData");
var CombatFactory_1 = require("../../../CombatFactory");
var Projectile_1 = require("../../../../../model/Projectile");
var BallistaCombatMethod = exports.BallistaCombatMethod = /** @class */ (function (_super) {
    __extends(BallistaCombatMethod, _super);
    function BallistaCombatMethod() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BallistaCombatMethod.prototype.hits = function (character, target) {
        return [new PendingHit_1.PendingHit(character, target, this, 2)];
    };
    BallistaCombatMethod.prototype.canAttack = function (character, target) {
        if (!character.isPlayer()) {
            return false;
        }
        var player = character.getAsPlayer();
        if (player.getCombat().getRangedWeapon() !== RangedData_1.RangedWeapon.BALLISTA) {
            return false;
        }
        if (!CombatFactory_1.CombatFactory.checkAmmo(player, 1)) {
            return false;
        }
        return true;
    };
    BallistaCombatMethod.prototype.start = function (character, target) {
        var player = character.getAsPlayer();
        CombatSpecial_1.CombatSpecial.drain(player, CombatSpecial_1.CombatSpecial.BALLISTA.getDrainAmount());
        character.performAnimation(BallistaCombatMethod.ANIMATION);
        Projectile_1.Projectile.createProjectile(player, target, 1301, 70, 30, 43, 31).sendProjectile();
        CombatFactory_1.CombatFactory.decrementAmmo(player, target.getLocation(), 1);
    };
    BallistaCombatMethod.ANIMATION = new Animation_1.Animation(7222);
    return BallistaCombatMethod;
}(RangedCombatMethod_1.RangedCombatMethod));
//# sourceMappingURL=BallistaCombatMethod.js.map