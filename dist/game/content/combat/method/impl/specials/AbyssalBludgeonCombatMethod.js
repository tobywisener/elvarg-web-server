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
exports.AbyssalBludgeonCombatMethod = void 0;
var MeleeCombatMethod_1 = require("../MeleeCombatMethod");
var Animation_1 = require("../../../../../model/Animation");
var Priority_1 = require("../../../../../model/Priority");
var Graphic_1 = require("../../../../../model/Graphic");
var Skill_1 = require("../../../../../model/Skill");
var PendingHit_1 = require("../../../hit/PendingHit");
var CombatSpecial_1 = require("../../../CombatSpecial");
var AbyssalBludgeonCombatMethod = exports.AbyssalBludgeonCombatMethod = /** @class */ (function (_super) {
    __extends(AbyssalBludgeonCombatMethod, _super);
    function AbyssalBludgeonCombatMethod() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AbyssalBludgeonCombatMethod.prototype.hits = function (character, target) {
        var hit = new PendingHit_1.PendingHit(character, target, this);
        if (character.isPlayer()) {
            var player = character.getAsPlayer();
            var missingPrayer = player.getSkillManager().getMaxLevel(Skill_1.Skill.PRAYER) - player.getSkillManager().getCurrentLevel(Skill_1.Skill.PRAYER);
            var extraDamage = missingPrayer * 0.5;
            hit.getHits()[0].incrementDamage(extraDamage);
            hit.updateTotalDamage();
        }
        return [hit];
    };
    AbyssalBludgeonCombatMethod.prototype.start = function (character, target) {
        CombatSpecial_1.CombatSpecial.drain(character, CombatSpecial_1.CombatSpecial.ABYSSAL_DAGGER.getDrainAmount());
        character.performAnimation(AbyssalBludgeonCombatMethod.ANIMATION);
    };
    AbyssalBludgeonCombatMethod.prototype.handleAfterHitEffects = function (hit) {
        hit.getTarget().performGraphic(AbyssalBludgeonCombatMethod.GRAPHIC);
    };
    AbyssalBludgeonCombatMethod.ANIMATION = new Animation_1.Animation(3299);
    AbyssalBludgeonCombatMethod.GRAPHIC = new Graphic_1.Graphic(1284, Priority_1.Priority.HIGH);
    return AbyssalBludgeonCombatMethod;
}(MeleeCombatMethod_1.MeleeCombatMethod));
//# sourceMappingURL=AbyssalBludgeonCombatMethod.js.map