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
exports.DuelArenaArea = void 0;
var TimerKey_1 = require("../../../../util/timers/TimerKey");
var Area_1 = require("../Area");
var Boundary_1 = require("../../Boundary");
var CombatFactory_1 = require("../../../content/combat/CombatFactory");
var Duelling_1 = require("../../../content/Duelling");
var DuelArenaArea = /** @class */ (function (_super) {
    __extends(DuelArenaArea, _super);
    function DuelArenaArea() {
        return _super.call(this, Array.of(new Boundary_1.Boundary(3326, 3383, 3197, 3295, 0))) || this;
    }
    DuelArenaArea.prototype.postEnter = function (character) {
        if (character.isPlayer()) {
            var player = character.getAsPlayer();
            player.getPacketSender().sendInteractionOption("Challenge", 1, false);
            player.getPacketSender().sendInteractionOption("null", 2, true);
        }
        if (character.isPlayerBot() && this.getPlayers().length == 0) {
            // Allow this PlayerBot to wait for players for 5 minutes
            character.getAsPlayerBot().getTimers().registerTimerKey(TimerKey_1.TimerKey.BOT_WAIT_FOR_PLAYERS);
        }
    };
    DuelArenaArea.prototype.postLeave = function (character, logout) {
        if (character.isPlayer()) {
            var player = character.getAsPlayer();
            if (player.getDueling().inDuel()) {
                player.getDueling().duelLost();
            }
            player.getPacketSender().sendInteractionOption("null", 2, true);
            player.getPacketSender().sendInteractionOption("null", 1, false);
            if (this.getPlayers().length == 0 && this.getPlayerBots().length > 0) {
                // Last player has left duel arena and there are bots
                this.getPlayerBots().forEach(function (pb) { return pb.getTimers().registerTimerKey(TimerKey_1.TimerKey.BOT_WAIT_FOR_PLAYERS); });
            }
        }
    };
    DuelArenaArea.prototype.process = function (character) {
    };
    DuelArenaArea.prototype.canTeleport = function (player) {
        if (player.getDueling().inDuel()) {
            return false;
        }
        return true;
    };
    DuelArenaArea.prototype.canAttack = function (character, target) {
        if (character.isPlayer() && target.isPlayer()) {
            var a = character.getAsPlayer();
            var t = target.getAsPlayer();
            if (a.getDueling().getState() == Duelling_1.DuelState.IN_DUEL && t.getDueling().getState() == Duelling_1.DuelState.IN_DUEL) {
                return CombatFactory_1.CanAttackResponse.CAN_ATTACK;
            }
            else if (a.getDueling().getState() == Duelling_1.DuelState.STARTING_DUEL
                || t.getDueling().getState() == Duelling_1.DuelState.STARTING_DUEL) {
                return CombatFactory_1.CanAttackResponse.DUEL_NOT_STARTED_YET;
            }
            return CombatFactory_1.CanAttackResponse.DUEL_WRONG_OPPONENT;
        }
        return CombatFactory_1.CanAttackResponse.CAN_ATTACK;
    };
    DuelArenaArea.prototype.canTrade = function (player, target) {
        if (player.getDueling().inDuel()) {
            return false;
        }
        return true;
    };
    DuelArenaArea.prototype.isMulti = function (character) {
        return true;
    };
    DuelArenaArea.prototype.canEat = function (player, itemId) {
        if (player.getDueling().inDuel() && player.getDueling().getRules()[Duelling_1.DuelRule.NO_FOOD.getConfigId()]) {
            return false;
        }
        return true;
    };
    DuelArenaArea.prototype.canDrink = function (player, itemId) {
        if (player.getDueling().inDuel() && player.getDueling().getRules()[Duelling_1.DuelRule.NO_POTIONS.getConfigId()]) {
            return false;
        }
        return true;
    };
    DuelArenaArea.dropItemsOnDeath = function (player, killer) {
        if (player.getDueling().inDuel()) {
            return false;
        }
        return true;
    };
    DuelArenaArea.prototype.handleDeath = function (player, killer) {
        if (player.getDueling().inDuel()) {
            player.getDueling().duelLost();
            return true;
        }
        return false;
    };
    DuelArenaArea.prototype.onPlayerRightClick = function (player, rightClicked, option) {
        if (option == 1) {
            if (player.busy()) {
                player.getPacketSender().sendMessage("You cannot do that right now.");
                return;
            }
            if (rightClicked.busy()) {
                player.getPacketSender().sendMessage("That player is currently busy.");
                return;
            }
            player.getDueling().requestDuel(rightClicked);
        }
    };
    DuelArenaArea.prototype.defeated = function (player, character) {
    };
    DuelArenaArea.prototype.handleObjectClick = function (player, objectId, type) {
        return false;
    };
    DuelArenaArea.prototype.canPlayerBotIdle = function (playerBot) {
        if (this.getPlayers().length > 0) {
            // Player bots can idle here if there are any real players here
            return true;
        }
        if (playerBot.getTimers().has(TimerKey_1.TimerKey.BOT_WAIT_FOR_PLAYERS)) {
            // Player bot can idle here while waiting for players
            return true;
        }
        return false;
    };
    return DuelArenaArea;
}(Area_1.Area));
exports.DuelArenaArea = DuelArenaArea;
//# sourceMappingURL=DuelArenaArea.js.map