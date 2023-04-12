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
exports.ZamorakGodswordCombatMethod = void 0;
var MeleeCombatMethod_1 = require("../MeleeCombatMethod");
var Animation_1 = require("../../../../../model/Animation");
var Graphic_1 = require("../../../../../model/Graphic");
var Priority_1 = require("../../../../../model/Priority");
var CombatSpecial_1 = require("../../../CombatSpecial");
var CombatFactory_1 = require("../../../CombatFactory");
var ZamorakGodswordCombatMethod = exports.ZamorakGodswordCombatMethod = /** @class */ (function (_super) {
    __extends(ZamorakGodswordCombatMethod, _super);
    function ZamorakGodswordCombatMethod() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ZamorakGodswordCombatMethod.prototype.start = function (character, target) {
        CombatSpecial_1.CombatSpecial.drain(character, CombatSpecial_1.CombatSpecial.ZAMORAK_GODSWORD.getDrainAmount());
        character.performAnimation(ZamorakGodswordCombatMethod.ANIMATION);
    };
    ZamorakGodswordCombatMethod.prototype.handleAfterHitEffects = function (hit) {
        if (hit.isAccurate()) {
            hit.getTarget().performGraphic(ZamorakGodswordCombatMethod.GRAPHIC);
            CombatFactory_1.CombatFactory.freeze(hit.getTarget(), 15);
        }
    };
    ZamorakGodswordCombatMethod.ANIMATION = new Animation_1.Animation(7638);
    ZamorakGodswordCombatMethod.GRAPHIC = new Graphic_1.Graphic(1210, Priority_1.Priority.HIGH);
    return ZamorakGodswordCombatMethod;
}(MeleeCombatMethod_1.MeleeCombatMethod));
//# sourceMappingURL=ZamorakGodswordCombatMethod.js.map