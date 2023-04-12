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
exports.MagicShortbowCombatMethod = void 0;
var RangedCombatMethod_1 = require("../RangedCombatMethod");
var Animation_1 = require("../../../../../model/Animation");
var PendingHit_1 = require("../../../hit/PendingHit");
var CombatSpecial_1 = require("../../../CombatSpecial");
var RangedData_1 = require("../../../ranged/RangedData");
var CombatFactory_1 = require("../../../CombatFactory");
var Projectile_1 = require("../../../../../model/Projectile");
var Graphic_1 = require("../../../../../model/Graphic");
var GraphicHeight_1 = require("../../../../../model/GraphicHeight");
var MagicShortbowCombatMethod = exports.MagicShortbowCombatMethod = /** @class */ (function (_super) {
    __extends(MagicShortbowCombatMethod, _super);
    function MagicShortbowCombatMethod() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MagicShortbowCombatMethod.prototype.hits = function (character, target) {
        return [new PendingHit_1.PendingHit(character, target, this, 3), new PendingHit_1.PendingHit(character, target, this, 2)];
    };
    MagicShortbowCombatMethod.prototype.canAttack = function (character, target) {
        var player = character.getAsPlayer();
        if (player.getCombat().getRangedWeapon() != RangedData_1.RangedWeapon.MAGIC_SHORTBOW) {
            return false;
        }
        if (!CombatFactory_1.CombatFactory.checkAmmo(player, 2)) {
            return false;
        }
        return true;
    };
    MagicShortbowCombatMethod.prototype.start = function (character, target) {
        var player = character.getAsPlayer();
        CombatSpecial_1.CombatSpecial.drain(player, CombatSpecial_1.CombatSpecial.MAGIC_SHORTBOW.getDrainAmount());
        player.performAnimation(MagicShortbowCombatMethod.ANIMATION);
        player.performGraphic(MagicShortbowCombatMethod.GRAPHIC);
        Projectile_1.Projectile.createProjectile(player, target, 249, 40, 57, 43, 31).sendProjectile();
        Projectile_1.Projectile.createProjectile(character, target, 249, 33, 57, 48, 31).sendProjectile();
        CombatFactory_1.CombatFactory.decrementAmmo(player, target.getLocation(), 2);
    };
    MagicShortbowCombatMethod.prototype.attackSpeed = function (character) {
        return _super.prototype.attackSpeed.call(this, character) + 1;
    };
    MagicShortbowCombatMethod.ANIMATION = new Animation_1.Animation(1074);
    MagicShortbowCombatMethod.GRAPHIC = new Graphic_1.Graphic(250, GraphicHeight_1.GraphicHeight.HIGH);
    return MagicShortbowCombatMethod;
}(RangedCombatMethod_1.RangedCombatMethod));
//# sourceMappingURL=MagicShortbowCombatMethod.js.map