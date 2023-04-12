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
exports.BandosGodswordCombatMethod = void 0;
var MeleeCombatMethod_1 = require("../MeleeCombatMethod");
var Animation_1 = require("../../../../../model/Animation");
var Graphic_1 = require("../../../../../model/Graphic");
var Priority_1 = require("../../../../../model/Priority");
var CombatSpecial_1 = require("../../../CombatSpecial");
var Skill_1 = require("../../../../../model/Skill");
var Misc_1 = require("../../../../../../util/Misc");
var BandosGodswordCombatMethod = exports.BandosGodswordCombatMethod = /** @class */ (function (_super) {
    __extends(BandosGodswordCombatMethod, _super);
    function BandosGodswordCombatMethod() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BandosGodswordCombatMethod.prototype.start = function (character, target) {
        CombatSpecial_1.CombatSpecial.drain(character, CombatSpecial_1.CombatSpecial.BANDOS_GODSWORD.getDrainAmount());
        character.performAnimation(BandosGodswordCombatMethod.ANIMATION);
        character.performGraphic(BandosGodswordCombatMethod.GRAPHIC);
    };
    BandosGodswordCombatMethod.prototype.handleAfterHitEffects = function (hit) {
        if (hit.isAccurate() && hit.getTarget().isPlayer()) {
            var skillDrain = 1;
            var damageDrain = (hit.getTotalDamage() * 0.1);
            if (damageDrain < 0)
                return;
            var player = hit.getAttacker().getAsPlayer();
            var target = hit.getTarget().getAsPlayer();
            var skill = Object.values(Skill_1.Skill)[skillDrain];
            target.getSkillManager().setCurrentLevels(skill, player.getSkillManager().getCurrentLevel(skill) - damageDrain);
            if (target.getSkillManager().getCurrentLevel(skill) < 1)
                target.getSkillManager().setCurrentLevels(skill, 1);
            player.getPacketSender().sendMessage("You've drained " + target.getUsername() + "'s " + Misc_1.Misc.formatText(Object.values(Skill_1.Skill)[skillDrain].toString().toLowerCase()) + " level by " + damageDrain + ".");
            target.getPacketSender().sendMessage("Your " + skill.getName() + " level has been drained.");
        }
    };
    BandosGodswordCombatMethod.ANIMATION = new Animation_1.Animation(7642);
    BandosGodswordCombatMethod.GRAPHIC = new Graphic_1.Graphic(1212, Priority_1.Priority.HIGH);
    return BandosGodswordCombatMethod;
}(MeleeCombatMethod_1.MeleeCombatMethod));
//# sourceMappingURL=BandosGodswordCombatMethod.js.map