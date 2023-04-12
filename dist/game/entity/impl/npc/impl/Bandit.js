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
exports.Bandit = void 0;
var BanditCombtMethod_1 = require("../../../../content/combat/method/impl/npcs/BanditCombtMethod");
var NPC_1 = require("../NPC");
var Equipment_1 = require("../../../../model/container/impl/Equipment");
var Bandit = exports.Bandit = /** @class */ (function (_super) {
    __extends(Bandit, _super);
    function Bandit(id, position) {
        return _super.call(this, id, position) || this;
    }
    Bandit.prototype.isAggressiveTo = function (player) {
        // Bandits are only aggressive towards players who have god affiliated items
        var saradominItemCount = Equipment_1.Equipment.ITEM_COUNT;
        var zamorakItemCount = Equipment_1.Equipment.ITEM_COUNT;
        return saradominItemCount > 0 || zamorakItemCount > 0;
    };
    Bandit.prototype.getCombatMethod = function () {
        return Bandit.COMBAT_METHOD;
    };
    Bandit.COMBAT_METHOD = new BanditCombtMethod_1.BanditCombtMethod();
    return Bandit;
}(NPC_1.NPC));
//# sourceMappingURL=Bandit.js.map