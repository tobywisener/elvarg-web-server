"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Area = void 0;
var CombatFactory_1 = require("../../content/combat/CombatFactory");
var Area = /** @class */ (function () {
    function Area(boundaries) {
        this.npcs = {};
        this.players = {};
        this.playerBots = {};
        this.boundaries = boundaries;
    }
    Area.prototype.isSpellDisabled = function (player, spellbook, spellId) {
        return false;
    };
    Area.prototype.enter = function (character) {
        if (character.isPlayerBot()) {
            this.playerBots[character.getIndex()] = character.getAsPlayerBot();
        }
        if (character.isPlayer()) {
            this.players[character.getIndex()] = character.getAsPlayer();
        }
        else if (character.isNpc()) {
            this.npcs[character.getIndex()] = character.getAsNpc();
        }
        this.postEnter(character);
    };
    Area.prototype.postEnter = function (character) { };
    Area.prototype.leave = function (character, logout) {
        if (character.isPlayerBot()) {
            delete this.playerBots[character.getIndex()];
        }
        if (character.isPlayer()) {
            delete this.players[character.getIndex()];
        }
        else if (character.isNpc()) {
            delete this.npcs[character.getIndex()];
        }
        this.postLeave(character, logout);
    };
    Area.prototype.postLeave = function (character, logout) { };
    Area.prototype.process = function (character) {
        // By default, do nothing in process.
    };
    Area.prototype.canTeleport = function (player) {
        // By default, Areas allow teleporting unless otherwise specified.
        return true;
    };
    Area.prototype.canAttack = function (attacker, target) {
        if (attacker.isPlayer() && target.isPlayer()) {
            return CombatFactory_1.CanAttackResponse.CANT_ATTACK_IN_AREA;
        }
        return CombatFactory_1.CanAttackResponse.CAN_ATTACK;
    };
    Area.prototype.canPlayerBotIdle = function (playerBot) {
        return false;
    };
    Area.prototype.defeated = function (player, character) {
        // By default, do nothing when a player is defeated.
    };
    Area.prototype.canTrade = function (player, target) {
        // By default, allow Players to trade in an Area.
        return true;
    };
    Area.prototype.isMulti = function (character) {
        // By default, Areas are single combat.
        return false;
    };
    Area.prototype.canEat = function (player, itemId) {
        // By default, players can eat in an Area.
        return true;
    };
    Area.prototype.canDrink = function (player, itemId) {
        // By default, players can drink in an Area.
        return true;
    };
    Area.prototype.dropItemsOnDeath = function (player, killer) {
        // By default, players will drop items in an Area.
        return true;
    };
    Area.prototype.handleDeath = function (player, killer) {
        // By default, players Death will be handled by the main death handler.
        return false;
    };
    Area.prototype.onPlayerRightClick = function (player, rightClicked, option) {
        // By default, players will have the default right click in Areas.
    };
    Area.prototype.handleObjectClick = function (player, objectId, type) {
        // By default, Areas don't need to handle any specific object clicking.
        return false;
    };
    Area.prototype.overridesNpcAggressionTolerance = function (player, npcId) {
        // By default, NPC tolerance works normally in Areas.
        return false;
    };
    Area.prototype.canEquipItem = function (player, slot, item) {
        // By default, Players can equip items in all areas
        return true;
    };
    Area.prototype.canUnequipItem = function (player, slot, item) {
        // By default, Players can unequip items in all areas
        return true;
    };
    Area.prototype.getBoundaries = function () {
        return this.boundaries;
    };
    Area.prototype.getName = function () {
        return this.constructor.name;
    };
    Area.prototype.getNpcs = function () {
        return Object.values(this.npcs);
    };
    Area.prototype.getPlayers = function () {
        return Object.values(this.players);
    };
    Area.prototype.getPlayerBots = function () {
        return Object.values(this.playerBots);
    };
    return Area;
}());
exports.Area = Area;
//# sourceMappingURL=Area.js.map