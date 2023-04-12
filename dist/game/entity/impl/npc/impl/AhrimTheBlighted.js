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
exports.AhrimTheBlighted = void 0;
var CombatSpells_1 = require("../../../../content/combat/magic/CombatSpells");
var NPC_1 = require("../NPC");
var CombatFactory_1 = require("../../../../content/combat/CombatFactory");
var AhrimTheBlighted = /** @class */ (function (_super) {
    __extends(AhrimTheBlighted, _super);
    function AhrimTheBlighted(id, position) {
        var _this = _super.call(this, id, position) || this;
        _this.getCombat().setAutocastSpell(CombatSpells_1.CombatSpells.FIRE_WAVE.getSpell());
        return _this;
    }
    AhrimTheBlighted.prototype.getCombatMethod = function () {
        return CombatFactory_1.CombatFactory.MAGIC_COMBAT;
    };
    return AhrimTheBlighted;
}(NPC_1.NPC));
exports.AhrimTheBlighted = AhrimTheBlighted;
//# sourceMappingURL=AhrimTheBlighted.js.map