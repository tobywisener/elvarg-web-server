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
exports.JadCombatMethod = void 0;
var CombatMethod_1 = require("../../CombatMethod");
var Graphic_1 = require("../../../../../model/Graphic");
var Projectile_1 = require("../../../../../model/Projectile");
var CombatType_1 = require("../../../CombatType");
var PendingHit_1 = require("../../../hit/PendingHit");
var Animation_1 = require("../../../../../model/Animation");
var Priority_1 = require("../../../../../model/Priority");
var Misc_1 = require("../../../../../../util/Misc");
var JadCombatMethod = exports.JadCombatMethod = /** @class */ (function (_super) {
    __extends(JadCombatMethod, _super);
    function JadCombatMethod() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    JadCombatMethod.prototype.start = function (character, target) {
        this.combatType = Misc_1.Misc.getRandom(1) == 0 ? CombatType_1.CombatType.RANGED : CombatType_1.CombatType.MAGIC;
        if (character.calculateDistance(target) <= 1 && Misc_1.Misc.getRandom(1) == 0) {
            this.combatType = CombatType_1.CombatType.MELEE;
        }
        switch (this.combatType) {
            case CombatType_1.CombatType.MELEE:
                character.performAnimation(JadCombatMethod.MELEE_ATTACK_ANIM);
                break;
            case CombatType_1.CombatType.RANGED:
                character.performAnimation(JadCombatMethod.RANGED_ATTACK_ANIM);
                target.delayedGraphic(JadCombatMethod.RANGED_ATTACK_GRAPHIC, 2);
                break;
            case CombatType_1.CombatType.MAGIC:
                character.performAnimation(JadCombatMethod.MAGIC_ATTACK_ANIM);
                var projectile2 = Projectile_1.Projectile.createProjectile(character, target, 395, 25, 100, 110, 33);
                projectile2.sendProjectile();
                break;
            default:
                break;
        }
    };
    JadCombatMethod.prototype.hits = function (character, target) {
        var hitDelay = (this.combatType == CombatType_1.CombatType.MELEE ? 1 : 3);
        return [new PendingHit_1.PendingHit(character, target, this, hitDelay)];
    };
    JadCombatMethod.prototype.attackDistance = function (character) {
        return 10;
    };
    JadCombatMethod.prototype.type = function () {
        return this.combatType;
    };
    JadCombatMethod.MAGIC_ATTACK_ANIM = new Animation_1.Animation(2656);
    JadCombatMethod.RANGED_ATTACK_ANIM = new Animation_1.Animation(2652);
    JadCombatMethod.MELEE_ATTACK_ANIM = new Animation_1.Animation(2655);
    JadCombatMethod.MAGIC_ATTACK_PROJECTILE = 448;
    JadCombatMethod.RANGED_ATTACK_GRAPHIC = new Graphic_1.Graphic(451, Priority_1.Priority.MEDIUM);
    return JadCombatMethod;
}(CombatMethod_1.CombatMethod));
//# sourceMappingURL=JadCombatMethod.js.map