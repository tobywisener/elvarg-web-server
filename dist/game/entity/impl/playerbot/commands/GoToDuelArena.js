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
exports.GoToDuelArena = void 0;
var TeleportHandler_1 = require("../../../../model/teleportation/TeleportHandler");
var TeleportType_1 = require("../../../../model/teleportation/TeleportType");
var Task_1 = require("../../../../task/Task");
var TaskManager_1 = require("../../../../task/TaskManager");
var CommandType_1 = require("./CommandType");
var Teleportable_1 = require("../../../../model/teleportation/Teleportable");
var GoToDuelArenaTask = /** @class */ (function (_super) {
    __extends(GoToDuelArenaTask, _super);
    function GoToDuelArenaTask(p, execFunc) {
        var _this = _super.call(this, 5, false) || this;
        _this.execFunc = execFunc;
        return _this;
    }
    GoToDuelArenaTask.prototype.execute = function () {
        this.execFunc();
        this.stop();
    };
    return GoToDuelArenaTask;
}(Task_1.Task));
var GoToDuelArena = /** @class */ (function () {
    function GoToDuelArena() {
    }
    GoToDuelArena.prototype.triggers = function () {
        return ["duel arena"];
    };
    GoToDuelArena.prototype.start = function (playerBot, args) {
        playerBot.sendChat("Going to Duel Arena - see ya soon!");
        var goToDuelArenaTask = new GoToDuelArenaTask(playerBot.getIndex(), function () { TeleportHandler_1.TeleportHandler.teleport(playerBot, Teleportable_1.Teleportable.DUEL_ARENA.getPosition(), TeleportType_1.TeleportType.NORMAL, false); });
        TaskManager_1.TaskManager.submit(goToDuelArenaTask);
        playerBot.stopCommand();
    };
    GoToDuelArena.prototype.stop = function (playerBot) {
    };
    GoToDuelArena.prototype.supportedTypes = function () {
        return [CommandType_1.CommandType.PUBLIC_CHAT, CommandType_1.CommandType.PRIVATE_CHAT, CommandType_1.CommandType.CLAN_CHAT];
    };
    return GoToDuelArena;
}());
exports.GoToDuelArena = GoToDuelArena;
//# sourceMappingURL=GoToDuelArena.js.map