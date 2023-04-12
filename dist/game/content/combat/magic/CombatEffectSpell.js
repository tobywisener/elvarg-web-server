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
exports.CombatEffectSpell = void 0;
var CombatSpell_1 = require("./CombatSpell");
var CombatEffectSpell = /** @class */ (function (_super) {
    __extends(CombatEffectSpell, _super);
    function CombatEffectSpell(options) {
        var _this = _super.call(this) || this;
        _this.options = options;
        return _this;
    }
    CombatEffectSpell.prototype.levelRequired = function () {
        throw new Error("Method not implemented.");
    };
    CombatEffectSpell.prototype.getSpell = function () {
        throw new Error("Method not implemented.");
    };
    CombatEffectSpell.prototype.itemsRequired = function (player) {
        throw new Error("Method not implemented.");
    };
    CombatEffectSpell.prototype.baseExperience = function () {
        throw new Error("Method not implemented.");
    };
    CombatEffectSpell.prototype.spellId = function () {
        return this.options.spellId();
    };
    CombatEffectSpell.prototype.castAnimation = function () {
        return this.options.castAnimation();
    };
    CombatEffectSpell.prototype.startGraphic = function () {
        return this.options.startGraphic();
    };
    CombatEffectSpell.prototype.castProjectile = function (cast, castOn) {
        return this.options.castProjectile(cast, castOn);
    };
    CombatEffectSpell.prototype.endGraphic = function () {
        return this.options.endGraphic();
    };
    CombatEffectSpell.prototype.maximumHit = function () {
        return -1;
    };
    CombatEffectSpell.prototype.equipmentRequired = function (player) {
        return null;
    };
    CombatEffectSpell.prototype.finishCast = function (cast, castOn, accurate, damage) {
        if (accurate) {
            this.spellEffect(cast, castOn);
        }
    };
    CombatEffectSpell.prototype.spellEffect = function (cast, castOn) {
    };
    return CombatEffectSpell;
}(CombatSpell_1.CombatSpell));
exports.CombatEffectSpell = CombatEffectSpell;
//# sourceMappingURL=CombatEffectSpell.js.map