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
exports.BarrowsArea = void 0;
var Boundary_1 = require("../../../model/Boundary");
var Barrows_1 = require("../../../content/minigames/impl/Barrows");
var Area_1 = require("../../../model/areas/Area");
var BarrowsArea = /** @class */ (function (_super) {
    __extends(BarrowsArea, _super);
    function BarrowsArea() {
        return _super.call(this, [new Boundary_1.Boundary(3521, 3582, 9662, 9724, 0), new Boundary_1.Boundary(3545, 3583, 3265, 3306, 0)]) || this;
    }
    BarrowsArea.prototype.postEnter = function (character) {
        if (character.isPlayer()) {
            var player = character.getAsPlayer();
            player.getPacketSender().sendWalkableInterface(Barrows_1.Barrows.KILLCOUNTER_INTERFACE_ID);
            Barrows_1.Barrows.updateInterface(player);
        }
    };
    BarrowsArea.prototype.postLeave = function (character, logout) {
        if (character.isPlayer()) {
            character.getAsPlayer().getPacketSender().sendWalkableInterface(-1);
        }
    };
    BarrowsArea.prototype.process = function (character) {
    };
    BarrowsArea.prototype.canTeleport = function (player) {
        return true;
    };
    BarrowsArea.prototype.canTrade = function (player, target) {
        return true;
    };
    BarrowsArea.prototype.isMulti = function (character) {
        return false;
    };
    BarrowsArea.prototype.canEat = function (player, itemId) {
        return true;
    };
    BarrowsArea.prototype.canDrink = function (player, itemId) {
        return true;
    };
    BarrowsArea.prototype.dropItemsOnDeath = function (player, killer) {
        return true;
    };
    BarrowsArea.prototype.handleDeath = function (player, killer) {
        return false;
    };
    BarrowsArea.prototype.onPlayerRightClick = function (player, rightClicked, option) {
    };
    BarrowsArea.prototype.defeated = function (player, character) {
        if (character.isNpc()) {
            Barrows_1.Barrows.brotherDeath(player, character.getAsNpc());
        }
    };
    BarrowsArea.prototype.handleObjectClick = function (player, objectId, type) {
        return Barrows_1.Barrows.handleObject(player, objectId.getId());
    };
    return BarrowsArea;
}(Area_1.Area));
exports.BarrowsArea = BarrowsArea;
//# sourceMappingURL=BarrowsArea.js.map