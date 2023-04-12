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
exports.RangedCombatMethod = void 0;
var CombatMethod_1 = require("../CombatMethod");
var CombatType_1 = require("../../CombatType");
var CombatFactory_1 = require("../../CombatFactory");
var PendingHit_1 = require("../../hit/PendingHit");
var RangedData_1 = require("../../ranged/RangedData");
var Animation_1 = require("../../../../model/Animation");
var Projectile_1 = require("../../../../model/Projectile");
var Sound_1 = require("../../../../Sound");
var Sounds_1 = require("../../../../Sounds");
var RangedCombatMethod = /** @class */ (function (_super) {
    __extends(RangedCombatMethod, _super);
    function RangedCombatMethod() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RangedCombatMethod.prototype.type = function () {
        return CombatType_1.CombatType.RANGED;
    };
    RangedCombatMethod.prototype.hits = function (character, target) {
        if (character.getCombat().getRangedWeapon() === RangedData_1.RangedWeapon.DARK_BOW) {
            return [new PendingHit_1.PendingHit(character, target, this, 1), new PendingHit_1.PendingHit(character, target, this, 2)];
        }
        if (character.getCombat().getRangedWeapon() === RangedData_1.RangedWeapon.BALLISTA) {
            return [new PendingHit_1.PendingHit(character, target, this, 2)];
        }
        return [new PendingHit_1.PendingHit(character, target, this, 1)];
    };
    RangedCombatMethod.prototype.canAttack = function (character, target) {
        if (character.isNpc()) {
            return true;
        }
        var p = character.getAsPlayer();
        var ammoRequired = 1;
        if (p.getCombat().getRangedWeapon() === RangedData_1.RangedWeapon.DARK_BOW) {
            ammoRequired = 2;
        }
        if (!CombatFactory_1.CombatFactory.checkAmmo(p, ammoRequired)) {
            return false;
        }
        return true;
    };
    RangedCombatMethod.prototype.start = function (character, target) {
        var ammo = character.getCombat().getAmmunition();
        var rangedWeapon = character.getCombat().getRangedWeapon();
        var animation = character.getAttackAnim();
        if (animation !== -1) {
            character.performAnimation(new Animation_1.Animation(animation));
        }
        if (ammo && ammo.getStartGraphic()) {
            // Check toxic blowpipe, it shouldn't have any start gfx.
            if (character.getCombat().getRangedWeapon()) {
                if (character.getCombat().getRangedWeapon() === RangedData_1.RangedWeapon.TOXIC_BLOWPIPE) {
                    return;
                }
            }
            // Perform start gfx for ammo
            character.performGraphic(ammo.getStartGraphic());
        }
        if (!ammo || !rangedWeapon) {
            return;
        }
        var projectileId = ammo.getProjectileId();
        var delay = 40;
        var speed = 57;
        var heightEnd = 31;
        var heightStart = 43;
        if (rangedWeapon.getType() === RangedData_1.RangedWeaponType.CROSSBOW) {
            delay = 46;
            speed = 62;
            heightStart = 44;
            heightEnd = 35;
        }
        else if (rangedWeapon.getType() === RangedData_1.RangedWeaponType.LONGBOW) {
            speed = 70;
        }
        else if (rangedWeapon.getType() === RangedData_1.RangedWeaponType.BLOWPIPE) {
            speed = 60;
            heightStart = 40;
            heightEnd = 35;
        }
        if (ammo === RangedData_1.Ammunition.TOKTZ_XIL_UL) {
            delay = 30;
            speed = 55;
        }
        // Fire projectile
        Projectile_1.Projectile.createProjectile(character, target, projectileId, delay, speed, heightStart, heightEnd).sendProjectile();
        // Send sound
        Sounds_1.Sounds.sendSound(character.getAsPlayer(), Sound_1.Sound.SHOOT_ARROW);
        // Dark bow sends two arrows, so send another projectile and delete another
        // arrow.
        if (rangedWeapon === RangedData_1.RangedWeapon.DARK_BOW) {
            Projectile_1.Projectile.createProjectile(character, target, ammo.getProjectileId(), delay - 7, speed + 4, heightStart + 5, heightEnd).sendProjectile();
            // Decrement 2 ammo if d bow
            if (character.isPlayer()) {
                CombatFactory_1.CombatFactory.decrementAmmo(character.getAsPlayer(), target.getLocation(), 2);
            }
        }
        else {
            // Decrement 1 ammo
            if (character.isPlayer()) {
                CombatFactory_1.CombatFactory.decrementAmmo(character.getAsPlayer(), target.getLocation(), 1);
            }
        }
    };
    RangedCombatMethod.prototype.attackDistance = function (character) {
        var bow = character.getCombat().getRangedWeapon();
        if (bow) {
            if (character.isNpc() || (character.isPlayer() && character.getAsPlayer().getFightType() === bow.getType().getLongRangeFightType())) {
                return bow.getType().getLongRangeDistance();
            }
            return bow.getType().getDefaultDistance();
        }
        return 6;
    };
    return RangedCombatMethod;
}(CombatMethod_1.CombatMethod));
exports.RangedCombatMethod = RangedCombatMethod;
//# sourceMappingURL=RangedCombatMethod.js.map