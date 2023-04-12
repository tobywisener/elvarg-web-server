"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoordinateState = exports.NPCMovementCoordinator = void 0;
var RegionManager_1 = require("../../../collision/RegionManager");
var CombatFactory_1 = require("../../../content/combat/CombatFactory");
var Location_1 = require("../../../model/Location");
var PathFinder_1 = require("../../../model/movement/path/PathFinder");
var Misc_1 = require("../../../../util/Misc");
var NPCMovementCoordinator = /** @class */ (function () {
    function NPCMovementCoordinator(npc) {
        this.npc = npc;
        this.coordinateState = CoordinateState.HOME;
    }
    NPCMovementCoordinator.prototype.process = function () {
        if (this.radius == 0) {
            if (this.coordinateState == CoordinateState.HOME) {
                return;
            }
        }
        if (!this.npc.getMovementQueue().getMobility().canMove()) {
            return;
        }
        this.updateCoordinator();
        switch (this.coordinateState) {
            case CoordinateState.HOME:
                if (CombatFactory_1.CombatFactory.inCombat(this.npc)) {
                    return;
                }
                if (!this.npc.getMovementQueue().isMovings()) {
                    if (Misc_1.Misc.getRandom(9) <= 1) {
                        var pos = this.generateLocalPosition();
                        if (pos != null) {
                            this.npc.getMovementQueue().walkStep(pos.getX(), pos.getY());
                        }
                    }
                }
                break;
            case CoordinateState.RETREATING:
            case CoordinateState.AWAY:
                PathFinder_1.PathFinder.calculateWalkRoute(this.npc, this.npc.getSpawnPosition().getX(), this.npc.getSpawnPosition().getY());
                break;
        }
    };
    NPCMovementCoordinator.prototype.updateCoordinator = function () {
        if (CombatFactory_1.CombatFactory.inCombat(this.npc)) {
            if (this.coordinateState == CoordinateState.AWAY) {
                this.coordinateState = CoordinateState.RETREATING;
            }
            if (this.coordinateState == CoordinateState.RETREATING) {
                if (this.npc.getLocation().equals(this.npc.getSpawnPosition())) {
                    this.coordinateState = CoordinateState.HOME;
                }
                this.npc.getCombat().reset();
            }
            return;
        }
        var deltaX;
        var deltaY;
        if (this.npc.getSpawnPosition().getX() > this.npc.getLocation().getX()) {
            deltaX = this.npc.getSpawnPosition().getX() - this.npc.getLocation().getX();
        }
        else {
            deltaX = this.npc.getLocation().getX() - this.npc.getSpawnPosition().getX();
        }
        if (this.npc.getSpawnPosition().getY() > this.npc.getLocation().getY()) {
            deltaY = this.npc.getSpawnPosition().getY() - this.npc.getLocation().getY();
        }
        else {
            deltaY = this.npc.getLocation().getY() - this.npc.getSpawnPosition().getY();
        }
        if ((deltaX > this.radius) || (deltaY > this.radius)) {
            this.coordinateState = CoordinateState.AWAY;
        }
        else {
            this.coordinateState = CoordinateState.HOME;
        }
    };
    NPCMovementCoordinator.prototype.generateLocalPosition = function () {
        var dir = -1;
        var x = 0, y = 0;
        if (!RegionManager_1.RegionManager.blockedNorth(this.npc.getLocation(), this.npc.getPrivateArea())) {
            dir = 0;
        }
        else if (!RegionManager_1.RegionManager.blockedEast(this.npc.getLocation(), this.npc.getPrivateArea())) {
            dir = 4;
        }
        else if (!RegionManager_1.RegionManager.blockedSouth(this.npc.getLocation(), this.npc.getPrivateArea())) {
            dir = 8;
        }
        else if (!RegionManager_1.RegionManager.blockedWest(this.npc.getLocation(), this.npc.getPrivateArea())) {
            dir = 12;
        }
        var random = Misc_1.Misc.getRandom(3);
        var found = false;
        if (random == 0) {
            if (!RegionManager_1.RegionManager.blockedNorth(this.npc.getLocation(), this.npc.getPrivateArea())) {
                y = 1;
                found = true;
            }
        }
        else if (random == 1) {
            if (!RegionManager_1.RegionManager.blockedEast(this.npc.getLocation(), this.npc.getPrivateArea())) {
                x = 1;
                found = true;
            }
        }
        else if (random == 2) {
            if (!RegionManager_1.RegionManager.blockedSouth(this.npc.getLocation(), this.npc.getPrivateArea())) {
                y = -1;
                found = true;
            }
        }
        else if (random == 3) {
            if (!RegionManager_1.RegionManager.blockedWest(this.npc.getLocation(), this.npc.getPrivateArea())) {
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
        var spawnX = this.npc.getSpawnPosition().getX();
        var spawnY = this.npc.getSpawnPosition().getY();
        if (x == 1) {
            if (this.npc.getLocation().getX() + x > spawnX + 1)
                return null;
        }
        if (x == -1) {
            if (this.npc.getLocation().getX() - x < spawnX - 1)
                return null;
        }
        if (y == 1) {
            if (this.npc.getLocation().getY() + y > spawnY + 1)
                return null;
        }
        if (y == -1) {
            if (this.npc.getLocation().getY() - y < spawnY - 1)
                return null;
        }
        return new Location_1.Location(x, y);
    };
    NPCMovementCoordinator.prototype.getCoordinateState = function () {
        return this.coordinateState;
    };
    NPCMovementCoordinator.prototype.setCoordinateState = function (coordinateState) {
        this.coordinateState = coordinateState;
    };
    NPCMovementCoordinator.prototype.getRadius = function () {
        return this.radius;
    };
    NPCMovementCoordinator.prototype.setRadius = function (radius) {
        this.radius = radius;
    };
    return NPCMovementCoordinator;
}());
exports.NPCMovementCoordinator = NPCMovementCoordinator;
var CoordinateState;
(function (CoordinateState) {
    CoordinateState[CoordinateState["HOME"] = 0] = "HOME";
    CoordinateState[CoordinateState["AWAY"] = 1] = "AWAY";
    CoordinateState[CoordinateState["RETREATING"] = 2] = "RETREATING";
})(CoordinateState = exports.CoordinateState || (exports.CoordinateState = {}));
//# sourceMappingURL=NPCMovementCoordinator.js.map