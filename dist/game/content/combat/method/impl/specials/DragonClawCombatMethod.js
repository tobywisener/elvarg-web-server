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
exports.DragonClawCombatMethod = void 0;
var MeleeCombatMethod_1 = require("../MeleeCombatMethod");
var Animation_1 = require("../../../../../model/Animation");
var Graphic_1 = require("../../../../../model/Graphic");
var Priority_1 = require("../../../../../model/Priority");
var CombatSpecial_1 = require("../../../CombatSpecial");
var PendingHit_1 = require("../../../hit/PendingHit");
var DragonClawCombatMethod = exports.DragonClawCombatMethod = /** @class */ (function (_super) {
    __extends(DragonClawCombatMethod, _super);
    function DragonClawCombatMethod() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DragonClawCombatMethod.prototype.hits = function (character, target) {
        var hit = new PendingHit_1.PendingHit(character, target, this, 4, true);
        // Modify the hits.. Claws have a unique maxhit formula
        var first = hit.getHits()[0].getDamage();
        var second = first <= 0 ? hit.getHits()[1].getDamage() : (first / 2);
        var third = second <= 0 ? second : (second / 2);
        var fourth = second <= 0 ? second : (second / 2);
        hit.getHits()[0].setDamage(first);
        hit.getHits()[1].setDamage(second);
        hit.getHits()[2].setDamage(third);
        hit.getHits()[3].setDamage(fourth);
        hit.updateTotalDamage();
        return [hit];
    };
    DragonClawCombatMethod.prototype.start = function (character, target) {
        CombatSpecial_1.CombatSpecial.drain(character, CombatSpecial_1.CombatSpecial.DRAGON_CLAWS.getDrainAmount());
        character.performAnimation(DragonClawCombatMethod.ANIMATION);
        character.performGraphic(DragonClawCombatMethod.GRAPHIC);
    };
    DragonClawCombatMethod.ANIMATION = new Animation_1.Animation(7527);
    DragonClawCombatMethod.GRAPHIC = new Graphic_1.Graphic(1171, Priority_1.Priority.HIGH);
    return DragonClawCombatMethod;
}(MeleeCombatMethod_1.MeleeCombatMethod));
//# sourceMappingURL=DragonClawCombatMethod.js.map