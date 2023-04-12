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
exports.DragonLongswordCombatMethod = void 0;
var MeleeCombatMethod_1 = require("../MeleeCombatMethod");
var Animation_1 = require("../../../../../model/Animation");
var Graphic_1 = require("../../../../../model/Graphic");
var GraphicHeight_1 = require("../../../../../model/GraphicHeight");
var CombatSpecial_1 = require("../../../CombatSpecial");
var DragonLongswordCombatMethod = exports.DragonLongswordCombatMethod = /** @class */ (function (_super) {
    __extends(DragonLongswordCombatMethod, _super);
    function DragonLongswordCombatMethod() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DragonLongswordCombatMethod.prototype.start = function (character, target) {
        CombatSpecial_1.CombatSpecial.drain(character, CombatSpecial_1.CombatSpecial.DRAGON_LONGSWORD.getDrainAmount());
        character.performAnimation(DragonLongswordCombatMethod.ANIMATION);
        character.performGraphic(DragonLongswordCombatMethod.GRAPHIC);
    };
    DragonLongswordCombatMethod.ANIMATION = new Animation_1.Animation(1058);
    DragonLongswordCombatMethod.GRAPHIC = new Graphic_1.Graphic(248, GraphicHeight_1.GraphicHeight.HIGH);
    return DragonLongswordCombatMethod;
}(MeleeCombatMethod_1.MeleeCombatMethod));
//# sourceMappingURL=DragonLongswordCombatMethod.js.map