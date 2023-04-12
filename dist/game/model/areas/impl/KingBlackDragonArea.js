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
exports.KingBlackDragonArea = void 0;
var Area_1 = require("../../../model/areas/Area");
var Boundary_1 = require("../../../model/Boundary");
var KingBlackDragonArea = exports.KingBlackDragonArea = /** @class */ (function (_super) {
    __extends(KingBlackDragonArea, _super);
    function KingBlackDragonArea() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    KingBlackDragonArea.prototype.process = function (character) { };
    KingBlackDragonArea.prototype.canTeleport = function (player) {
        return true;
    };
    KingBlackDragonArea.prototype.canTrade = function (player, target) {
        return true;
    };
    KingBlackDragonArea.prototype.isMulti = function (character) {
        return true;
    };
    KingBlackDragonArea.prototype.canEat = function (player, itemId) {
        return true;
    };
    KingBlackDragonArea.prototype.canDrink = function (player, itemId) {
        return true;
    };
    KingBlackDragonArea.prototype.dropItemsOnDeath = function (player, killer) {
        return true;
    };
    KingBlackDragonArea.prototype.handleDeath = function (player, killer) {
        return false;
    };
    KingBlackDragonArea.prototype.onPlayerRightClick = function (player, rightClicked, option) { };
    KingBlackDragonArea.prototype.defeated = function (player, character) { };
    KingBlackDragonArea.prototype.handleObjectClick = function (player, objectId, type) {
        return false;
    };
    KingBlackDragonArea.BOUNDARY = new Boundary_1.Boundary(2249, 2292, 4672, 4720, 0);
    return KingBlackDragonArea;
}(Area_1.Area));
//# sourceMappingURL=KingBlackDragonArea.js.map