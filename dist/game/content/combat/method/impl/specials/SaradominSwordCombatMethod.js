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
exports.SaradominSwordCombatMethod = void 0;
var MeleeCombatMethod_1 = require("../MeleeCombatMethod");
var Animation_1 = require("../../../../../model/Animation");
var Graphic_1 = require("../../../../../model/Graphic");
var Priority_1 = require("../../../../../model/Priority");
var CombatSpecial_1 = require("../../../CombatSpecial");
var PendingHit_1 = require("../../../hit/PendingHit");
var SaradominSwordCombatMethod = exports.SaradominSwordCombatMethod = /** @class */ (function (_super) {
    __extends(SaradominSwordCombatMethod, _super);
    function SaradominSwordCombatMethod() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SaradominSwordCombatMethod.prototype.hits = function (character, target) {
        var hit = new PendingHit_1.PendingHit(character, target, this, 2);
        hit.getHits()[1].setDamage(hit.isAccurate() ? hit.getHits()[0].getDamage() + 16 : 0);
        hit.updateTotalDamage();
        return [hit];
    };
    SaradominSwordCombatMethod.prototype.start = function (character, target) {
        CombatSpecial_1.CombatSpecial.drain(character, CombatSpecial_1.CombatSpecial.SARADOMIN_SWORD.getDrainAmount());
        character.performAnimation(SaradominSwordCombatMethod.ANIMATION);
        character.performGraphic(SaradominSwordCombatMethod.GRAPHIC);
    };
    SaradominSwordCombatMethod.prototype.handleAfterHitEffects = function (hit) {
        hit.getTarget().performGraphic(SaradominSwordCombatMethod.ENEMY_GRAPHIC);
    };
    SaradominSwordCombatMethod.ENEMY_GRAPHIC = new Graphic_1.Graphic(1196);
    SaradominSwordCombatMethod.ANIMATION = new Animation_1.Animation(1132);
    SaradominSwordCombatMethod.GRAPHIC = new Graphic_1.Graphic(1213, Priority_1.Priority.HIGH);
    return SaradominSwordCombatMethod;
}(MeleeCombatMethod_1.MeleeCombatMethod));
//# sourceMappingURL=SaradominSwordCombatMethod.js.map