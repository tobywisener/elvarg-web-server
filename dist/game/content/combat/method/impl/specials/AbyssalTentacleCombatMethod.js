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
exports.AbyssalTentacleCombatMethod = void 0;
var MeleeCombatMethod_1 = require("../MeleeCombatMethod");
var Animation_1 = require("../../../../../model/Animation");
var Graphic_1 = require("../../../../../model/Graphic");
var CombatSpecial_1 = require("../../../CombatSpecial");
var GraphicHeight_1 = require("../../../../../model/GraphicHeight");
var CombatFactory_1 = require("../../../CombatFactory");
var Misc_1 = require("../../../../../../util/Misc");
var CombatPoisonEffect_1 = require("../../../../../task/impl/CombatPoisonEffect");
var AbyssalTentacleCombatMethod = exports.AbyssalTentacleCombatMethod = /** @class */ (function (_super) {
    __extends(AbyssalTentacleCombatMethod, _super);
    function AbyssalTentacleCombatMethod() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AbyssalTentacleCombatMethod.prototype.start = function (character, target) {
        CombatSpecial_1.CombatSpecial.drain(character, CombatSpecial_1.CombatSpecial.ABYSSAL_TENTACLE.getDrainAmount());
        character.performAnimation(AbyssalTentacleCombatMethod.ANIMATION);
    };
    AbyssalTentacleCombatMethod.prototype.handleAfterHitEffects = function (hit) {
        var target = hit.getTarget();
        if (target.getHitpoints() <= 0) {
            return;
        }
        target.performGraphic(AbyssalTentacleCombatMethod.GRAPHIC);
        CombatFactory_1.CombatFactory.freeze(target, 10);
        if (Misc_1.Misc.getRandom(100) < 50) {
            CombatFactory_1.CombatFactory.poisonEntity(target, CombatPoisonEffect_1.PoisonType.EXTRA);
        }
    };
    AbyssalTentacleCombatMethod.ANIMATION = new Animation_1.Animation(1658);
    AbyssalTentacleCombatMethod.GRAPHIC = new Graphic_1.Graphic(181, GraphicHeight_1.GraphicHeight.HIGH);
    return AbyssalTentacleCombatMethod;
}(MeleeCombatMethod_1.MeleeCombatMethod));
//# sourceMappingURL=AbyssalTentacleCombatMethod.js.map