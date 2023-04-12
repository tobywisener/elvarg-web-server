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
exports.DragonWarhammerCombatMethod = void 0;
var MeleeCombatMethod_1 = require("../MeleeCombatMethod");
var Animation_1 = require("../../../../../model/Animation");
var Graphic_1 = require("../../../../../model/Graphic");
var Priority_1 = require("../../../../../model/Priority");
var CombatSpecial_1 = require("../../../CombatSpecial");
var Skill_1 = require("../../../../../model/Skill");
var DragonWarhammerCombatMethod = exports.DragonWarhammerCombatMethod = /** @class */ (function (_super) {
    __extends(DragonWarhammerCombatMethod, _super);
    function DragonWarhammerCombatMethod() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DragonWarhammerCombatMethod.prototype.start = function (character, target) {
        CombatSpecial_1.CombatSpecial.drain(character, CombatSpecial_1.CombatSpecial.DRAGON_WARHAMMER.getDrainAmount());
        character.performAnimation(DragonWarhammerCombatMethod.ANIMATION);
        character.performGraphic(DragonWarhammerCombatMethod.GRAPHIC);
    };
    DragonWarhammerCombatMethod.prototype.handleAfterHitEffects = function (hit) {
        if (hit.isAccurate() && hit.getTarget().isPlayer()) {
            var damageDrain = Math.floor(hit.getTotalDamage() * 0.3);
            if (damageDrain < 0)
                return;
            var player = hit.getAttacker().getAsPlayer();
            var target = hit.getTarget().getAsPlayer();
            target.getSkillManager().decreaseCurrentLevel(Skill_1.Skill.DEFENCE, damageDrain, 1);
            player.getPacketSender().sendMessage("You've drained ".concat(target.getUsername(), "'s Defence level by ").concat(damageDrain, "."));
            target.getPacketSender().sendMessage("Your Defence level has been drained.");
        }
    };
    DragonWarhammerCombatMethod.ANIMATION = new Animation_1.Animation(1378);
    DragonWarhammerCombatMethod.GRAPHIC = new Graphic_1.Graphic(1292, Priority_1.Priority.HIGH);
    return DragonWarhammerCombatMethod;
}(MeleeCombatMethod_1.MeleeCombatMethod));
//# sourceMappingURL=DragonWarhammerCombatMethod.js.map