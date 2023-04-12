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
exports.CastleWarsGameArea = void 0;
var CastleWars_1 = require("../../../../content/minigames/impl/CastleWars");
var Area_1 = require("../../Area");
var Boundary_1 = require("../../../Boundary");
var PolygonalBoundary_1 = require("../../../PolygonalBoundary");
var Equipment_1 = require("../../../container/impl/Equipment");
var CastleWars_2 = require("../../../../content/minigames/impl/CastleWars");
var ObjectIdentifiers_1 = require("../../../../../util/ObjectIdentifiers");
var Location_1 = require("../../../Location");
var Flag_1 = require("../../../Flag");
var StatementDialogue_1 = require("../../../dialogues/entries/impl/StatementDialogue");
var CastleWarsGameArea = exports.CastleWarsGameArea = /** @class */ (function (_super) {
    __extends(CastleWarsGameArea, _super);
    function CastleWarsGameArea() {
        // Merge the Dungeon boundaries and the game surface area polygonal boundary
        return _super.call(this, CastleWarsGameArea.DUNGEON_BOUNDARIES.concat(CastleWarsGameArea.GAME_SURFACE_BOUNDARY)) || this;
    }
    CastleWarsGameArea.prototype.getName = function () {
        return "the Castle Wars Minigame";
    };
    CastleWarsGameArea.prototype.process = function (character) {
        var player = character.getAsPlayer();
        if (!player) {
            return;
        }
        var config;
        player.getPacketSender().sendWalkableInterface(11146);
        player.getPacketSender().sendString("Zamorak = " + CastleWars_2.Team.ZAMORAK.getScore(), 11147);
        player.getPacketSender().sendString(CastleWars_2.Team.SARADOMIN.getScore() + " = Saradomin", 11148);
        player.getPacketSender().sendString(CastleWars_1.CastleWars.START_GAME_TASK.getRemainingTicks() + " ticks", 11155);
        config = 2097152 * CastleWars_1.CastleWars.saraFlag;
        player.getPacketSender().sendToggle(378, config);
        config = 2097152 * CastleWars_1.CastleWars.zammyFlag; // flags 0 = safe 1 = taken 2 = dropped
        player.getPacketSender().sendToggle(377, config);
    };
    CastleWarsGameArea.prototype.postLeave = function (character, logout) {
        var player = character.getAsPlayer();
        if (!player) {
            return;
        }
        CastleWars_2.Team.removePlayer(player);
        if (this.getPlayers.length < 2 || (CastleWars_2.Team.ZAMORAK.getPlayers().length === 0 ||
            CastleWars_2.Team.SARADOMIN.getPlayers().length === 0)) {
            // If either team has no players left, the game must end
            CastleWars_1.CastleWars.endGame();
        }
        if (logout) {
            // Player has logged out, teleport them to the lobby
            player.moveTo(new Location_1.Location(2440, 3089, 0));
        }
        // Remove items
        CastleWars_1.CastleWars.deleteGameItems(player);
        // Remove the cape
        player.getEquipment().setItem(Equipment_1.Equipment.CAPE_SLOT, Equipment_1.Equipment.NO_ITEM);
        player.getEquipment().refreshItems();
        player.getUpdateFlag().flag(Flag_1.Flag.APPEARANCE);
        // Remove the interface
        player.getPacketSender().sendWalkableInterface(-1);
        player.getPacketSender().sendEntityHintRemoval(true);
    };
    CastleWarsGameArea.prototype.canPlayerBotIdle = function (playerBot) {
        // Allow Player Bots to idle here
        return true;
    };
    CastleWarsGameArea.prototype.canEquipItem = function (player, slot, item) {
        if (slot === Equipment_1.Equipment.CAPE_SLOT || slot === Equipment_1.Equipment.HEAD_SLOT) {
            player.getPacketSender().sendMessage("You can't remove your team's colours.");
            return false;
        }
        return true;
    };
    CastleWarsGameArea.prototype.canUnequipItem = function (player, slot, item) {
        if (slot == Equipment_1.Equipment.CAPE_SLOT || slot == Equipment_1.Equipment.HEAD_SLOT) {
            player.getPacketSender().sendMessage("You can't remove your team's colours.");
            return false;
        }
        return true;
    };
    CastleWarsGameArea.prototype.handleObjectClick = function (player, objectId, type) {
        switch (objectId.getId()) {
            case ObjectIdentifiers_1.ObjectIdentifiers.PORTAL_10: // Portals in team respawn room
            case ObjectIdentifiers_1.ObjectIdentifiers.PORTAL_11:
                player.moveTo(new Location_1.Location(2440, 3089, 0));
                player.getPacketSender().sendMessage("The Castle Wars game has ended for you!");
                return true;
            case ObjectIdentifiers_1.ObjectIdentifiers.SARADOMIN_STANDARD_2:
            case 4377:
                var team = CastleWars_2.Team.getTeamForPlayer(player);
                if (team == null) {
                    return true;
                }
                switch (team) {
                    case CastleWars_2.Team.SARADOMIN:
                        CastleWars_1.CastleWars.returnFlag(player, player.getEquipment().getSlot(Equipment_1.Equipment.WEAPON_SLOT));
                        return true;
                    case CastleWars_2.Team.ZAMORAK:
                        CastleWars_1.CastleWars.captureFlag(player, team);
                        return true;
                }
                return true;
            case ObjectIdentifiers_1.ObjectIdentifiers.ZAMORAK_STANDARD_2: // zammy flag
            case 4378:
                team = CastleWars_2.Team.getTeamForPlayer(player);
                if (team == null) {
                    return true;
                }
                switch (team) {
                    case CastleWars_2.Team.SARADOMIN:
                        CastleWars_1.CastleWars.captureFlag(player, team);
                        return true;
                    case CastleWars_2.Team.ZAMORAK:
                        CastleWars_1.CastleWars.returnFlag(player, player.getEquipment().getSlot(Equipment_1.Equipment.WEAPON_SLOT));
                        return true;
                }
                return true;
            case ObjectIdentifiers_1.ObjectIdentifiers.TRAPDOOR_16: // Trap door into saradomin spawn point
                if (CastleWars_2.Team.getTeamForPlayer(player) == CastleWars_2.Team.ZAMORAK) {
                    player.getPacketSender().sendMessage("You are not allowed in the other teams spawn point.");
                    return true;
                }
                player.moveTo(new Location_1.Location(2429, 3075, 1));
                return true;
            case ObjectIdentifiers_1.ObjectIdentifiers.TRAPDOOR_17: // Trap door into saradomin spawn point
                if (CastleWars_2.Team.getTeamForPlayer(player) == CastleWars_2.Team.SARADOMIN) {
                    player.getPacketSender().sendMessage("You are not allowed in the other teams spawn point.");
                    return true;
                }
                player.moveTo(new Location_1.Location(2370, 3132, 1));
                return true;
        }
        return false;
    };
    CastleWarsGameArea.prototype.canTeleport = function (player) {
        StatementDialogue_1.StatementDialogue.send(player, "You can't leave just like that!");
        return false;
    };
    CastleWarsGameArea.prototype.handleDeath = function (player, kill) {
        var team = CastleWars_2.Team.getTeamForPlayer(player);
        if (team == null) {
            console.error("no team for " + player.getUsername());
            return false;
        }
        /** Respawns them in any free tile within the starting room **/
        CastleWars_1.CastleWars.dropFlag(player, team);
        player.smartMove(team.respawn_area_bounds);
        player.castlewarsDeaths++;
        if (!kill)
            return true;
        var killer = kill;
        killer.castlewarsKills++;
        return true;
    };
    CastleWarsGameArea.DUNGEON_BOUNDARIES = [
        new Boundary_1.Boundary(2365, 2404, 9500, 9530, 0),
        new Boundary_1.Boundary(2394, 2431, 9474, 9499, 0),
        new Boundary_1.Boundary(2405, 2424, 9500, 9509, 0)
    ];
    CastleWarsGameArea.GAME_SURFACE_BOUNDARY = new PolygonalBoundary_1.PolygonalBoundary([
        [2377, 3079],
        [2368, 3079],
        [2368, 3136],
        [2416, 3136],
        [2432, 3120],
        [2432, 3080],
        [2432, 3072],
        [2384, 3072]
    ]);
    return CastleWarsGameArea;
}(Area_1.Area));
//# sourceMappingURL=CastleWarsGameArea.js.map