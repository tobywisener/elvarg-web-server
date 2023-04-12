"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameSyncTask = void 0;
var World_1 = require("../../../World");
var GameSyncTask = /** @class */ (function () {
    function GameSyncTask(players, concurrent) {
        this.players = players;
        this.concurrent = concurrent;
        this.players = true;
    }
    GameSyncTask.prototype.checkIndex = function (index) {
        return (this.players ? World_1.World.getPlayers().get(index) != null : World_1.World.getNpcs().get(index) != null);
    };
    GameSyncTask.prototype.getAmount = function () {
        return (this.players ? World_1.World.getPlayers().sizeReturn() : World_1.World.getNpcs().sizeReturn());
    };
    GameSyncTask.prototype.getCapacity = function () {
        return (this.players ? World_1.World.getPlayers().capacityReturn() : World_1.World.getNpcs().capacityReturn());
    };
    GameSyncTask.prototype.isConcurrent = function () {
        return this.concurrent;
    };
    return GameSyncTask;
}());
exports.GameSyncTask = GameSyncTask;
//# sourceMappingURL=GameSyncTask.js.map