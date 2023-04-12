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
exports.VenenatisCombatMethod = void 0;
var CombatMethod_1 = require("../../CombatMethod");
var Animation_1 = require("../../../../../model/Animation");
var Graphic_1 = require("../../../../../model/Graphic");
var GraphicHeight_1 = require("../../../../../model/GraphicHeight");
var CombatType_1 = require("../../../CombatType");
var PendingHit_1 = require("../../../hit/PendingHit");
var Projectile_1 = require("../../../../../model/Projectile");
var Misc_1 = require("../../../../../../util/Misc");
var Skill_1 = require("../../../../../model/Skill");
var VenenatisCombatMethod = exports.VenenatisCombatMethod = /** @class */ (function (_super) {
    __extends(VenenatisCombatMethod, _super);
    function VenenatisCombatMethod() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.currentAttackType = CombatType_1.CombatType.MELEE;
        return _this;
    }
    VenenatisCombatMethod.prototype.type = function () {
        return this.currentAttackType;
    };
    VenenatisCombatMethod.prototype.hits = function (character, target) {
        return [new PendingHit_1.PendingHit(character, target, this, 1)];
    };
    VenenatisCombatMethod.prototype.start = function (character, target) {
        if (this.currentAttackType === CombatType_1.CombatType.MAGIC) {
            character.performAnimation(VenenatisCombatMethod.MAGIC_ATTACK_ANIMATION);
            Projectile_1.Projectile.createProjectile(character, target, 165, 40, 55, 31, 43).sendProjectile();
        }
        else if (this.currentAttackType === CombatType_1.CombatType.MELEE) {
            character.performAnimation(VenenatisCombatMethod.MELEE_ATTACK_ANIMATION);
        }
    };
    VenenatisCombatMethod.prototype.attackDistance = function (character) {
        return 4;
    };
    VenenatisCombatMethod.prototype.finished = function (character, target) {
        // Switch attack type after each attack
        if (this.currentAttackType === CombatType_1.CombatType.MAGIC) {
            this.currentAttackType = CombatType_1.CombatType.MELEE;
        }
        else {
            this.currentAttackType = CombatType_1.CombatType.MAGIC;
            // Have a chance of comboing with magic by reseting combat delay.
            if (Misc_1.Misc.getRandom(10) <= 3) {
                character.getCombat().performNewAttack(true);
            }
        }
    };
    VenenatisCombatMethod.prototype.handleAfterHitEffects = function (hit) {
        if (!hit.isAccurate() || hit.getTarget() == null || !hit.getTarget().isPlayer()) {
            return;
        }
        // Drain prayer randomly 15% chance
        if (Misc_1.Misc.getRandom(100) <= 15) {
            var player = hit.getTarget().getAsPlayer();
            hit.getTarget().performGraphic(VenenatisCombatMethod.DRAIN_PRAYER_GRAPHIC);
            player.getSkillManager().decreaseCurrentLevel(Skill_1.Skill.PRAYER, (hit.getTotalDamage() * 0.35), 0);
            player.getPacketSender().sendMessage("Venenatis drained your prayer!");
        }
    };
    VenenatisCombatMethod.MELEE_ATTACK_ANIMATION = new Animation_1.Animation(5319);
    VenenatisCombatMethod.MAGIC_ATTACK_ANIMATION = new Animation_1.Animation(5322);
    VenenatisCombatMethod.DRAIN_PRAYER_GRAPHIC = new Graphic_1.Graphic(172, GraphicHeight_1.GraphicHeight.MIDDLE);
    return VenenatisCombatMethod;
}(CombatMethod_1.CombatMethod));
//# sourceMappingURL=VenenatisCombatMethod.js.map