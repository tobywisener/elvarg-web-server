"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovementInteraction = exports.InteractionState = void 0;
var RegionManager_1 = require("../../../../collision/RegionManager");
var CombatFactory_1 = require("../../../../content/combat/CombatFactory");
var Location_1 = require("../../../../model/Location");
var MovementQueue_1 = require("../../../../model/movement/MovementQueue");
var TeleportHandler_1 = require("../../../../model/teleportation/TeleportHandler");
var TeleportType_1 = require("../../../../model/teleportation/TeleportType");
var Misc_1 = require("../../../../../util/Misc");
var InteractionState;
(function (InteractionState) {
    InteractionState[InteractionState["IDLE"] = 0] = "IDLE";
    // Performing a job for a player
    InteractionState[InteractionState["COMMAND"] = 1] = "COMMAND";
})(InteractionState = exports.InteractionState || (exports.InteractionState = {}));
var MovementInteraction = /** @class */ (function () {
    function MovementInteraction(_playerBot) {
        this.playerBot = _playerBot;
    }
    MovementInteraction.prototype.process = function () {
        if (this.mobile.getMovementQueue().getMobility().canMove() || this.player.busy()) {
            return;
        }
        switch (this.playerBot.getCurrentState()) {
            case InteractionState.COMMAND:
                // Player Bot is currently busy, do nothing
                return;
            case InteractionState.IDLE:
                if (CombatFactory_1.CombatFactory.inCombat(this.playerBot) || this.player.getDueling().inDuel()) {
                    return;
                }
                // Player bot is idle, let it walk somewhere random
                if (!this.playerBot.getMovementQueue().isMovings()) {
                    if (Misc_1.Misc.getRandom(9) <= 1) {
                        var pos = this.generateLocalPosition();
                        if (pos != null) {
                            MovementQueue_1.MovementQueue.randomClippedStep(this.playerBot, 1);
                        }
                    }
                }
                if (this.playerBot.getArea() != null && this.playerBot.getArea().canPlayerBotIdle(this.playerBot)) {
                    break;
                }
                if (this.playerBot.getLocation().getDistance(this.playerBot.getDefinition().getSpawnLocation()) > 20) {
                    // Bot is far away, teleport back to original location
                    TeleportHandler_1.TeleportHandler.teleport(this.playerBot, this.playerBot.getDefinition().getSpawnLocation(), TeleportType_1.TeleportType.NORMAL, false);
                }
                break;
        }
    };
    MovementInteraction.prototype.generateLocalPosition = function () {
        var dir = -1;
        var x = 0, y = 0;
        if (!RegionManager_1.RegionManager.blockedNorth(this.playerBot.getLocation(), this.playerBot.getPrivateArea())) {
            dir = 0;
        }
        else if (!RegionManager_1.RegionManager.blockedEast(this.playerBot.getLocation(), this.playerBot.getPrivateArea())) {
            dir = 4;
        }
        else if (!RegionManager_1.RegionManager.blockedSouth(this.playerBot.getLocation(), this.playerBot.getPrivateArea())) {
            dir = 8;
        }
        else if (!RegionManager_1.RegionManager.blockedWest(this.playerBot.getLocation(), this.playerBot.getPrivateArea())) {
            dir = 12;
        }
        var random = Misc_1.Misc.getRandom(3);
        var found = false;
        if (random == 0) {
            if (!RegionManager_1.RegionManager.blockedNorth(this.playerBot.getLocation(), this.playerBot.getPrivateArea())) {
                y = 1;
                found = true;
            }
        }
        else if (random == 1) {
            if (!RegionManager_1.RegionManager.blockedEast(this.playerBot.getLocation(), this.playerBot.getPrivateArea())) {
                x = 1;
                found = true;
            }
        }
        else if (random == 2) {
            if (!RegionManager_1.RegionManager.blockedSouth(this.playerBot.getLocation(), this.playerBot.getPrivateArea())) {
                y = -1;
                found = true;
            }
        }
        else if (random == 3) {
            if (!RegionManager_1.RegionManager.blockedWest(this.playerBot.getLocation(), this.playerBot.getPrivateArea())) {
                x = -1;
                found = true;
            }
        }
        if (!found) {
            if (dir == 0) {
                y = 1;
            }
            else if (dir == 4) {
                x = 1;
            }
            else if (dir == 8) {
                y = -1;
            }
            else if (dir == 12) {
                x = -1;
            }
        }
        if (x == 0 && y == 0)
            return null;
        var spawnX = this.playerBot.getSpawnPosition().getX();
        var spawnY = this.playerBot.getSpawnPosition().getY();
        if (x == 1) {
            if (this.playerBot.getLocation().getX() + x > spawnX + 1)
                return null;
        }
        if (x == -1) {
            if (this.playerBot.getLocation().getX() - x < spawnX - 1)
                return null;
        }
        if (y == 1) {
            if (this.playerBot.getLocation().getY() + y > spawnY + 1)
                return null;
        }
        if (y == -1) {
            if (this.playerBot.getLocation().getY() - y < spawnY - 1)
                return null;
        }
        return new Location_1.Location(x, y);
    };
    return MovementInteraction;
}());
exports.MovementInteraction = MovementInteraction;
//# sourceMappingURL=MovementInteraction.js.map