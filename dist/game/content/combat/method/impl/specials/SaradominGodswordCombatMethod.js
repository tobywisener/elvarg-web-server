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
exports.SaradominGodswordCombatMethod = void 0;
var MeleeCombatMethod_1 = require("../MeleeCombatMethod");
var Animation_1 = require("../../../../../model/Animation");
var Graphic_1 = require("../../../../../model/Graphic");
var Priority_1 = require("../../../../../model/Priority");
var CombatSpecial_1 = require("../../../CombatSpecial");
var Skill_1 = require("../../../../../model/Skill");
var SaradominGodswordCombatMethod = exports.SaradominGodswordCombatMethod = /** @class */ (function (_super) {
    __extends(SaradominGodswordCombatMethod, _super);
    function SaradominGodswordCombatMethod() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SaradominGodswordCombatMethod.prototype.start = function (character, target) {
        CombatSpecial_1.CombatSpecial.drain(character, CombatSpecial_1.CombatSpecial.SARADOMIN_GODSWORD.getDrainAmount());
        character.performAnimation(SaradominGodswordCombatMethod.ANIMATION);
        character.performGraphic(SaradominGodswordCombatMethod.GRAPHIC);
    };
    SaradominGodswordCombatMethod.prototype.handleAfterHitEffects = function (hit) {
        var player = hit.getAttacker().getAsPlayer();
        var damage = hit.getTotalDamage();
        var damageHeal = Math.floor(damage * 0.5);
        var damagePrayerHeal = Math.floor(damage * 0.25);
        if (player.getSkillManager().getCurrentLevel(Skill_1.Skill.HITPOINTS) < player.getSkillManager().getMaxLevel(Skill_1.Skill.HITPOINTS)) {
            var level = player.getSkillManager().getCurrentLevel(Skill_1.Skill.HITPOINTS) + damageHeal > player.getSkillManager().getMaxLevel(Skill_1.Skill.HITPOINTS)
                ? player.getSkillManager().getMaxLevel(Skill_1.Skill.HITPOINTS)
                : player.getSkillManager().getCurrentLevel(Skill_1.Skill.HITPOINTS) + damageHeal;
            player.getSkillManager().setCurrentLevels(Skill_1.Skill.HITPOINTS, level);
        }
        if (player.getSkillManager().getCurrentLevel(Skill_1.Skill.PRAYER) < player.getSkillManager().getMaxLevel(Skill_1.Skill.PRAYER)) {
            var level = player.getSkillManager().getCurrentLevel(Skill_1.Skill.PRAYER) + damagePrayerHeal > player.getSkillManager().getMaxLevel(Skill_1.Skill.PRAYER) ? player.getSkillManager().getMaxLevel(Skill_1.Skill.PRAYER)
                : player.getSkillManager().getCurrentLevel(Skill_1.Skill.PRAYER) + damagePrayerHeal;
            player.getSkillManager().setCurrentLevels(Skill_1.Skill.PRAYER, level);
        }
    };
    SaradominGodswordCombatMethod.ANIMATION = new Animation_1.Animation(7640);
    SaradominGodswordCombatMethod.GRAPHIC = new Graphic_1.Graphic(1209, Priority_1.Priority.HIGH);
    return SaradominGodswordCombatMethod;
}(MeleeCombatMethod_1.MeleeCombatMethod));
//# sourceMappingURL=SaradominGodswordCombatMethod.js.map