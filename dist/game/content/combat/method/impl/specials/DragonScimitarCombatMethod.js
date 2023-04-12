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
exports.DragonScimitarCombatMethod = void 0;
var MeleeCombatMethod_1 = require("../MeleeCombatMethod");
var Animation_1 = require("../../../../../model/Animation");
var Graphic_1 = require("../../../../../model/Graphic");
var GraphicHeight_1 = require("../../../../../model/GraphicHeight");
var CombatSpecial_1 = require("../../../CombatSpecial");
var CombatFactory_1 = require("../../../CombatFactory");
var DragonScimitarCombatMethod = exports.DragonScimitarCombatMethod = /** @class */ (function (_super) {
    __extends(DragonScimitarCombatMethod, _super);
    function DragonScimitarCombatMethod() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DragonScimitarCombatMethod.prototype.start = function (character, target) {
        CombatSpecial_1.CombatSpecial.drain(character, CombatSpecial_1.CombatSpecial.DRAGON_SCIMITAR.getDrainAmount());
        character.performAnimation(DragonScimitarCombatMethod.ANIMATION);
        character.performGraphic(DragonScimitarCombatMethod.GRAPHIC);
    };
    DragonScimitarCombatMethod.prototype.handleAfterHitEffects = function (hit) {
        if (!hit.isAccurate() || !hit.getTarget().isPlayer()) {
            return;
        }
        CombatFactory_1.CombatFactory.disableProtectionPrayers(hit.getTarget().getAsPlayer());
        hit.getAttacker().getAsPlayer().getPacketSender().sendMessage("Your target can no longer use protection prayers.");
    };
    DragonScimitarCombatMethod.ANIMATION = new Animation_1.Animation(1872);
    DragonScimitarCombatMethod.GRAPHIC = new Graphic_1.Graphic(347, GraphicHeight_1.GraphicHeight.HIGH);
    return DragonScimitarCombatMethod;
}(MeleeCombatMethod_1.MeleeCombatMethod));
//# sourceMappingURL=DragonScimitarCombatMethod.js.map