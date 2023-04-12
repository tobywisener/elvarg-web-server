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
exports.CastleWarsZamorakWaitingArea = void 0;
var Boundary_1 = require("../../../../model/Boundary");
var CastleWars_1 = require("../../../../content/minigames/impl/CastleWars");
var ObjectIdentifiers_1 = require("../../../../../util/ObjectIdentifiers");
var Misc_1 = require("../../../../../util/Misc");
var Area_1 = require("../../../../model/areas/Area");
var TaskManager_1 = require("../../../../task/TaskManager");
var Equipment_1 = require("../../../container/impl/Equipment");
var Location_1 = require("../../../Location");
var Flag_1 = require("../../../Flag");
var CastleWarsZamorakWaitingArea = /** @class */ (function (_super) {
    __extends(CastleWarsZamorakWaitingArea, _super);
    function CastleWarsZamorakWaitingArea() {
        return _super.call(this, [new Boundary_1.Boundary(2408, 2432, 9512, 9535, 0)]) || this;
    }
    CastleWarsZamorakWaitingArea.prototype.getName = function () {
        return "the Zamorak waiting room in Castle Wars";
    };
    CastleWarsZamorakWaitingArea.prototype.postEnter = function (character) {
        var player = character.getAsPlayer();
        if (!player) {
            return;
        }
        if (!CastleWars_1.CastleWars.START_GAME_TASK.isRunning() && CastleWars_1.CastleWars.SARADOMIN_WAITING_AREA.getPlayers().length > 0) {
            // Ensure the game start timer is active
            TaskManager_1.TaskManager.submit(CastleWars_1.CastleWars.START_GAME_TASK);
        }
        var announcement = "Next Game Begins In: " + Misc_1.Misc.getSeconds(CastleWars_1.CastleWars.START_GAME_TASK.getRemainingTicks()) + " seconds.";
        player.getPacketSender().sendMessage(announcement);
        CastleWars_1.CastleWars.LOBBY_AREA.getLanthus().forceChat(announcement);
        // Equip the cape
        player.getEquipment().setItem(Equipment_1.Equipment.CAPE_SLOT, CastleWars_1.CastleWars.ZAMORAK_CAPE);
        player.getEquipment().refreshItems();
        player.getUpdateFlag().flag(Flag_1.Flag.APPEARANCE);
    };
    CastleWarsZamorakWaitingArea.prototype.postLeave = function (character, logout) {
        var player = character.getAsPlayer();
        if (!player) {
            return;
        }
        if (CastleWars_1.CastleWars.START_GAME_TASK.isRunning() && this.getPlayers().length === 0
            && CastleWars_1.CastleWars.SARADOMIN_WAITING_AREA.getPlayers().length === 0) {
            // Ensure the game start timer is cancelled
            TaskManager_1.TaskManager.cancelTasks(CastleWars_1.CastleWars.START_GAME_TASK);
        }
        if (logout) {
            // Player has logged out, teleport them to the lobby
            player.moveTo(new Location_1.Location(2439 + Misc_1.Misc.randoms(4), 3085 + Misc_1.Misc.randoms(5), 0));
        }
        if (player.getArea() !== CastleWars_1.CastleWars.GAME_AREA) {
            // Player has left and not went into the game area, remove cape & items
            CastleWars_1.CastleWars.deleteGameItems(player);
            player.resetAttributes();
        }
        // Remove the interface
        player.getPacketSender().sendWalkableInterface(-1);
        // TODO: Un-transform player if they were transformed
    };
    CastleWarsZamorakWaitingArea.prototype.handleObjectClick = function (player, objectId, type) {
        switch (objectId.getId()) {
            case ObjectIdentifiers_1.ObjectIdentifiers.PORTAL_9:
                player.moveTo(new Location_1.Location(2439 + Misc_1.Misc.randoms(4), 3085 + Misc_1.Misc.randoms(5), 0));
                return true;
        }
        return false;
    };
    CastleWarsZamorakWaitingArea.prototype.process = function (character) {
        var player = character.getAsPlayer();
        if (player == null) {
            return;
        }
        // Update the interface
        player.getPacketSender().sendString(CastleWars_1.CastleWars.START_GAME_TASK.isRunning() ?
            "Time until next game starts: " + Math.floor(CastleWars_1.CastleWars.START_GAME_TASK.getRemainingTicks())
            : "Waiting for players to join the other team.", 11480);
        // Send the interface
        player.getPacketSender().sendWalkableInterface(11479);
    };
    CastleWarsZamorakWaitingArea.prototype.canEquipItem = function (player, slot, item) {
        if (slot == Equipment_1.Equipment.CAPE_SLOT || slot == Equipment_1.Equipment.HEAD_SLOT) {
            player.getPacketSender().sendMessage("You can't remove your team's colours.");
            return false;
        }
        return true;
    };
    CastleWarsZamorakWaitingArea.prototype.canUnequipItem = function (player, slot, item) {
        if (slot == Equipment_1.Equipment.CAPE_SLOT || slot == Equipment_1.Equipment.HEAD_SLOT) {
            player.getPacketSender().sendMessage("You can't remove your team's colours.");
            return false;
        }
        return true;
    };
    CastleWarsZamorakWaitingArea.prototype.canPlayerBotIdle = function (playerBot) {
        // Allow the player bot to wait here if there are players in the other team
        return CastleWars_1.CastleWars.SARADOMIN_WAITING_AREA.getPlayers().length > 0;
    };
    return CastleWarsZamorakWaitingArea;
}(Area_1.Area));
exports.CastleWarsZamorakWaitingArea = CastleWarsZamorakWaitingArea;
//# sourceMappingURL=CastleWarsZamorakWaitingArea.js.map