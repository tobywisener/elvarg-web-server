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
exports.GraniteMaulCombatMethod = void 0;
var MeleeCombatMethod_1 = require("../MeleeCombatMethod");
var Animation_1 = require("../../../../../model/Animation");
var Graphic_1 = require("../../../../../model/Graphic");
var CombatSpecial_1 = require("../../../CombatSpecial");
var GraphicHeight_1 = require("../../../../../model/GraphicHeight");
var GraniteMaulCombatMethod = exports.GraniteMaulCombatMethod = /** @class */ (function (_super) {
    __extends(GraniteMaulCombatMethod, _super);
    function GraniteMaulCombatMethod() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GraniteMaulCombatMethod.prototype.start = function (character, target) {
        CombatSpecial_1.CombatSpecial.drain(character, CombatSpecial_1.CombatSpecial.GRANITE_MAUL.getDrainAmount());
        character.performAnimation(GraniteMaulCombatMethod.ANIMATION);
        character.performGraphic(GraniteMaulCombatMethod.GRAPHIC);
    };
    GraniteMaulCombatMethod.ANIMATION = new Animation_1.Animation(1667);
    GraniteMaulCombatMethod.GRAPHIC = new Graphic_1.Graphic(340, GraphicHeight_1.GraphicHeight.HIGH);
    return GraniteMaulCombatMethod;
}(MeleeCombatMethod_1.MeleeCombatMethod));
//# sourceMappingURL=GraniteMaulCombatMethod.js.map