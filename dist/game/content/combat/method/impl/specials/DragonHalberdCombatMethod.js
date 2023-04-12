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
exports.DragonHalberdCombatMethod = void 0;
var MeleeCombatMethod_1 = require("../MeleeCombatMethod");
var Animation_1 = require("../../../../../model/Animation");
var Graphic_1 = require("../../../../../model/Graphic");
var GraphicHeight_1 = require("../../../../../model/GraphicHeight");
var CombatSpecial_1 = require("../../../CombatSpecial");
var PendingHit_1 = require("../../../hit/PendingHit");
var DragonHalberdCombatMethod = exports.DragonHalberdCombatMethod = /** @class */ (function (_super) {
    __extends(DragonHalberdCombatMethod, _super);
    function DragonHalberdCombatMethod() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DragonHalberdCombatMethod.prototype.hits = function (character, target) {
        return [new PendingHit_1.PendingHit(character, target, this, 1), new PendingHit_1.PendingHit(character, target, this)];
    };
    DragonHalberdCombatMethod.prototype.start = function (character, target) {
        CombatSpecial_1.CombatSpecial.drain(character, CombatSpecial_1.CombatSpecial.DRAGON_HALBERD.getDrainAmount());
        character.performAnimation(DragonHalberdCombatMethod.ANIMATION);
        character.performGraphic(DragonHalberdCombatMethod.GRAPHIC);
    };
    DragonHalberdCombatMethod.ANIMATION = new Animation_1.Animation(1203);
    DragonHalberdCombatMethod.GRAPHIC = new Graphic_1.Graphic(282, GraphicHeight_1.GraphicHeight.HIGH);
    return DragonHalberdCombatMethod;
}(MeleeCombatMethod_1.MeleeCombatMethod));
//# sourceMappingURL=DragonHalberdCombatMethod.js.map