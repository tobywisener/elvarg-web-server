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
exports.PestControlPortalCombatMethod = void 0;
var CombatMethod_1 = require("../../../CombatMethod");
var CombatType_1 = require("../../../../CombatType");
var PestControl_1 = require("../../../../../minigames/impl/pestcontrols/PestControl");
var PestControlPortalCombatMethod = /** @class */ (function (_super) {
    __extends(PestControlPortalCombatMethod, _super);
    function PestControlPortalCombatMethod() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PestControlPortalCombatMethod.prototype.type = function () {
        return CombatType_1.CombatType.MELEE;
    };
    PestControlPortalCombatMethod.prototype.hits = function (character, target) {
        return [];
    };
    PestControlPortalCombatMethod.prototype.attackDistance = function (character) {
        return 5;
    };
    PestControlPortalCombatMethod.prototype.canAttack = function (character, target) {
        return PestControl_1.PestControl.isPortal(character.getAsNpc().getId(), false);
    };
    PestControlPortalCombatMethod.prototype.onDeath = function (npc, killer) {
        PestControl_1.PestControl.healKnight(npc);
    };
    return PestControlPortalCombatMethod;
}(CombatMethod_1.CombatMethod));
exports.PestControlPortalCombatMethod = PestControlPortalCombatMethod;
//# sourceMappingURL=PestControlPortalCombatMethod.js.map