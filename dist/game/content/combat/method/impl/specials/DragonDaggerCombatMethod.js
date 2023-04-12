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
exports.DragonDaggerCombatMethod = void 0;
var MeleeCombatMethod_1 = require("../MeleeCombatMethod");
var Animation_1 = require("../../../../../model/Animation");
var Graphic_1 = require("../../../../../model/Graphic");
var GraphicHeight_1 = require("../../../../../model/GraphicHeight");
var CombatSpecial_1 = require("../../../CombatSpecial");
var PendingHit_1 = require("../../../hit/PendingHit");
var Sound_1 = require("../../../../../Sound");
var Sounds_1 = require("../../../../../Sounds");
var DragonDaggerCombatMethod = exports.DragonDaggerCombatMethod = /** @class */ (function (_super) {
    __extends(DragonDaggerCombatMethod, _super);
    function DragonDaggerCombatMethod() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DragonDaggerCombatMethod.prototype.hits = function (character, target) {
        return [new PendingHit_1.PendingHit(character, target, this),
            new PendingHit_1.PendingHit(character, target, this, target.isNpc() ? 1 : 0)];
    };
    DragonDaggerCombatMethod.prototype.start = function (character, target) {
        CombatSpecial_1.CombatSpecial.drain(character, CombatSpecial_1.CombatSpecial.DRAGON_DAGGER.getDrainAmount());
        character.performAnimation(DragonDaggerCombatMethod.ANIMATION);
        character.performGraphic(DragonDaggerCombatMethod.GRAPHIC);
        Sounds_1.Sounds.sendSound(character.getAsPlayer(), Sound_1.Sound.DRAGON_DAGGER_SPECIAL);
    };
    DragonDaggerCombatMethod.ANIMATION = new Animation_1.Animation(1062);
    DragonDaggerCombatMethod.GRAPHIC = new Graphic_1.Graphic(252, GraphicHeight_1.GraphicHeight.HIGH);
    return DragonDaggerCombatMethod;
}(MeleeCombatMethod_1.MeleeCombatMethod));
//# sourceMappingURL=DragonDaggerCombatMethod.js.map