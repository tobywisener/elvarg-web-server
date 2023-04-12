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
exports.Callisto = void 0;
var CallistoCombatMethod_1 = require("../../../../content/combat/method/impl/npcs/CallistoCombatMethod");
var NPC_1 = require("../NPC");
var Callisto = exports.Callisto = /** @class */ (function (_super) {
    __extends(Callisto, _super);
    function Callisto(id, position) {
        return _super.call(this, id, position) || this;
    }
    Callisto.prototype.getCombatMethod = function () {
        return Callisto.COMBAT_METHOD;
    };
    Callisto.COMBAT_METHOD = new CallistoCombatMethod_1.CallistoCombatMethod();
    return Callisto;
}(NPC_1.NPC));
//# sourceMappingURL=Callisto.js.map