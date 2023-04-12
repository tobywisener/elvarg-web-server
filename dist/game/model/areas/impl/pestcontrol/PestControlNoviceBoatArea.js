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
exports.PestControlNoviceBoatArea = void 0;
var Boundary_1 = require("../../../Boundary");
var Area_1 = require("../../Area");
var TaskManager_1 = require("../../../../task/TaskManager");
var PestControl_1 = require("../../../../content/minigames/impl/pestcontrols/PestControl");
var ObjectIdentifiers_1 = require("../../../../../util/ObjectIdentifiers");
var PestControlNoviceBoatArea = exports.PestControlNoviceBoatArea = /** @class */ (function (_super) {
    __extends(PestControlNoviceBoatArea, _super);
    function PestControlNoviceBoatArea() {
        return _super.call(this, [PestControlNoviceBoatArea.BOUNDARY]) || this;
    }
    PestControlNoviceBoatArea.prototype.postEnter = function (character) {
        if (!character.isPlayer()) {
            return;
        }
        if (!PestControl_1.PestControl.NOVICE_LOBBY_TASK.isRunning() && this.getPlayers().length > 0) {
            TaskManager_1.TaskManager.submit(PestControl_1.PestControl.NOVICE_LOBBY_TASK);
        }
        character.getAsPlayer().setWalkableInterfaceId(21119);
    };
    PestControlNoviceBoatArea.prototype.allowDwarfCannon = function (player) {
        player.sendMessage("This would be a silly.");
        return false;
    };
    PestControlNoviceBoatArea.prototype.allowSummonPet = function (player) {
        player.sendMessage("The squire doesn't allow you to bring your pet with you.");
        return false;
    };
    PestControlNoviceBoatArea.prototype.postLeave = function (character, logout) {
        if (!character.isPlayer()) {
            return;
        }
        character.getAsPlayer().setWalkableInterfaceId(-1);
    };
    PestControlNoviceBoatArea.prototype.process = function (character) {
        var player = character.getAsPlayer();
        if (player == null) {
            // Don't process for any other type of Mobile, just players
            return;
        }
        player.getPacketSender().sendString("Players Ready: " + PestControl_1.PestControl.NOVICE_BOAT_AREA.getPlayers().length, 21121);
        player.getPacketSender().sendString("(Need 3 to 25 players)", 21122);
        player.getPacketSender().sendString("Points: " + player.pcPoints, 21123);
    };
    PestControlNoviceBoatArea.prototype.handleObjectClick = function (player, object, type) {
        switch (object.getId()) {
            case ObjectIdentifiers_1.ObjectIdentifiers.LADDER_175:
                // Move player to the pier
                player.moveTo(PestControl_1.PestControl.GANG_PLANK_START);
                return true;
        }
        return false;
    };
    PestControlNoviceBoatArea.BOUNDARY = new Boundary_1.Boundary(2660, 2663, 2638, 2643);
    return PestControlNoviceBoatArea;
}(Area_1.Area));
//# sourceMappingURL=PestControlNoviceBoatArea.js.map