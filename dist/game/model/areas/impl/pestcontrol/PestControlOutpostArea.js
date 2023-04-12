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
exports.PestControlOutpostArea = void 0;
var Area_1 = require("../../Area");
var PestControlBoat_1 = require("../../../../content/minigames/impl/pestcontrols/PestControlBoat");
var PestControl_1 = require("../../../../content/minigames/impl/pestcontrols/PestControl");
var Boundary_1 = require("../../../Boundary");
var PestControlOutpostArea = /** @class */ (function (_super) {
    __extends(PestControlOutpostArea, _super);
    function PestControlOutpostArea() {
        return _super.call(this, [new Boundary_1.Boundary(2626, 2682, 2632, 2681)]) || this;
    }
    PestControlOutpostArea.prototype.getName = function () {
        return "the Pest Control Outpost island";
    };
    PestControlOutpostArea.prototype.handleObjectClick = function (player, object, type) {
        switch (object.getId()) {
            // case statements here
        }
        var boatdata = PestControlBoat_1.PestControlBoat.getBoat(object.getId());
        if (!boatdata) {
            return false;
        }
        var boat = boatdata;
        if (player.getSkillManager().getCombatLevel() < boat.combatLevelRequirement) {
            player.getPacketSender().sendMessage("You need a combat level of ".concat(boat.combatLevelRequirement, " to board this boat."));
            return false;
        }
        if (player.getCurrentPet()) {
            player.getPacketSender().sendMessage("You cannot bring your follower with you.");
            return false;
        }
        PestControl_1.PestControl.addToWaitingRoom(player, boat);
        return true;
    };
    return PestControlOutpostArea;
}(Area_1.Area));
exports.PestControlOutpostArea = PestControlOutpostArea;
//# sourceMappingURL=PestControlOutpostArea.js.map