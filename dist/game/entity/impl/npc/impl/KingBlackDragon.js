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
exports.KingBlackDragon = void 0;
var KingBlackDragonMethod_1 = require("../../../../content/combat/method/impl/npcs/KingBlackDragonMethod");
var NPC_1 = require("../NPC");
var KingBlackDragon = exports.KingBlackDragon = /** @class */ (function (_super) {
    __extends(KingBlackDragon, _super);
    function KingBlackDragon(id, position) {
        return _super.call(this, id, position) || this;
    }
    KingBlackDragon.prototype.getCombatMethod = function () {
        return KingBlackDragon.COMBAT_METHOD;
    };
    KingBlackDragon.COMBAT_METHOD = new KingBlackDragonMethod_1.KingBlackDragonMethod();
    return KingBlackDragon;
}(NPC_1.NPC));
//# sourceMappingURL=KingBlackDragon.js.map