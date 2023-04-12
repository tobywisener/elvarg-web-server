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
exports.AbyssalDaggerCombatMethod = void 0;
var MeleeCombatMethod_1 = require("../MeleeCombatMethod");
var Animation_1 = require("../../../../../model/Animation");
var Graphic_1 = require("../../../../../model/Graphic");
var Priority_1 = require("../../../../../model/Priority");
var PendingHit_1 = require("../../../hit/PendingHit");
var CombatSpecial_1 = require("../../../CombatSpecial");
var AbyssalDaggerCombatMethod = exports.AbyssalDaggerCombatMethod = /** @class */ (function (_super) {
    __extends(AbyssalDaggerCombatMethod, _super);
    function AbyssalDaggerCombatMethod() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AbyssalDaggerCombatMethod.prototype.hits = function (character, target) {
        var hit1 = new PendingHit_1.PendingHit(character, target, this);
        var hit2 = new PendingHit_1.PendingHit(character, target, this, target.isNpc() ? 1 : 0);
        if (!hit1.isAccurate() || hit1.getTotalDamage() <= 0) {
            hit2.getHits()[0].setDamage(0);
            hit2.updateTotalDamage();
        }
        return [hit1, hit2];
    };
    AbyssalDaggerCombatMethod.prototype.start = function (character, target) {
        CombatSpecial_1.CombatSpecial.drain(character, CombatSpecial_1.CombatSpecial.ABYSSAL_DAGGER.getDrainAmount());
        character.performAnimation(AbyssalDaggerCombatMethod.ANIMATION);
        character.performGraphic(AbyssalDaggerCombatMethod.GRAPHIC);
    };
    AbyssalDaggerCombatMethod.ANIMATION = new Animation_1.Animation(3300);
    AbyssalDaggerCombatMethod.GRAPHIC = new Graphic_1.Graphic(1283, Priority_1.Priority.HIGH);
    return AbyssalDaggerCombatMethod;
}(MeleeCombatMethod_1.MeleeCombatMethod));
//# sourceMappingURL=AbyssalDaggerCombatMethod.js.map