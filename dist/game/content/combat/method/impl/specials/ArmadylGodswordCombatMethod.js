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
exports.ArmadylGodswordCombatMethod = void 0;
var MeleeCombatMethod_1 = require("../MeleeCombatMethod");
var Animation_1 = require("../../../../../model/Animation");
var Graphic_1 = require("../../../../../model/Graphic");
var Priority_1 = require("../../../../../model/Priority");
var CombatSpecial_1 = require("../../../CombatSpecial");
var ArmadylGodswordCombatMethod = exports.ArmadylGodswordCombatMethod = /** @class */ (function (_super) {
    __extends(ArmadylGodswordCombatMethod, _super);
    function ArmadylGodswordCombatMethod() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ArmadylGodswordCombatMethod.prototype.start = function (character, target) {
        CombatSpecial_1.CombatSpecial.drain(character, CombatSpecial_1.CombatSpecial.ARMADYL_GODSWORD.getDrainAmount());
        character.performAnimation(ArmadylGodswordCombatMethod.ANIMATION);
        character.performGraphic(ArmadylGodswordCombatMethod.GRAPHIC);
    };
    ArmadylGodswordCombatMethod.ANIMATION = new Animation_1.Animation(7644);
    ArmadylGodswordCombatMethod.GRAPHIC = new Graphic_1.Graphic(1211, Priority_1.Priority.HIGH);
    return ArmadylGodswordCombatMethod;
}(MeleeCombatMethod_1.MeleeCombatMethod));
//# sourceMappingURL=ArmadylGodswordCombatMethod.js.map