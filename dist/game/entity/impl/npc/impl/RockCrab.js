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
exports.RockCrab = void 0;
var RockCrabCombatMethod_1 = require("../../../../content/combat/method/impl/npcs/RockCrabCombatMethod");
var NPC_1 = require("../NPC");
var NpcIdentifiers_1 = require("../../../../../util/NpcIdentifiers");
var RockCrab = exports.RockCrab = /** @class */ (function (_super) {
    __extends(RockCrab, _super);
    function RockCrab(id, position) {
        return _super.call(this, id, position) || this;
    }
    RockCrab.prototype.isAggressiveTo = function (player) {
        // Rock crabs always attack players, regardless of combat level
        // Otherwise, there would be no way for Players over combat level 26 to attack them
        return true;
    };
    RockCrab.prototype.aggressionDistance = function () {
        // Rock crabs only attack when Player is right beside them
        return 1;
    };
    RockCrab.prototype.getCombatMethod = function () {
        return RockCrab.COMBAT_METHOD;
    };
    RockCrab.getTransformationId = function (rockNpcId) {
        switch (rockNpcId) {
            // Rock is transforming into a Rock Crab
            case NpcIdentifiers_1.NpcIdentifiers.ROCKS:
                return NpcIdentifiers_1.NpcIdentifiers.ROCK_CRAB;
            case NpcIdentifiers_1.NpcIdentifiers.ROCKS_2:
                return NpcIdentifiers_1.NpcIdentifiers.ROCK_CRAB_2;
            // Rock Crab is transforming back into a Rock
            case NpcIdentifiers_1.NpcIdentifiers.ROCK_CRAB:
                return NpcIdentifiers_1.NpcIdentifiers.ROCKS;
            case NpcIdentifiers_1.NpcIdentifiers.ROCK_CRAB_2:
                return NpcIdentifiers_1.NpcIdentifiers.ROCKS_2;
        }
        return NpcIdentifiers_1.NpcIdentifiers.ROCK_CRAB;
    };
    RockCrab.COMBAT_METHOD = new RockCrabCombatMethod_1.RockCrabCombatMethod();
    RockCrab.ROCK_IDS = [NpcIdentifiers_1.NpcIdentifiers.ROCKS, NpcIdentifiers_1.NpcIdentifiers.ROCKS_2];
    return RockCrab;
}(NPC_1.NPC));
//# sourceMappingURL=RockCrab.js.map