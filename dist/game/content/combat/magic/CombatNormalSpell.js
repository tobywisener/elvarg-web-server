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
exports.CombatNormalSpell = void 0;
var CombatSpell_1 = require("./CombatSpell");
var CombatNormalSpell = /** @class */ (function (_super) {
    __extends(CombatNormalSpell, _super);
    function CombatNormalSpell(options) {
        var _this = _super.call(this) || this;
        _this.options = options;
        return _this;
    }
    CombatNormalSpell.prototype.getSpell = function () {
        throw new Error("Method not implemented.");
    };
    CombatNormalSpell.prototype.spellId = function () {
        return this.options.spellId();
    };
    CombatNormalSpell.prototype.maximumHit = function () {
        return this.options.maximumHit();
    };
    CombatNormalSpell.prototype.castAnimation = function () {
        return this.options.castAnimation();
    };
    CombatNormalSpell.prototype.startGraphic = function () {
        return this.options.startGraphic();
    };
    CombatNormalSpell.prototype.castProjectile = function (cast, castOn) {
        return this.options.castProjectile(cast, castOn);
    };
    CombatNormalSpell.prototype.endGraphic = function () {
        return this.options.endGraphic();
    };
    CombatNormalSpell.prototype.finishCast = function (cast, castOn, accurate, damage) {
        return this.options.finishCast(cast, castOn, accurate, damage);
    };
    CombatNormalSpell.prototype.baseExperience = function () {
        if (this.options.baseExperience) {
            return this.options.baseExperience();
        }
        else {
            return this.baseExperience();
        }
    };
    CombatNormalSpell.prototype.equipmentRequired = function (player) {
        if (this.options.equipmentRequired) {
            return this.options.equipmentRequired(player);
        }
        else {
            return this.equipmentRequired(player);
        }
    };
    CombatNormalSpell.prototype.itemsRequired = function (player) {
        if (this.options.itemsRequired) {
            return this.options.itemsRequired(player);
        }
        else {
            return this.itemsRequired(player);
        }
    };
    CombatNormalSpell.prototype.levelRequired = function () {
        if (this.options.levelRequired) {
            return this.options.levelRequired();
        }
        else {
            return this.levelRequired();
        }
    };
    CombatNormalSpell.prototype.spellEffect = function (cast, castOn) {
        if (this.options.spellEffect) {
            return this.options.spellEffect(cast, castOn);
        }
        else {
            return this.spellEffect(cast, castOn);
        }
    };
    return CombatNormalSpell;
}(CombatSpell_1.CombatSpell));
exports.CombatNormalSpell = CombatNormalSpell;
//# sourceMappingURL=CombatNormalSpell.js.map