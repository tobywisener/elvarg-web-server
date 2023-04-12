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
exports.PlayCastleWars = void 0;
var Equipment_1 = require("../../../../model/container/impl/Equipment");
var TaskManager_1 = require("../../../../task/TaskManager");
var Task_1 = require("../../../../task/Task");
var Animation_1 = require("../../../../model/Animation");
var CommandType_1 = require("./CommandType");
var CastleWars_1 = require("../../../../content/minigames/impl/CastleWars");
var CastleWars_2 = require("../../../../content/minigames/impl/CastleWars");
var PlayCastleWarsTask = /** @class */ (function (_super) {
    __extends(PlayCastleWarsTask, _super);
    function PlayCastleWarsTask(p, exeFunc) {
        var _this = _super.call(this, 5, false) || this;
        _this.exeFunc = exeFunc;
        return _this;
    }
    PlayCastleWarsTask.prototype.execute = function () {
        this.exeFunc();
        this.stop();
    };
    return PlayCastleWarsTask;
}(Task_1.Task));
var PlayCastleWars = exports.PlayCastleWars = /** @class */ (function () {
    function PlayCastleWars() {
    }
    PlayCastleWars.prototype.triggers = function () {
        return ["castlewars", " cw"];
    };
    PlayCastleWars.prototype.start = function (playerBot, args) {
        // Remove head and cape
        playerBot.getEquipment().set(Equipment_1.Equipment.CAPE_SLOT, Equipment_1.Equipment.NO_ITEM);
        playerBot.getEquipment().set(Equipment_1.Equipment.HEAD_SLOT, Equipment_1.Equipment.NO_ITEM);
        playerBot.updateLocalPlayers();
        playerBot.sendChat("Going to play Castlewars, BRB!");
        playerBot.performAnimation(PlayCastleWars.WAVE_ANIM);
        TaskManager_1.TaskManager.submit(new PlayCastleWarsTask(playerBot.getIndex(), function () { return CastleWars_1.CastleWars.addToWaitingRoom(playerBot, CastleWars_2.Team.GUTHIX); }));
    };
    PlayCastleWars.prototype.stop = function (playerBot) {
        playerBot.getCombatInteraction().reset();
    };
    PlayCastleWars.prototype.supportedTypes = function () {
        return [CommandType_1.CommandType.PUBLIC_CHAT, CommandType_1.CommandType.PRIVATE_CHAT, CommandType_1.CommandType.CLAN_CHAT];
    };
    PlayCastleWars.WAVE_ANIM = new Animation_1.Animation(863);
    return PlayCastleWars;
}());
//# sourceMappingURL=PlayCastleWars.js.map