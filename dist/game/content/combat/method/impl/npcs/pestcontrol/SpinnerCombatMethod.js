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
exports.SpinnerCombatMethod = void 0;
var MeleeCombatMethod_1 = require("../../MeleeCombatMethod");
var SpinnerCombatMethod = /** @class */ (function (_super) {
    __extends(SpinnerCombatMethod, _super);
    function SpinnerCombatMethod() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SpinnerCombatMethod.prototype.onTick = function (npc, target) {
        console.error(target === null);
    };
    return SpinnerCombatMethod;
}(MeleeCombatMethod_1.MeleeCombatMethod));
exports.SpinnerCombatMethod = SpinnerCombatMethod;
//# sourceMappingURL=SpinnerCombatMethod.js.map