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
exports.CrazyArchaeologist = void 0;
var CrazyArchaeologistCombatMethod_1 = require("../../../../content/combat/method/impl/npcs/CrazyArchaeologistCombatMethod");
var NPC_1 = require("../NPC");
var CrazyArchaeologist = exports.CrazyArchaeologist = /** @class */ (function (_super) {
    __extends(CrazyArchaeologist, _super);
    function CrazyArchaeologist(id, position) {
        return _super.call(this, id, position) || this;
    }
    CrazyArchaeologist.getCombatMethod = function () {
        return CrazyArchaeologist.COMBAT_METHOD;
    };
    CrazyArchaeologist.COMBAT_METHOD = new CrazyArchaeologistCombatMethod_1.CrazyArchaeologistCombatMethod();
    return CrazyArchaeologist;
}(NPC_1.NPC));
//# sourceMappingURL=CrazyArchaeologist.js.map