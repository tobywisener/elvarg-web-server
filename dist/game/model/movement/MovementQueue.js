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
exports.MovementQueue = void 0;
var RegionManager_1 = require("../../collision/RegionManager");
var World_1 = require("../../World");
var Duelling_1 = require("../../content/Duelling");
var CombatFactory_1 = require("../../content/combat/CombatFactory");
var ObjectDefinition_1 = require("../../definition/ObjectDefinition");
var Direction_1 = require("../Direction");
var Location_1 = require("../Location");
var Skill_1 = require("../Skill");
var PathFinder_1 = require("./path/PathFinder");
var RS317PathFinder_1 = require("./path/RS317PathFinder");
var PlayerRights_1 = require("../rights/PlayerRights");
var Task_1 = require("../../task/Task");
var TaskManager_1 = require("../../task/TaskManager");
var Misc_1 = require("../../../util/Misc");
var NpcIdentifiers_1 = require("../../../util/NpcIdentifiers");
var RandomGen_1 = require("../../../util/RandomGen");
var TimerKey_1 = require("../../../util/timers/TimerKey");
var MovementQueue = exports.MovementQueue = /** @class */ (function () {
    /**
     * Creates a walking queue for the specified character.
     *
     * @param character The character.
     */
    function MovementQueue(character) {
        /**
         * The queue of directions.
         */
        this.points = new Array();
        /**
         * Whether movement is currently blocked for this Mobile.
         */
        this.blockMovement = false;
        /**
         * Are we currently moving?
         */
        this.isMoving = false;
        this.followX = -1;
        this.followY = -1;
        this.character = character;
        if (this.character.isPlayer()) {
            this.player = this.character.getAsPlayer();
        }
    }
    /**
         * Checks if we can walk from one position to another.
         *
         * @param deltaX
         * @param deltaY
         * @return
         */
    MovementQueue.prototype.canWalk = function (deltaX, deltaY) {
        if (!this.getMobility().canMove()) {
            return false;
        }
        if (this.character.getLocation().getZ() == -1) {
            return true;
        }
        return RegionManager_1.RegionManager.canMovestart(this.character.getLocation(), this.character.getLocation().transform(deltaX, deltaY), this.character.getSize(), this.character.getSize(), this.character.getPrivateArea());
    };
    /**
         * Steps away from a Gamecharacter
         *
         * @param character The gamecharacter to step away from
         */
    MovementQueue.clippedStep = function (character) {
        var size = character.getSize();
        if (character.getMovementQueue().canWalk(-size, 0))
            character.getMovementQueue().walkStep(-size, 0);
        else if (character.getMovementQueue().canWalk(-size, 0))
            character.getMovementQueue().walkStep(-size, 0);
        else if (character.getMovementQueue().canWalk(0, -size))
            character.getMovementQueue().walkStep(0, -size);
        else if (character.getMovementQueue().canWalk(0, -size))
            character.getMovementQueue().walkStep(0, -size);
    };
    MovementQueue.randomClippedStep = function (character, size) {
        var rng = this.RANDOM.getInclusive(1, 4);
        if (rng == 1 && character.getMovementQueue().canWalk(-size, 0))
            character.getMovementQueue().walkStep(-size, 0);
        else if (rng == 2 && character.getMovementQueue().canWalk(size, 0))
            character.getMovementQueue().walkStep(size, 0);
        else if (rng == 3 && character.getMovementQueue().canWalk(0, -size))
            character.getMovementQueue().walkStep(0, -size);
        else if (rng == 4 && character.getMovementQueue().canWalk(0, size))
            character.getMovementQueue().walkStep(0, size);
    };
    MovementQueue.randomClippedStepNotSouth = function (character, size) {
        var rng = this.RANDOM.getInclusive(1, 3);
        if (rng == 1 && character.getMovementQueue().canWalk(-size, 0))
            character.getMovementQueue().walkStep(-size, 0);
        else if (rng == 2 && character.getMovementQueue().canWalk(size, 0))
            character.getMovementQueue().walkStep(size, 0);
        else if (rng == 3 && character.getMovementQueue().canWalk(0, size))
            character.getMovementQueue().walkStep(0, size);
    };
    /**
         * Adds the first step to the queue, attempting to connect the server and client
         * position by looking at the previous queue.
         *
         * @param clientConnectionPosition The first step.
         * @return {@code true} if the queues could be connected correctly,
         * {@code false} if not.
         */
    MovementQueue.prototype.addFirstStep = function (clientConnectionPosition) {
        this.reset();
        this.addSteps(clientConnectionPosition);
        return true;
    };
    /**
         * Adds a step to walk to the queue.
         *
         * @param x       X to walk to
         * @param y       Y to walk to
         */
    MovementQueue.prototype.walkStep = function (x, y) {
        var position = this.character.getLocation().clone();
        position.setX(position.getX() + x);
        position.setY(position.getY() + y);
        this.addSteps(position);
    };
    /**
         * Adds a step to this MovementQueue.
         *
         * @param x           The x coordinate of this step.
         * @param y           The y coordinate of this step.
         * @param heightLevel
         */
    MovementQueue.prototype.addStep = function (x, y, heightLevel) {
        if (!this.getMobility().canMove()) {
            return;
        }
        if (this.points.length >= MovementQueue.MAXIMUM_SIZE)
            return;
        var last = this.getLast();
        var deltaX = x - last.position.getX();
        var deltaY = y - last.position.getY();
        var direction = Direction_1.Direction.fromDeltas(deltaX, deltaY);
        if (direction != Direction_1.Direction.NONE)
            this.points.push(new Point(new Location_1.Location(x, y), direction));
    };
    /**
         * Adds a step to the queue.
         *
         * @param step The step to add.
         */
    MovementQueue.prototype.addSteps = function (step) {
        if (!this.getMobility().canMove()) {
            return;
        }
        var last = this.getLast();
        var x = step.getX();
        var y = step.getY();
        var deltaX = x - last.position.getX();
        var deltaY = y - last.position.getY();
        var max = Math.max(Math.abs(deltaX), Math.abs(deltaY));
        for (var i = 0; i < max; i++) {
            if (deltaX < 0)
                deltaX++;
            else if (deltaX > 0)
                deltaX--;
            if (deltaY < 0)
                deltaY++;
            else if (deltaY > 0)
                deltaY--;
            this.addStep(x - deltaX, y - deltaY, step.getZ());
        }
    };
    /**
         * Determines the Player's Mobility status
         *
         * @return {Mobility} mobility
         */
    MovementQueue.prototype.getMobility = function () {
        if (this.character.getTimers().has(TimerKey_1.TimerKey.FREEZE)) {
            return Mobility.FROZEN_SPELL;
        }
        if (this.character.getTimers().has(TimerKey_1.TimerKey.STUN)) {
            return Mobility.STUNNED;
        }
        if (this.character.isNeedsPlacement() || this.isMovementBlocked()) {
            return Mobility.INVALID;
        }
        if (this.player != null) {
            // Player related checks
            var playerDueling = this.player.getDueling();
            if (!this.player.getTrading().getButtonDelay().finished() || !playerDueling.getButtonDelay().finished()) {
                return Mobility.BUSY;
            }
            if (playerDueling.inDuel() && playerDueling.getRules()[Duelling_1.DuelRule.NO_MOVEMENT.getButtonId()]) {
                return Mobility.DUEL_MOVEMENT_DISABLED;
            }
        }
        return Mobility.MOBILE;
    };
    /**
         * Validates a destination for a given player movement.
         *
         * @param destination The intended/potential destination.
         * @return {boolean} destinationValid
         */
    MovementQueue.prototype.checkDestination = function (destination) {
        if (destination.getZ() < 0) {
            return false;
        }
        if (this.character.getLocation().getZ() !== destination.getZ()) {
            return false;
        }
        if (destination.getX() > 32767 || destination.getX() < 0 || destination.getY() > 32767 || destination.getY() < 0) {
            return false;
        }
        var distance = this.character.getLocation().getDistance(destination);
        if (distance > 25) {
            return false;
        }
        return true;
    };
    MovementQueue.prototype.getLast = function () {
        var last = this.points.slice(-1)[0];
        if (!last)
            return new Point(this.character.getLocation(), Direction_1.Direction.NONE);
        return last;
    };
    /**
     * @return true if the character is moving.
     */
    MovementQueue.prototype.isMovings = function () {
        return this.isMoving;
    };
    MovementQueue.prototype.process = function () {
        if (!this.getMobility().canMove()) {
            this.reset();
            return;
        }
        if (this.character.getCombatFollowing() != null) {
            this.processCombatFollowing();
        }
        var walkPoint = null;
        var runPoint = null;
        walkPoint = this.points.shift();
        if (this.isRunToggled()) {
            runPoint = this.points.shift();
        }
        var oldPosition = this.character.getLocation();
        var moved = false;
        if (walkPoint != null && walkPoint.direction != Direction_1.Direction.NONE) {
            var next = walkPoint.position;
            if (this.canWalkTo(next)) {
                this.followX = oldPosition.getX();
                this.followY = oldPosition.getY();
                this.character.setLocation(next);
                this.character.setWalkingDirection(walkPoint.direction);
                moved = true;
            }
            else {
                this.reset();
                return;
            }
        }
        if (runPoint != null && runPoint.direction != Direction_1.Direction.NONE) {
            var next = runPoint.position;
            if (this.canWalkTo(next)) {
                this.followX = oldPosition.getX();
                this.followY = oldPosition.getY();
                oldPosition = next;
                this.character.setLocation(next);
                this.character.setRunningDirection(runPoint.direction);
                moved = true;
            }
            else {
                this.reset();
                return;
            }
        }
        if (this.character.isPlayer()) {
            if (moved) {
                this.handleRegionChange();
                this.drainRunEnergy();
                this.character.getAsPlayer().setOldPosition(oldPosition);
            }
        }
        this.isMoving = moved;
    };
    MovementQueue.prototype.canWalkTo = function (next) {
        var e_1, _a;
        if (this.character.isNpc() && !this.character.canWalkThroughNPCs()) {
            try {
                for (var _b = __values(World_1.World.getNpcs()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var npc = _c.value;
                    if (npc == null) {
                        continue;
                    }
                    if (npc.getLocation().equals(next)) {
                        return false;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        return true;
    };
    MovementQueue.prototype.handleRegionChange = function () {
        var player = this.character;
        var diffX = this.character.getLocation().getX() - this.character.getLastKnownRegion().getRegionX() * 8;
        var diffY = this.character.getLocation().getY() - this.character.getLastKnownRegion().getRegionY() * 8;
        var regionChanged = false;
        if (diffX < 16)
            regionChanged = true;
        else if (diffX >= 88)
            regionChanged = true;
        if (diffY < 16)
            regionChanged = true;
        else if (diffY >= 88)
            regionChanged = true;
        if (regionChanged || player.getRegionHeight() != player.getLocation().getZ()) {
            player.getPacketSender().sendMapRegion();
            player.setRegionHeight(player.getLocation().getZ());
        }
    };
    MovementQueue.prototype.drainRunEnergy = function () {
        var player = this.character;
        if (player.isRunningReturn()) {
            player.setRunEnergy(player.getRunEnergy() - 1);
            if (player.getRunEnergy() <= 0) {
                player.setRunEnergy(0);
                player.setRunning(false);
                player.getPacketSender().sendRunStatus();
            }
            player.getPacketSender().sendRunEnergy();
        }
    };
    MovementQueue.runEnergyRestoreDelay = function (p) {
        return 1700 - (p.getSkillManager().getCurrentLevel(Skill_1.Skill.AGILITY) * 10);
    };
    MovementQueue.prototype.reset = function () {
        this.points = [];
        this.followX = -1;
        this.followY = -1;
        this.isMoving = false;
        this.foundRoute = false;
        return this;
    };
    MovementQueue.prototype.resetFollow = function () {
        this.character.setCombatFollowing(null);
        this.character.setFollowing(null);
        this.character.setPositionToFace(null);
    };
    MovementQueue.prototype.processCombatFollowing = function () {
        var e_2, _a, e_3, _b;
        var following = this.character.getCombatFollowing();
        var size = this.character.getSize();
        var followingSize = following.getSize();
        // Update interaction
        this.character.setMobileInteraction(following);
        // Make sure we reset the current movement queue to prevent erratic back and forth
        this.reset();
        // Block if our movement is locked.
        if (!this.getMobility().canMove()) {
            return;
        }
        var combatFollow = this.character.getCombat().getTarget() === following;
        var method = CombatFactory_1.CombatFactory.getMethod(this.character);
        if (combatFollow && CombatFactory_1.CombatFactory.canReach(this.character, method, following)) {
            // Don't continue finding a path if we can reach our opponent
            this.reset();
            return;
        }
        // If we're way too far away from eachother, simply reset following completely.
        if (!this.character.getLocation().isViewableFrom(following.getLocation()) || !following.isRegistered() || following.getPrivateArea() != this.character.getPrivateArea()) {
            var reset = true;
            // Handle pets, they should teleport to their owner
            // when they're too far away.
            if (this.character.isNpc()) {
                var npc = this.character.getAsNpc();
                if (npc.isPet()) {
                    npc.setVisible(false);
                    var tiles = new Array();
                    try {
                        for (var _c = __values(following.outterTiles()), _d = _c.next(); !_d.done; _d = _c.next()) {
                            var tile = _d.value;
                            if (RegionManager_1.RegionManager.blocked(tile, following.getPrivateArea())) {
                                continue;
                            }
                            tiles.push(tile);
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                    if (tiles.length !== 0) {
                        npc.moveTo(tiles[Misc_1.Misc.getRandom(tiles.length - 1)]);
                        npc.setVisible(true);
                        npc.setArea(following.getArea());
                    }
                    return;
                }
                switch (npc.getId()) {
                    case NpcIdentifiers_1.NpcIdentifiers.TZTOK_JAD:
                        reset = false;
                        break;
                }
            }
            if (reset) {
                if (this.character.isPlayer() && following.isPlayer()) {
                    this.character.sendMessage("Unable to find ".concat(following.getAsPlayer().getUsername(), "."));
                    if (this.character.getAsPlayer().getRights() === PlayerRights_1.PlayerRights.DEVELOPER) {
                        var p = Misc_1.Misc.delta(this.character.getLocation(), following.getLocation());
                        this.character.sendMessage("Delta: " + p.x + ", " + p.y);
                    }
                }
                if (combatFollow) {
                    this.character.getCombat().reset();
                }
                this.character.getMovementQueue().reset();
                this.character.setCombatFollowing(null);
                this.character.setMobileInteraction(null);
                return;
            }
        }
        var dancing = (!combatFollow && this.character.isPlayer() && following.isPlayer() && following.getCombatFollowing() == this.character);
        var basicPathing = (combatFollow && this.character.isNpc() && !(this.character.canUsePathFinding()));
        var current = this.character.getLocation();
        var destination = following.getLocation();
        if (dancing) {
            destination = following.getAsPlayer().getOldPosition();
        }
        if (!dancing) {
            if (!combatFollow && this.character.calculateDistance(following) == 1 && !RS317PathFinder_1.RS317PathFinder.isInDiagonalBlock(current, destination)) {
                return;
            }
            // Handle simple walking to the destination for NPCs which don't use pathfinding.
            if (basicPathing) {
                // Same spot, step away.
                if (destination.equals(current) && !following.getMovementQueue().isMovings()
                    && this.character.getSize() == 1 && following.getSize() == 1) {
                    var tiles = new Array();
                    try {
                        for (var _e = __values(following.outterTiles()), _f = _e.next(); !_f.done; _f = _e.next()) {
                            var tile = _f.value;
                            if (!RegionManager_1.RegionManager.canMovestart(this.character.getLocation(), tile, size, size, this.character.getPrivateArea())
                                || RegionManager_1.RegionManager.blocked(tile, this.character.getPrivateArea())) {
                                continue;
                            }
                            // Projectile attack
                            if (this.character.useProjectileClipping() && !RegionManager_1.RegionManager.canProjectileAttackReturn(tile, following.getLocation(), this.character.getSize(), this.character.getPrivateArea())) {
                                continue;
                            }
                            tiles.push(tile);
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                    if (tiles.length > 0) {
                        this.addFirstStep(tiles[Misc_1.Misc.getRandom(tiles.length - 1)]);
                    }
                    return;
                }
                var deltaX = destination.getX() - current.getX();
                var deltaY = destination.getY() - current.getY();
                if (deltaX < -1) {
                    deltaX = -1;
                }
                else if (deltaX > 1) {
                    deltaX = 1;
                }
                if (deltaY < -1) {
                    deltaY = -1;
                }
                else if (deltaY > 1) {
                    deltaY = 1;
                }
                var direction = Direction_1.Direction.fromDeltas(deltaX, deltaY);
                switch (direction) {
                    case Direction_1.Direction.NORTH_WEST:
                        if (RegionManager_1.RegionManager.canMoveposition(current, Direction_1.Direction.WEST, size, this.character.getPrivateArea())) {
                            direction = Direction_1.Direction.WEST;
                        }
                        else if (RegionManager_1.RegionManager.canMoveposition(current, Direction_1.Direction.NORTH, size, this.character.getPrivateArea())) {
                            direction = Direction_1.Direction.NORTH;
                        }
                        else {
                            direction = Direction_1.Direction.NONE;
                        }
                        break;
                    case Direction_1.Direction.NORTH_EAST:
                        if (RegionManager_1.RegionManager.canMoveposition(current, Direction_1.Direction.NORTH, size, this.character.getPrivateArea())) {
                            direction = Direction_1.Direction.NORTH;
                        }
                        else if (RegionManager_1.RegionManager.canMoveposition(current, Direction_1.Direction.EAST, size, this.character.getPrivateArea())) {
                            direction = Direction_1.Direction.EAST;
                        }
                        else {
                            direction = Direction_1.Direction.NONE;
                        }
                        break;
                    case Direction_1.Direction.SOUTH_WEST:
                        if (RegionManager_1.RegionManager.canMoveposition(current, Direction_1.Direction.WEST, size, this.character.getPrivateArea())) {
                            direction = Direction_1.Direction.WEST;
                        }
                        else if (RegionManager_1.RegionManager.canMoveposition(current, Direction_1.Direction.SOUTH, size, this.character.getPrivateArea())) {
                            direction = Direction_1.Direction.SOUTH;
                        }
                        else {
                            direction = Direction_1.Direction.NONE;
                        }
                        break;
                    case Direction_1.Direction.SOUTH_EAST:
                        if (RegionManager_1.RegionManager.canMoveposition(current, Direction_1.Direction.EAST, size, this.character.getPrivateArea())) {
                            direction = Direction_1.Direction.EAST;
                        }
                        else if (RegionManager_1.RegionManager.canMoveposition(current, Direction_1.Direction.SOUTH, size, this.character.getPrivateArea())) {
                            direction = Direction_1.Direction.SOUTH;
                        }
                        else {
                            direction = Direction_1.Direction.NONE;
                        }
                        break;
                    default:
                        break;
                }
                if (direction == Direction_1.Direction.NONE) {
                    return;
                }
                var next = current.transform(direction.getX(), direction.getY());
                if (RegionManager_1.RegionManager.canMovestart(current, next, size, size, this.character.getPrivateArea())) {
                    this.addSteps(next);
                }
                return;
            }
            var attackDistance = CombatFactory_1.CombatFactory.getMethod(this.character).attackDistance(this.character);
            // Find the nearest tile surrounding the target
            var destinations = PathFinder_1.PathFinder.getClosestAttackableTile(this.character, following, attackDistance);
            if (destination == null) {
                return;
            }
        }
        PathFinder_1.PathFinder.calculateWalkRoute(this.character, destination.getX(), destination.getY());
    };
    // Gets the size of the queue.
    MovementQueue.prototype.size = function () {
        return this.points.length;
    };
    MovementQueue.prototype.isRunToggled = function () {
        return this.character.isPlayer() && this.character.isRunningReturn();
    };
    MovementQueue.prototype.setBlockMovement = function (blockMovement) {
        this.blockMovement = blockMovement;
        return this;
    };
    MovementQueue.prototype.isMovementBlocked = function () {
        return this.blockMovement;
    };
    MovementQueue.prototype.setPathX = function (x) {
        this.pathX = (this.character.getLocation().getRegionX() * 8) + x;
        return this;
    };
    MovementQueue.prototype.setPathY = function (y) {
        this.pathY = (this.character.getLocation().getRegionY() * 8) + y;
        return this;
    };
    MovementQueue.prototype.setRoute = function (route) {
        this.foundRoute = route;
    };
    MovementQueue.prototype.hasRoute = function () {
        return this.foundRoute;
    };
    MovementQueue.prototype.pointsReturn = function () {
        return this.points;
    };
    MovementQueue.prototype.walkToGroundItem = function (pos, action) {
        var _this = this;
        if (this.player.getLocation().getDistance(pos) == 0) {
            // If player is already at the ground item, run the action now
            action();
            return;
        }
        var mobility = this.getMobility();
        if (!mobility.canMove()) {
            mobility.sendMessage(this.player);
            this.reset();
            return;
        }
        if (!this.checkDestination(pos)) {
            this.reset();
            return;
        }
        var destX = pos.getX();
        var destY = pos.getY();
        this.reset();
        this.walkToReset();
        PathFinder_1.PathFinder.calculateWalkRoute(this.player, destX, destY);
        TaskManager_1.TaskManager.submit(new MovementTask(this.player.getIndex(), function () {
            var stage = 0;
            if (stage !== 0) {
                _this.player.getMovementQueue().reset();
                TaskManager_1.TaskManager.cancelTasks(_this.player);
                _this.player.getPacketSender().sendMessage("You can't reach that!");
                return;
            }
            if (_this.player.getMovementQueue().points.length) {
                return;
            }
            var currentLoc = _this.player.getLocation();
            if (!_this.player.getMovementQueue().hasRoute() || currentLoc.getX() !== destX || currentLoc.getY() !== destY) {
                stage = -1;
                return;
            }
            if (action !== null) {
                action();
            }
            _this.player.getMovementQueue().reset();
            stop();
        }));
    };
    MovementQueue.prototype.walkToReset = function () {
        if (this.player == null) {
            return;
        }
        TaskManager_1.TaskManager.cancelTasks(this.player.getIndex());
        this.player.getCombat().setCastSpell(null);
        this.player.getCombat().reset();
        this.player.getSkillManager().stopSkillable();
        this.resetFollow();
    };
    MovementQueue.prototype.walkToEntity = function (entity, runnable) {
        var _this = this;
        var destX = entity.getLocation().getX();
        var destY = entity.getLocation().getY();
        var mobility = this.getMobility();
        if (!mobility.canMove()) {
            mobility.sendMessage(this.player);
            this.reset();
            return;
        }
        if (!this.checkDestination(entity.getLocation())) {
            this.reset();
            return;
        }
        this.reset();
        this.walkToReset();
        PathFinder_1.PathFinder.calculateEntityRoute(this.player, destX, destY);
        if (!this.player.getMovementQueue().foundRoute) {
            // If the path finder couldn't find a route, you can't reach the entity
            this.player.getPacketSender().sendMessage("I can't reach that!");
            return;
        }
        var finalDestinationX = this.player.getMovementQueue().pathX;
        var finalDestinationY = this.player.getMovementQueue().pathY;
        TaskManager_1.TaskManager.submit(new MovementTask(this.player.getIndex(), function () {
            var currentX = entity.getLocation().getX();
            var currentY = entity.getLocation().getY();
            var reachStage = 0;
            _this.player.setMobileInteraction(entity);
            if (currentX != entity.getLocation().getX() || currentY != entity.getLocation().getY()) {
                _this.reset();
                currentX = entity.getLocation().getX();
                currentY = entity.getLocation().getY();
                PathFinder_1.PathFinder.calculateEntityRoute(_this.player, currentX, currentY);
            }
            if (runnable && _this.player.getMovementQueue().isWithinEntityInteractionDistance(entity.getLocation())) {
                // Executes the runnable and stops the task. However, It will still path to the destination.
                runnable();
                return;
            }
            if (reachStage !== 0) {
                if (reachStage === 1) {
                    _this.player.getMovementQueue().reset();
                    stop();
                    return;
                }
                _this.player.getMovementQueue().reset();
                stop();
                _this.player.getPacketSender().sendMessage("I can't reach that!");
                return;
            }
            if (!_this.player.getMovementQueue().points.length) {
                return;
            }
            if (!_this.player.getMovementQueue().hasRoute() || _this.player.getLocation().getX() !== finalDestinationX || _this.player.getLocation().getY() !== finalDestinationY) {
                // Player hasn't got a route or they're not already at destination
                reachStage = -1;
                return;
            }
            reachStage = 1;
            return;
        }));
    };
    MovementQueue.prototype.walkToObject = function (object, action) {
        var _this = this;
        var mobility = this.getMobility();
        if (!mobility.canMove()) {
            mobility.sendMessage(this.player);
            this.reset();
            return;
        }
        if (!this.checkDestination(object.getLocation())) {
            this.reset();
            return;
        }
        this.reset();
        this.walkToReset();
        var objectX = object.getLocation().getX();
        var objectY = object.getLocation().getY();
        var type = object.getType();
        var id = object.getId();
        var direction = object.getFace();
        if (type == 10 || type == 11 || type == 22) {
            var xLength = void 0, yLength = void 0;
            var def = ObjectDefinition_1.ObjectDefinition.forId(id);
            if (direction == 0 || direction == 2) {
                yLength = ObjectDefinition_1.ObjectDefinition.objectSizeX;
                xLength = ObjectDefinition_1.ObjectDefinition.objectSizeY;
            }
            else {
                yLength = ObjectDefinition_1.ObjectDefinition.objectSizeY;
                xLength = ObjectDefinition_1.ObjectDefinition.objectSizeX;
            }
            var blockingMask = ObjectDefinition_1.ObjectDefinition.blockingMask;
            if (direction != 0) {
                blockingMask = (blockingMask << direction & 0xf) + (blockingMask >> 4 - direction);
            }
            PathFinder_1.PathFinder.calculateObjectRoute(this.player, 0, objectX, objectY, xLength, yLength, 0, blockingMask);
        }
        else {
            PathFinder_1.PathFinder.calculateObjectRoute(this.player, type + 1, objectX, objectY, 0, 0, direction, 0);
        }
        var finalDestinationX = this.player.getMovementQueue().pathX;
        var finalDestinationY = this.player.getMovementQueue().pathY;
        //System.err.println("RequestedX=" + objectX + " requestedY=" + objectY + " givenX=" + finalDestinationX + " givenY=" + finalDestinationY);
        var finalObjectY = objectY;
        this.player.setPositionToFace(new Location_1.Location(objectX, objectY));
        TaskManager_1.TaskManager.submit(new MovementeTaskFunc(this.player.getIndex(), function () {
            var walkStage = 0;
            if (walkStage != 0) {
                if (objectX == _this.player.getLocation().getX() && finalObjectY == _this.player.getLocation().getY()) {
                    if (direction == 0)
                        _this.player.setDirection(Direction_1.Direction.WEST);
                    else if (direction === 1) {
                        _this.player.setDirection(Direction_1.Direction.NORTH);
                    }
                    else if (direction === 2) {
                        _this.player.setDirection(Direction_1.Direction.EAST);
                    }
                    else if (direction === 3) {
                        _this.player.setDirection(Direction_1.Direction.SOUTH);
                    }
                }
                _this.pathX = _this.player.getLocation().getX();
                _this.pathY = _this.player.getLocation().getY();
                if (walkStage === 1) {
                    if (action !== null) {
                        action.execute();
                    }
                    stop();
                    return;
                }
                stop();
                return;
            }
            if (_this.points.length) {
                return;
            }
            if (!_this.player.getMovementQueue().hasRoute() || _this.player.getLocation().getX() !== finalDestinationX || _this.player.getLocation().getY() !== finalDestinationY) {
                walkStage = -1;
                /** When no destination is set = no possible route to requested tiles **/
                _this.player.getPacketSender().sendMessage("You can't reach that!");
                return;
            }
            walkStage = 1;
        }));
    };
    MovementQueue.prototype.isAtPointOfFocus = function (destX, destY) {
        return this.character.getLocation().getX() === destX && this.character.getLocation().getY() === destY;
    };
    MovementQueue.prototype.isAtDestination = function () {
        return this.points.length === 0;
    };
    MovementQueue.prototype.isWithinEntityInteractionDistance = function (entityLocation) {
        return this.points.length <= MovementQueue.NPC_INTERACT_RADIUS &&
            this.player.getLocation().getDistance(entityLocation) <= MovementQueue.NPC_INTERACT_RADIUS;
    };
    MovementQueue.prototype.canMove = function () {
        return this == Mobility.MOBILE;
    };
    /**
     * Sends the appropriate message to the player about their (lack of) mobility.
     *
     * @param player The player to send the message to.
     */
    MovementQueue.prototype.sendMessage = function (player) {
        if (player == null) {
            return;
        }
        var message;
        switch (this) {
            case Mobility.FROZEN_SPELL:
                message = "A magical spell has made you unable to move.";
                break;
            case Mobility.STUNNED:
                message = "You're stunned!";
                break;
            case Mobility.BUSY:
                message = "You cannot do that right now.";
                break;
            case Mobility.DUEL_MOVEMENT_DISABLED:
                message = "Movement has been disabled in this duel!";
                break;
            default:
                // No message associated with this Mobility
                return;
        }
        player.getPacketSender().sendMessage(message);
    };
    MovementQueue.RANDOM = new RandomGen_1.RandomGen();
    /**
     * NPC interactions can begin when the player is within this radius of the NPC.
     */
    MovementQueue.NPC_INTERACT_RADIUS = 2;
    /**
     * An enum to represent a Player's Mobility
     */
    /**
         * The maximum size of the queue. If any additional steps are added, they are
         * discarded.
         */
    MovementQueue.MAXIMUM_SIZE = 100;
    return MovementQueue;
}());
var Mobility = /** @class */ (function () {
    /**
     * Determines whether the player is able to move.
     *
     * @return {boolean} canMove
     */
    function Mobility() {
    }
    Mobility.prototype.canMove = function () {
        return this === Mobility.MOBILE;
    };
    /**
     * Sends the appropriate message to the player about their (lack of) mobility.
     *
     * @param player The player to send the message to.
     */
    Mobility.prototype.sendMessage = function (player) {
        if (!player) {
            return;
        }
        var message;
        switch (this) {
            case Mobility.FROZEN_SPELL:
                message = "A magical spell has made you unable to move.";
                break;
            case Mobility.STUNNED:
                message = "You're stunned!";
                break;
            case Mobility.BUSY:
                message = "You cannot do that right now.";
                break;
            case Mobility.DUEL_MOVEMENT_DISABLED:
                message = "Movement has been disabled in this duel!";
                break;
            default:
                // No message associated with this Mobility
                return;
        }
        player.getPacketSender().sendMessage(message);
    };
    Mobility.INVALID = new Mobility();
    Mobility.BUSY = new Mobility();
    Mobility.FROZEN_SPELL = new Mobility();
    Mobility.STUNNED = new Mobility();
    Mobility.DUEL_MOVEMENT_DISABLED = new Mobility();
    Mobility.MOBILE = new Mobility();
    return Mobility;
}());
var Point = /** @class */ (function () {
    function Point(position, direction) {
        this.position = position;
        this.direction = direction;
    }
    Point.prototype.toString = function () {
        return "Point [direction=".concat(this.direction, ", position=").concat(this.position, "]");
    };
    return Point;
}());
var MovementTask = /** @class */ (function (_super) {
    __extends(MovementTask, _super);
    function MovementTask(n1, execFunc) {
        var _this = _super.call(this, 0, n1, true) || this;
        _this.execFunc = execFunc;
        return _this;
    }
    MovementTask.prototype.execute = function () {
        this.execFunc();
    };
    return MovementTask;
}(Task_1.Task));
var MovementeTaskFunc = /** @class */ (function (_super) {
    __extends(MovementeTaskFunc, _super);
    function MovementeTaskFunc(n1, execFunc) {
        var _this = _super.call(this, 1, n1, true) || this;
        _this.execFunc = execFunc;
        return _this;
    }
    MovementeTaskFunc.prototype.execute = function () {
        this.execFunc();
    };
    return MovementeTaskFunc;
}(Task_1.Task));
//# sourceMappingURL=MovementQueue.js.map