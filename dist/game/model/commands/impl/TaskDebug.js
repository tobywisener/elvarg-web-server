"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskDebug = void 0;
var PlayerRights_1 = require("../../../model/rights/PlayerRights");
var TaskManager_1 = require("../../../task/TaskManager");
var TaskDebug = /** @class */ (function () {
    function TaskDebug() {
    }
    TaskDebug.prototype.execute = function (player, command, parts) {
        player.getPacketSender().sendMessage("Active tasks :" + TaskManager_1.TaskManager.getTaskAmount() + ".");
    };
    TaskDebug.prototype.canUse = function (player) {
        var rights = player.getRights();
        return (rights == PlayerRights_1.PlayerRights.OWNER || rights == PlayerRights_1.PlayerRights.DEVELOPER);
    };
    return TaskDebug;
}());
exports.TaskDebug = TaskDebug;
//# sourceMappingURL=TaskDebug.js.map