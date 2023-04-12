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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateServer = exports.UpdateTask = void 0;
var Server_1 = require("../../../../Server");
var World_1 = require("../../../World");
var TaskManager_1 = require("../../../task/TaskManager");
var Task_1 = require("../../../task/Task");
var ClanChatManager_1 = require("../../../content/clan/ClanChatManager");
var PlayerRights_1 = require("../../rights/PlayerRights");
var UpdateTask = /** @class */ (function (_super) {
    __extends(UpdateTask, _super);
    function UpdateTask(p, execFunc) {
        var _this = _super.call(this, p) || this;
        _this.execFunc = execFunc;
        return _this;
    }
    UpdateTask.prototype.execute = function () {
        this.execFunc();
        this.stop();
    };
    return UpdateTask;
}(Task_1.Task));
exports.UpdateTask = UpdateTask;
var UpdateServer = /** @class */ (function () {
    function UpdateServer() {
    }
    UpdateServer.prototype.execute = function (player, command, parts) {
        var e_1, _a;
        var time = parseInt(parts[1]);
        if (time > 0) {
            Server_1.Server.setUpdating(true);
            try {
                for (var _b = __values(World_1.World.getPlayers()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var players = _c.value;
                    if (!players) {
                        continue;
                    }
                    players.getPacketSender().sendSystemUpdate(time);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            TaskManager_1.TaskManager.submit(new UpdateTask(time, function () {
                var e_2, _a;
                try {
                    for (var _b = __values(World_1.World.getPlayers()), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var player_1 = _c.value;
                        if (player_1 != null) {
                            player_1.requestLogout();
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                ClanChatManager_1.ClanChatManager.save();
                Server_1.Server.getLogger().info("Update task finished!");
            }));
        }
    };
    UpdateServer.prototype.canUse = function (player) {
        var rights = player.getRights();
        return (rights == PlayerRights_1.PlayerRights.OWNER || rights == PlayerRights_1.PlayerRights.DEVELOPER);
    };
    return UpdateServer;
}());
exports.UpdateServer = UpdateServer;
//# sourceMappingURL=UpdateServer.js.map