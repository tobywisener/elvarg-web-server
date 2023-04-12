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
exports.GodwarsDungeonArea = void 0;
var GodwarsFollower_1 = require("../../../entity/impl/npc/impl/GodwarsFollower");
var Boundary_1 = require("../../../model/Boundary");
var Area_1 = require("../../../model/areas/Area");
var GodwarsDungeonArea = exports.GodwarsDungeonArea = /** @class */ (function (_super) {
    __extends(GodwarsDungeonArea, _super);
    function GodwarsDungeonArea() {
        return _super.call(this, [GodwarsDungeonArea.BOUNDARY]) || this;
    }
    GodwarsDungeonArea.prototype.postEnter = function (character) {
        if (character.isPlayer()) {
            var player = character.getAsPlayer();
            this.updateInterface(player);
            player.getPacketSender().sendWalkableInterface(42569);
        }
    };
    GodwarsDungeonArea.prototype.postLeave = function (character, logout) {
        if (character.isPlayer()) {
            var player = character.getAsPlayer();
            player.getPacketSender().sendWalkableInterface(-1);
            for (var i = 0; i < player.getGodwarsKillcount().length; i++) {
                player.setGodwarsKillcount(i, 0);
            }
            player.getPacketSender().sendMessage("Your Godwars killcount has been reset.");
        }
    };
    GodwarsDungeonArea.prototype.process = function (character) { };
    GodwarsDungeonArea.prototype.canTeleport = function (player) {
        return true;
    };
    GodwarsDungeonArea.prototype.canTrade = function (player, target) {
        return true;
    };
    GodwarsDungeonArea.prototype.isMulti = function (character) {
        return true;
    };
    GodwarsDungeonArea.prototype.canEat = function (player, itemId) {
        return true;
    };
    GodwarsDungeonArea.prototype.canDrink = function (player, itemId) {
        return true;
    };
    GodwarsDungeonArea.prototype.dropItemsOnDeath = function (player, killer) {
        return true;
    };
    GodwarsDungeonArea.prototype.handleDeath = function (player, killer) {
        return false;
    };
    GodwarsDungeonArea.prototype.onPlayerRightClick = function (player, rightClicked, option) { };
    GodwarsDungeonArea.prototype.defeated = function (player, character) {
        if (character instanceof GodwarsFollower_1.GodwarsFollower) {
            var gwdFoller = character;
            var index = gwdFoller.getGod().getItems();
            var current = player.getGodwarsKillcount().length;
            player.setGodwarsKillcount(index.length, current + 1);
            this.updateInterface(player);
        }
    };
    GodwarsDungeonArea.prototype.handleObjectClick = function (player, objectId, type) {
        return false;
    };
    GodwarsDungeonArea.prototype.updateInterface = function (player) {
        for (var i = 0; i < player.getGodwarsKillcount().length; i++) {
            player.getPacketSender().sendString(player.getGodwarsKillcount()[i].toString(), 42575 + i);
        }
    };
    GodwarsDungeonArea.BOUNDARY = new Boundary_1.Boundary(2800, 2950, 5200, 5400, 0);
    return GodwarsDungeonArea;
}(Area_1.Area));
//# sourceMappingURL=GodwarsDugeonArea.js.map