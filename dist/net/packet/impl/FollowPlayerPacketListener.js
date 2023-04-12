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
exports.FollowPlayerPacketListener = void 0;
var World_1 = require("../../../game/World");
var TaskManager_1 = require("../../../game/task/TaskManager");
var Task_1 = require("../../../game/task/Task");
var PathFinder_1 = require("../../../game/model/movement/path/PathFinder");
var Location_1 = require("../../../game/model/Location");
var FollowPlayerPacketListener = /** @class */ (function () {
    function FollowPlayerPacketListener() {
    }
    FollowPlayerPacketListener.prototype.execute = function (player, packet) {
        if (player.busy()) {
            return;
        }
        TaskManager_1.TaskManager.cancelTasks(player.getIndex());
        var otherPlayersIndex = packet.readLEShort();
        if (otherPlayersIndex < 0 || otherPlayersIndex > World_1.World.getPlayers().capacityReturn())
            return;
        var leader = World_1.World.getPlayers().get(otherPlayersIndex);
        if (leader == null) {
            return;
        }
        FollowPlayerPacketListener.follow(player, leader);
    };
    FollowPlayerPacketListener.follow = function (player, leader) {
        var mobility = player.getMovementQueue().getMobility();
        if (!mobility.canMove()) {
            mobility.sendMessage(player);
            player.getMovementQueue().reset();
            return;
        }
        player.getMovementQueue().reset();
        player.getMovementQueue().walkToReset();
        player.setFollowing(leader);
        player.setMobileInteraction(leader);
    };
    return FollowPlayerPacketListener;
}());
exports.FollowPlayerPacketListener = FollowPlayerPacketListener;
var FollowTask = /** @class */ (function (_super) {
    __extends(FollowTask, _super);
    function FollowTask(player, leader) {
        var _this = _super.call(this, 1, player.getIndex(), true) || this;
        _this.player = player;
        _this.leader = leader;
        return _this;
    }
    FollowTask.prototype.execute = function () {
        if (this.player.getFollowing() == null) {
            this.player.setPositionToFace(null);
            this.stop();
            return;
        }
        if (this.leader.isTeleportingReturn() || !this.leader.getLocation().isWithinDistance(this.player.getLocation(), 15)) {
            this.player.setPositionToFace(null);
            this.stop();
            return;
        }
        var destX = this.leader.getMovementQueue().followX;
        var destY = this.leader.getMovementQueue().followY;
        if ((destX === -1 && destY === -1) || this.player.getLocation().equals(new Location_1.Location(destX, destY))) {
            return;
        }
        this.player.getMovementQueue().reset();
        this.player.setPositionToFace(this.leader.getLocation());
        this.player.setMobileInteraction(this.leader);
        PathFinder_1.PathFinder.calculateWalkRoute(this.player, destX, destY);
    };
    return FollowTask;
}(Task_1.Task));
//# sourceMappingURL=FollowPlayerPacketListener.js.map