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
exports.CombatSpell = void 0;
var Spell_1 = require("./Spell");
var Animation_1 = require("../../../model/Animation");
var TaskManager_1 = require("../../../task/TaskManager");
var Task_1 = require("../../../task/Task");
var CombatSpells_1 = require("./CombatSpells");
var CombatAncientSpell_1 = require("./CombatAncientSpell");
var CombatSpellTask = /** @class */ (function (_super) {
    __extends(CombatSpellTask, _super);
    function CombatSpellTask(execFunction, cast) {
        var _this = _super.call(this, 2, false, null) || this;
        _this.execFunction = execFunction;
        return _this;
    }
    CombatSpellTask.prototype.execute = function () {
        this.execFunction();
        this.stop();
    };
    return CombatSpellTask;
}(Task_1.Task));
var CombatSpell = /** @class */ (function (_super) {
    __extends(CombatSpell, _super);
    function CombatSpell() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CombatSpell.prototype.startCast = function (cast, castOn) {
        var castAnimation = -1;
        var npc = cast.isNpc() ? cast : null;
        if (this.castAnimation() !== null && this.castAnimation() !== undefined && castAnimation == -1) {
            if (this.castAnimation() !== null) {
                (function (animation) { return animation.perform(cast); });
            }
        }
        else {
            cast.performAnimation(new Animation_1.Animation(castAnimation));
        }
        if (npc !== null) {
            if (npc.getId() !== 2000 &&
                npc.getId() !== 109 &&
                npc.getId() !== 3580 &&
                npc.getId() !== 2007) {
                if (this.startGraphic() != null) {
                    (function (graphic) { return graphic.perform(cast); });
                }
            }
        }
        else {
            if (this.startGraphic() != null) {
                (function (graphic) { return graphic.perform(cast); });
            }
        }
        var projectile = this.castProjectile(cast, castOn);
        if (projectile) {
            var g_1 = projectile;
            TaskManager_1.TaskManager.submit(new CombatSpellTask(function () {
                g_1.sendProjectile();
            }, cast));
        }
    };
    CombatSpell.prototype.getAttackSpeed = function () {
        var speed = 5;
        var spell = this;
        if (spell instanceof CombatAncientSpell_1.CombatAncientSpell) {
            if (spell == CombatSpells_1.CombatSpells.SMOKE_RUSH.getSpell() || spell == CombatSpells_1.CombatSpells.SHADOW_RUSH.getSpell()
                || spell == CombatSpells_1.CombatSpells.BLOOD_RUSH.getSpell() || spell == CombatSpells_1.CombatSpells.ICE_RUSH.getSpell()
                || spell == CombatSpells_1.CombatSpells.SMOKE_BLITZ.getSpell() || spell == CombatSpells_1.CombatSpells.SHADOW_BLITZ.getSpell()
                || spell == CombatSpells_1.CombatSpells.BLOOD_BLITZ.getSpell() || spell == CombatSpells_1.CombatSpells.ICE_BLITZ.getSpell()) {
                speed = 4;
            }
        }
        return speed;
    };
    CombatSpell.prototype.onHitCalc = function (hit) {
        if (!hit.isAccurate()) {
            return;
        }
        this.spellEffectOnHitCalc(hit.getAttacker(), hit.getTarget(), hit.getTotalDamage());
    };
    CombatSpell.prototype.spellEffectOnHitCalc = function (cast, castOn, damage) { };
    CombatSpell.prototype.impactSound = function () {
        return null;
    };
    return CombatSpell;
}(Spell_1.Spell));
exports.CombatSpell = CombatSpell;
//# sourceMappingURL=CombatSpell.js.map