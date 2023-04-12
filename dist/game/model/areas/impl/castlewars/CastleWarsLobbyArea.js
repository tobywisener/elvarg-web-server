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
exports.CastleWarsLobbyArea = void 0;
var CastleWars_1 = require("../../../../content/minigames/impl/CastleWars");
var Boundary_1 = require("../../../../model/Boundary");
var Area_1 = require("../../../../model/areas/Area");
var ObjectIdentifiers_1 = require("../../../../../util/ObjectIdentifiers");
var CastleWars_2 = require("../../../../content/minigames/impl/CastleWars");
var CastleWarsLobbyArea = /** @class */ (function (_super) {
    __extends(CastleWarsLobbyArea, _super);
    function CastleWarsLobbyArea() {
        return _super.call(this, [new Boundary_1.Boundary(2435, 2446, 3081, 3098, 0)]) || this;
    }
    CastleWarsLobbyArea.prototype.getName = function () {
        return "the Castle Wars Lobby";
    };
    CastleWarsLobbyArea.prototype.handleObjectClick = function (player, objectId, type) {
        switch (objectId.getId()) {
            case ObjectIdentifiers_1.ObjectIdentifiers.ZAMORAK_PORTAL:
                CastleWars_1.CastleWars.addToWaitingRoom(player, CastleWars_2.Team.ZAMORAK);
                return true;
            case ObjectIdentifiers_1.ObjectIdentifiers.SARADOMIN_PORTAL:
                CastleWars_1.CastleWars.addToWaitingRoom(player, CastleWars_2.Team.SARADOMIN);
                return true;
            case ObjectIdentifiers_1.ObjectIdentifiers.GUTHIX_PORTAL:
                CastleWars_1.CastleWars.addToWaitingRoom(player, CastleWars_2.Team.GUTHIX);
                return true;
            case ObjectIdentifiers_1.ObjectIdentifiers.BANK_CHEST_2:
                if (type === 1) {
                    player.getBank(player.getCurrentBankTab()).open();
                }
                else {
                    player.getPacketSender().sendMessage("The Grand Exchange is not available yet.");
                }
                return true;
        }
        return false;
    };
    CastleWarsLobbyArea.prototype.canPlayerBotIdle = function (playerBot) {
        // Allow Player Bots to idle here
        return true;
    };
    CastleWarsLobbyArea.prototype.getLanthus = function () {
        return this.lanthus;
    };
    CastleWarsLobbyArea.prototype.setLanthus = function (lanthus) {
        this.lanthus = lanthus;
    };
    return CastleWarsLobbyArea;
}(Area_1.Area));
exports.CastleWarsLobbyArea = CastleWarsLobbyArea;
//# sourceMappingURL=CastleWarsLobbyArea.js.map