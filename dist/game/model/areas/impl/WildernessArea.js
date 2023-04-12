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
exports.WildernessArea = void 0;
var Boundary_1 = require("../../Boundary");
var Area_1 = require("../Area");
var BountyHunter_1 = require("../../../content/combat/bountyhunter/BountyHunter");
var Obelisks_1 = require("../../../content/Obelisks");
var CombatFactory_1 = require("../../../content/combat/CombatFactory");
var CombatFactory_2 = require("../../../content/combat/CombatFactory");
var PlayerRights_1 = require("../../rights/PlayerRights");
var WildernessArea = /** @class */ (function (_super) {
    __extends(WildernessArea, _super);
    function WildernessArea() {
        return _super.call(this, [
            new Boundary_1.Boundary(2940, 3392, 3525, 3968, 0),
            new Boundary_1.Boundary(2986, 3012, 10338, 10366, 0),
            new Boundary_1.Boundary(3653, 3720, 3441, 3538, 0),
            new Boundary_1.Boundary(3650, 3653, 3457, 3472, 0),
            new Boundary_1.Boundary(3150, 3199, 3796, 3869, 0),
            new Boundary_1.Boundary(2994, 3041, 3733, 3790, 0),
            new Boundary_1.Boundary(3061, 3074, 10253, 10262, 0),
        ]) || this;
    }
    WildernessArea.prototype.getName = function () {
        return "the Wilderness";
    };
    WildernessArea.getLevel = function (y) {
        return ((y > 6400 ? y - 6400 : y) - 3520 / 8) + 1;
    };
    WildernessArea.multi = function (x, y) {
        if ((x >= 3155 && y >= 3798) ||
            (x >= 3020 && x <= 3055 && y >= 3684 && y <= 3711) ||
            (x >= 3150 && x <= 3195 && y >= 2958 && y <= 3003) ||
            (x >= 3645 && x <= 3715 && y >= 3454 && y <= 3550) ||
            (x >= 3150 && x <= 3199 && y >= 3796 && y <= 3869) ||
            (x >= 2994 && x <= 3041 && y >= 3733 && y <= 3790) ||
            (x >= 3136 && x <= 3327 && y >= 3527 && y <= 3650)) {
            return true;
        }
        return false;
    };
    WildernessArea.prototype.postEnter = function (character) {
        if (character.isPlayer()) {
            var player = character.getAsPlayer();
            player.getPacketSender().sendInteractionOption("Attack", 2, true);
            player.getPacketSender().sendWalkableInterface(197);
            BountyHunter_1.BountyHunter.updateInterface(player);
            if (!BountyHunter_1.BountyHunter.PLAYERS_IN_WILD.includes(player)) {
                BountyHunter_1.BountyHunter.PLAYERS_IN_WILD.push(player);
            }
        }
    };
    WildernessArea.prototype.postLeave = function (character, logout) {
        if (character.isPlayer()) {
            var player = character.getAsPlayer();
            player.getPacketSender().sendWalkableInterface(-1);
            player.getPacketSender().sendInteractionOption("null", 2, true);
            player.getPacketSender().sendWalkableInterface(-1);
            player.setWildernessLevel(0);
            BountyHunter_1.BountyHunter.PLAYERS_IN_WILD.splice(BountyHunter_1.BountyHunter.PLAYERS_IN_WILD.indexOf(player), 1);
        }
    };
    WildernessArea.prototype.process = function (character) {
        if (character.isPlayer()) {
            var player = character.getAsPlayer();
            player.setWildernessLevel(WildernessArea.getLevel(player.getLocation().getY()));
            player.getPacketSender().sendString("Level: " + player.getWildernessLevel(), 199);
        }
    };
    WildernessArea.prototype.canTeleport = function (player) {
        if (player.getWildernessLevel() > 20 && player.getRights() != PlayerRights_1.PlayerRights.DEVELOPER) {
            player.getPacketSender().sendMessage("Teleport spells are blocked in this level of Wilderness.");
            player.getPacketSender().sendMessage("You must be below level 20 of Wilderness to use teleportation spells.");
            return false;
        }
        return true;
    };
    WildernessArea.prototype.canAttack = function (attacker, target) {
        if (attacker.isPlayer() && target.isPlayer()) {
            var a = attacker.getAsPlayer();
            var t = target.getAsPlayer();
            var combatDifference = CombatFactory_1.CombatFactory.combatLevelDifference(a.getSkillManager().getCombatLevel(), t.getSkillManager().getCombatLevel());
            if (combatDifference > a.getWildernessLevel() + 5 || combatDifference > t.getWildernessLevel() + 5) {
                return CombatFactory_2.CanAttackResponse.LEVEL_DIFFERENCE_TOO_GREAT;
            }
            if (!(t.getArea() instanceof WildernessArea)) {
                return CombatFactory_2.CanAttackResponse.CANT_ATTACK_IN_AREA;
            }
        }
        return CombatFactory_2.CanAttackResponse.CAN_ATTACK;
    };
    WildernessArea.prototype.canTrade = function (player, target) {
        return true;
    };
    WildernessArea.prototype.isMulti = function (character) {
        var x = character.getLocation().getX();
        var y = character.getLocation().getY();
        return WildernessArea.multi(x, y);
    };
    WildernessArea.prototype.canEat = function (player, itemId) {
        return true;
    };
    WildernessArea.prototype.canDrink = function (player, itemId) {
        return true;
    };
    WildernessArea.prototype.dropItemsOnDeath = function (player, killer) {
        return true;
    };
    WildernessArea.prototype.handleDeath = function (player, killer) {
        return false;
    };
    WildernessArea.prototype.onPlayerRightClick = function (player, rightClicked, option) {
    };
    WildernessArea.prototype.defeated = function (player, character) {
        if (character.isPlayer()) {
            BountyHunter_1.BountyHunter.onDeath(player, character.getAsPlayer(), true, 50);
        }
    };
    WildernessArea.prototype.overridesNpcAggressionTolerance = function (player, npcId) {
        return true;
    };
    WildernessArea.prototype.handleObjectClick = function (player, objectId, type) {
        if (Obelisks_1.Obelisks.activate(objectId.getId())) {
            return true;
        }
        return false;
    };
    WildernessArea.prototype.canPlayerBotIdle = function (playerBot) {
        // Player Bots can always idle in the Wilderness
        return true;
    };
    return WildernessArea;
}(Area_1.Area));
exports.WildernessArea = WildernessArea;
//# sourceMappingURL=WildernessArea.js.map