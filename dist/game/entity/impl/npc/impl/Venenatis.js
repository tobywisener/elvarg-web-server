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
exports.Venenatis = void 0;
var VenenatisCombatMethod_1 = require("../../../../content/combat/method/impl/npcs/VenenatisCombatMethod");
var NPC_1 = require("../NPC");
var Venenatis = exports.Venenatis = /** @class */ (function (_super) {
    __extends(Venenatis, _super);
    function Venenatis(id, position) {
        return _super.call(this, id, position) || this;
    }
    Venenatis.prototype.getCombatMethod = function () {
        return Venenatis.COMBAT_METHOD;
    };
    Venenatis.COMBAT_METHOD = new VenenatisCombatMethod_1.VenenatisCombatMethod();
    return Venenatis;
}(NPC_1.NPC));
//# sourceMappingURL=Venenatis.js.map