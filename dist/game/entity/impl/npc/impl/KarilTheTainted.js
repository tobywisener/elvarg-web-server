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
exports.KarilTheTainted = void 0;
var RangedData_1 = require("../../../../content/combat/ranged/RangedData");
var NPC_1 = require("../NPC");
var CombatFactory_1 = require("../../../../content/combat/CombatFactory");
var KarilTheTainted = /** @class */ (function (_super) {
    __extends(KarilTheTainted, _super);
    function KarilTheTainted(id, position) {
        var _this = _super.call(this, id, position) || this;
        _this.getCombat().setRangedWeapon(RangedData_1.RangedWeapon.KARILS_CROSSBOW);
        _this.getCombat().setAmmunition(RangedData_1.Ammunition.BOLT_RACK);
        return _this;
    }
    KarilTheTainted.prototype.getCombatMethod = function () {
        return CombatFactory_1.CombatFactory.RANGED_COMBAT;
    };
    return KarilTheTainted;
}(NPC_1.NPC));
exports.KarilTheTainted = KarilTheTainted;
//# sourceMappingURL=KarilTheTainted.js.map