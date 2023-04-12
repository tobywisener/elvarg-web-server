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
exports.RockCrabCombatMethod = void 0;
var MeleeCombatMethod_1 = require("../MeleeCombatMethod");
var RockCrab_1 = require("../../../../../entity/impl/npc/impl/RockCrab");
var RockCrabCombatMethod = /** @class */ (function (_super) {
    __extends(RockCrabCombatMethod, _super);
    function RockCrabCombatMethod() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RockCrabCombatMethod.prototype.onCombatBegan = function (character, target) {
        var npc = character.getAsNpc();
        if (npc == null) {
            return;
        }
        if (npc.getNpcTransformationId() == -1 ||
            RockCrab_1.RockCrab.ROCK_IDS.includes(npc.getNpcTransformationId())) {
            // Transform into an actual rock crab when combat starts
            npc.setNpcTransformationId(RockCrab_1.RockCrab.getTransformationId(npc.getId()));
        }
    };
    RockCrabCombatMethod.prototype.onCombatEnded = function (character, target) {
        var npc = character.getAsNpc();
        if (npc == null || npc.isDyingFunction()) {
            return;
        }
        var undoTransformId = RockCrab_1.RockCrab.getTransformationId(npc.getNpcTransformationId());
        npc.setNpcTransformationId(undoTransformId);
    };
    return RockCrabCombatMethod;
}(MeleeCombatMethod_1.MeleeCombatMethod));
exports.RockCrabCombatMethod = RockCrabCombatMethod;
//# sourceMappingURL=RockCrabCombatMethod.js.map