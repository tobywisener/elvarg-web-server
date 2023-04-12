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
exports.VetionCombatMethod = void 0;
var Animation_1 = require("../../../../../model/Animation");
var Graphic_1 = require("../../../../../model/Graphic");
var CombatType_1 = require("../../../CombatType");
var PendingHit_1 = require("../../../hit/PendingHit");
var Projectile_1 = require("../../../../../model/Projectile");
var Misc_1 = require("../../../../../../util/Misc");
var TaskManager_1 = require("../../../../../task/TaskManager");
var HitMask_1 = require("../../../hit/HitMask");
var TimerKey_1 = require("../../../../../../util/timers/TimerKey");
var Task_1 = require("../../../../../task/Task");
var HitDamage_1 = require("../../../hit/HitDamage");
var Location_1 = require("../../../../../model/Location");
var VetionCombatMethodTask = /** @class */ (function (_super) {
    __extends(VetionCombatMethodTask, _super);
    function VetionCombatMethodTask(execFunction) {
        var _this = _super.call(this, 4, true) || this;
        _this.execFunction = execFunction;
        return _this;
    }
    VetionCombatMethodTask.prototype.execute = function () {
        this.execFunction();
    };
    return VetionCombatMethodTask;
}(Task_1.Task));
var VetionCombatMethod = exports.VetionCombatMethod = /** @class */ (function () {
    function VetionCombatMethod() {
        this.attack = CombatType_1.CombatType.MELEE;
    }
    VetionCombatMethod.prototype.onCombatBegan = function (character, target) {
    };
    VetionCombatMethod.prototype.onCombatEnded = function (character, target) {
    };
    VetionCombatMethod.prototype.handleAfterHitEffects = function (hit) {
    };
    VetionCombatMethod.prototype.attackSpeed = function (character) {
        return character.getBaseAttackSpeed();
    };
    VetionCombatMethod.prototype.canAttack = function (character, target) {
        return true;
    };
    VetionCombatMethod.prototype.hits = function (character, target) {
        if (this.attack === CombatType_1.CombatType.MAGIC) {
            return null;
        }
        return [new PendingHit_1.PendingHit(character, target, this, 2)];
    };
    VetionCombatMethod.prototype.start = function (character, target) {
        var e_1, _a;
        var _this = this;
        if (!character.isNpc() || !target.isPlayer()) {
            return;
        }
        character.performAnimation(new Animation_1.Animation(character.getAttackAnim()));
        if (target.getLocation().getDistance(character.getLocation()) < 2 && Misc_1.Misc.getRandom(1) === 0) {
            this.attack = CombatType_1.CombatType.MELEE;
        }
        else {
            this.attack = CombatType_1.CombatType.MAGIC;
        }
        if (this.attack === CombatType_1.CombatType.MAGIC) {
            var targetPos = target.getLocation();
            var attackPositions_2 = [];
            attackPositions_2.push(targetPos);
            for (var i = 0; i < 2; i++) {
                attackPositions_2.push(new Location_1.Location((targetPos.getX() - 1) + Misc_1.Misc.getRandom(3), (targetPos.getY() - 1) + Misc_1.Misc.getRandom(3)));
            }
            try {
                for (var attackPositions_1 = __values(attackPositions_2), attackPositions_1_1 = attackPositions_1.next(); !attackPositions_1_1.done; attackPositions_1_1 = attackPositions_1.next()) {
                    var pos = attackPositions_1_1.value;
                    new Projectile_1.Projectile(character.getLocation(), pos, null, 280, 40, 80, 31, 43, character.getPrivateArea()).sendProjectile();
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (attackPositions_1_1 && !attackPositions_1_1.done && (_a = attackPositions_1.return)) _a.call(attackPositions_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            TaskManager_1.TaskManager.submit(new VetionCombatMethodTask(function () {
                var e_2, _a, e_3, _b;
                try {
                    for (var attackPositions_3 = __values(attackPositions_2), attackPositions_3_1 = attackPositions_3.next(); !attackPositions_3_1.done; attackPositions_3_1 = attackPositions_3.next()) {
                        var pos = attackPositions_3_1.value;
                        target.getAsPlayer().getPacketSender().sendGlobalGraphic(VetionCombatMethod.MAGIC_END_GFX, pos);
                        try {
                            for (var _c = (e_3 = void 0, __values(character.getAsNpc().getPlayersWithinDistance(10))), _d = _c.next(); !_d.done; _d = _c.next()) {
                                var player = _d.value;
                                if (player.getLocation().equals(pos)) {
                                    player.getCombat().getHitQueue()
                                        .addPendingDamage([new HitDamage_1.HitDamage(Misc_1.Misc.getRandom(25), HitMask_1.HitMask.RED)]);
                                }
                            }
                        }
                        catch (e_3_1) { e_3 = { error: e_3_1 }; }
                        finally {
                            try {
                                if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
                            }
                            finally { if (e_3) throw e_3.error; }
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (attackPositions_3_1 && !attackPositions_3_1.done && (_a = attackPositions_3.return)) _a.call(attackPositions_3);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                _this.finished(character, target);
            }));
            character.getTimers().registers(TimerKey_1.TimerKey.COMBAT_ATTACK, 5);
        }
    };
    VetionCombatMethod.prototype.attackDistance = function (character) {
        if (this.attack === CombatType_1.CombatType.MELEE) {
            return 2;
        }
        return 8;
    };
    VetionCombatMethod.prototype.type = function () {
        return this.attack;
    };
    VetionCombatMethod.prototype.finished = function (character, target) {
    };
    VetionCombatMethod.MAGIC_END_GFX = new Graphic_1.Graphic(281);
    return VetionCombatMethod;
}());
//# sourceMappingURL=VetionCombatMethod.js.map