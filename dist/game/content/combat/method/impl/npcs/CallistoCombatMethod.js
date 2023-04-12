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
exports.CallistoCombatMethod = void 0;
var CombatMethod_1 = require("../../CombatMethod");
var Animation_1 = require("../../../../../model/Animation");
var Graphic_1 = require("../../../../../model/Graphic");
var GraphicHeight_1 = require("../../../../../model/GraphicHeight");
var SecondsTimer_1 = require("../../../../../model/SecondsTimer");
var CombatType_1 = require("../../../CombatType");
var PendingHit_1 = require("../../../hit/PendingHit");
var Projectile_1 = require("../../../../../model/Projectile");
var Misc_1 = require("../../../../../../util/Misc");
var TimerKey_1 = require("../../../../../../util/timers/TimerKey");
var CombatFactory_1 = require("../../../CombatFactory");
var Location_1 = require("../../../../../model/Location");
var TaskManager_1 = require("../../../../../task/TaskManager");
var ForceMovementTask_1 = require("../../../../../task/impl/ForceMovementTask");
var ForceMovement_1 = require("../../../../../model/ForceMovement");
var CallistoCombatMethod = exports.CallistoCombatMethod = /** @class */ (function (_super) {
    __extends(CallistoCombatMethod, _super);
    function CallistoCombatMethod() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.comboTimer = new SecondsTimer_1.SecondsTimer();
        _this.currentAttackType = CombatType_1.CombatType.MELEE;
        return _this;
    }
    CallistoCombatMethod.prototype.type = function () {
        return this.currentAttackType;
    };
    CallistoCombatMethod.prototype.hits = function (character, target) {
        return [new PendingHit_1.PendingHit(character, target, this, 2)];
    };
    CallistoCombatMethod.prototype.start = function (character, target) {
        character.performAnimation(CallistoCombatMethod.MELEE_ATTACK_ANIMATION);
        if (this.currentAttackType === CombatType_1.CombatType.MAGIC) {
            var projectile2 = Projectile_1.Projectile.createProjectile(character, target, 395, 40, 60, 31, 43);
            projectile2.sendProjectile();
        }
    };
    CallistoCombatMethod.prototype.attackDistance = function (character) {
        return 4;
    };
    CallistoCombatMethod.prototype.finished = function (character, target) {
        this.currentAttackType = CombatType_1.CombatType.MELEE;
        if (this.comboTimer.finished()) {
            if (Misc_1.Misc.getRandom(10) <= 2) {
                this.comboTimer.start(5);
                this.currentAttackType = CombatType_1.CombatType.MAGIC;
                character.getCombat().performNewAttack(true);
            }
        }
    };
    CallistoCombatMethod.prototype.handleAfterHitEffects = function (hit) {
        if (!hit.getTarget() || !hit.getTarget().isPlayer()) {
            return;
        }
        var player = hit.getTarget().getAsPlayer();
        if (this.currentAttackType == CombatType_1.CombatType.MAGIC) {
            player.performGraphic(CallistoCombatMethod.END_PROJECTILE_GRAPHIC);
        }
        if (!player.getTimers().has(TimerKey_1.TimerKey.STUN) && Misc_1.Misc.getRandom(100) <= 10) {
            player.performAnimation(new Animation_1.Animation(3131));
            var toKnock = new Location_1.Location(player.getLocation().getX() > 3325 ? -3 : 1 + Misc_1.Misc.getRandom(2), player.getLocation().getY() > 3834 && player.getLocation().getY() < 3843 ? 3 : -3);
            TaskManager_1.TaskManager.submit(new ForceMovementTask_1.ForceMovementTask(player, 3, new ForceMovement_1.ForceMovement(player.getLocation().clone(), toKnock, 0, 15, 0, 0)));
            CombatFactory_1.CombatFactory.stun(player, 4, false);
        }
    };
    CallistoCombatMethod.MELEE_ATTACK_ANIMATION = new Animation_1.Animation(4925);
    CallistoCombatMethod.END_PROJECTILE_GRAPHIC = new Graphic_1.Graphic(359, GraphicHeight_1.GraphicHeight.HIGH);
    return CallistoCombatMethod;
}(CombatMethod_1.CombatMethod));
//# sourceMappingURL=CallistoCombatMethod.js.map