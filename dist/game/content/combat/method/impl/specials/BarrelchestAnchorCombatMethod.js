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
exports.BarrelchestAnchorCombatMethod = void 0;
var MeleeCombatMethod_1 = require("../MeleeCombatMethod");
var Animation_1 = require("../../../../../model/Animation");
var Graphic_1 = require("../../../../../model/Graphic");
var CombatSpecial_1 = require("../../../CombatSpecial");
var GraphicHeight_1 = require("../../../../../model/GraphicHeight");
var BarrelchestAnchorCombatMethod = exports.BarrelchestAnchorCombatMethod = /** @class */ (function (_super) {
    __extends(BarrelchestAnchorCombatMethod, _super);
    function BarrelchestAnchorCombatMethod() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BarrelchestAnchorCombatMethod.prototype.start = function (character, target) {
        CombatSpecial_1.CombatSpecial.drain(character, CombatSpecial_1.CombatSpecial.BARRELSCHEST_ANCHOR.getDrainAmount());
        character.performAnimation(BarrelchestAnchorCombatMethod.ANIMATION);
        character.performGraphic(BarrelchestAnchorCombatMethod.GRAPHIC);
    };
    BarrelchestAnchorCombatMethod.ANIMATION = new Animation_1.Animation(5870);
    BarrelchestAnchorCombatMethod.GRAPHIC = new Graphic_1.Graphic(1027, GraphicHeight_1.GraphicHeight.MIDDLE);
    return BarrelchestAnchorCombatMethod;
}(MeleeCombatMethod_1.MeleeCombatMethod));
//# sourceMappingURL=BarrelchestAnchorCombatMethod.js.map