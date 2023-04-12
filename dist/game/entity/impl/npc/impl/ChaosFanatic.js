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
exports.ChaosFanatic = void 0;
var ChaosFanaticCombatMethod_1 = require("../../../../content/combat/method/impl/npcs/ChaosFanaticCombatMethod");
var NPC_1 = require("../NPC");
var ChaosFanatic = exports.ChaosFanatic = /** @class */ (function (_super) {
    __extends(ChaosFanatic, _super);
    function ChaosFanatic(id, position) {
        return _super.call(this, id, position) || this;
    }
    ChaosFanatic.prototype.getCombatMethod = function () {
        return ChaosFanatic.COMBAT_METHOD;
    };
    ChaosFanatic.COMBAT_METHOD = new ChaosFanaticCombatMethod_1.ChaosFanaticCombatMethod();
    return ChaosFanatic;
}(NPC_1.NPC));
//# sourceMappingURL=ChaosFanatic.js.map