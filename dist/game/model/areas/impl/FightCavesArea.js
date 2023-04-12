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
exports.FightCavesArea = void 0;
var Boundary_1 = require("../../../model/Boundary");
var Item_1 = require("../../../model/Item");
var FightCaves_1 = require("../../../content/minigames/impl/FightCaves");
var PrivateArea_1 = require("../impl/PrivateArea");
var NpcIdentifiers_1 = require("../../../../util/NpcIdentifiers");
var FightCavesArea = exports.FightCavesArea = /** @class */ (function (_super) {
    __extends(FightCavesArea, _super);
    function FightCavesArea() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FightCavesArea.prototype.postLeave = function (mobile, logout) {
        if (mobile.isPlayer() && logout) {
            mobile.moveTo(FightCaves_1.FightCaves.EXIT);
        }
    };
    FightCavesArea.prototype.process = function (mobile) { };
    FightCavesArea.prototype.canTeleport = function (player) {
        return false;
    };
    FightCavesArea.prototype.canTrade = function (player, target) {
        return false;
    };
    FightCavesArea.prototype.isMulti = function (character) {
        return true;
    };
    FightCavesArea.prototype.canEat = function (player, itemId) {
        return true;
    };
    FightCavesArea.prototype.canDrink = function (player, itemId) {
        return true;
    };
    FightCavesArea.prototype.dropItemsOnDeath = function (player, killer) {
        return false;
    };
    FightCavesArea.prototype.handleDeath = function (player, killer) {
        player.moveTo(FightCaves_1.FightCaves.EXIT);
        //DialogueManager.start(player, 24);
        return true;
    };
    FightCavesArea.prototype.onPlayerRightClick = function (player, rightClicked, option) { };
    FightCavesArea.prototype.defeated = function (player, character) {
        if (character.isNpc()) {
            var npc = character.getAsNpc();
            if (npc.getId() === NpcIdentifiers_1.NpcIdentifiers.TZTOK_JAD) {
                player.getInventory().forceAdd(player, new Item_1.Item(6570, 1));
                player.resetAttributes();
                player.getCombat().reset();
                player.moveTo(FightCaves_1.FightCaves.EXIT);
                //DialogueManager.start(player, 25);
            }
        }
    };
    FightCavesArea.prototype.overridesNpcAggressionTolerance = function (player, npcId) {
        return true;
    };
    FightCavesArea.prototype.handleObjectClick = function (player, objectId, type) {
        return false;
    };
    FightCavesArea.BOUNDARY = new Boundary_1.Boundary(2368, 5056, 2431, 5119, 0);
    return FightCavesArea;
}(PrivateArea_1.PrivateArea));
//# sourceMappingURL=FightCavesArea.js.map