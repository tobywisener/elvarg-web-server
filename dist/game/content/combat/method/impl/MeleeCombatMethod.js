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
exports.MeleeCombatMethod = void 0;
var CombatMethod_1 = require("../CombatMethod");
var Sounds_1 = require("../../../../Sounds");
var CombatType_1 = require("../../CombatType");
var PendingHit_1 = require("../../hit/PendingHit");
var Animation_1 = require("../../../../model/Animation");
var WeaponInterfaces_1 = require("../../WeaponInterfaces");
var MeleeCombatMethod = /** @class */ (function (_super) {
    __extends(MeleeCombatMethod, _super);
    function MeleeCombatMethod() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MeleeCombatMethod.prototype.start = function (character, target) {
        var animation = character.getAttackAnim();
        if (animation !== -1) {
            character.performAnimation(new Animation_1.Animation(animation));
            Sounds_1.Sounds.sendSound(character.getAsPlayer(), character.getAttackSound());
        }
    };
    MeleeCombatMethod.prototype.type = function () {
        return CombatType_1.CombatType.MELEE;
    };
    MeleeCombatMethod.prototype.hits = function (character, target) {
        return [new PendingHit_1.PendingHit(character, target, this)];
    };
    MeleeCombatMethod.prototype.attackDistance = function (character) {
        if (character.isPlayer() && character.getAsPlayer().getWeapon() === WeaponInterfaces_1.WeaponInterfaces.HALBERD) {
            return 2;
        }
        return 1;
    };
    return MeleeCombatMethod;
}(CombatMethod_1.CombatMethod));
exports.MeleeCombatMethod = MeleeCombatMethod;
//# sourceMappingURL=MeleeCombatMethod.js.map