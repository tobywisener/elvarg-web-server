"use strict";
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
exports.PathFinder = void 0;
var Server_1 = require("../../../../Server");
var RegionManager_1 = require("../../../collision/RegionManager");
var Location_1 = require("../../Location");
var AttackRange_1 = require("../../../model/commands/impl/AttackRange");
var PlayerRights_1 = require("../../rights/PlayerRights");
var GameConstants_1 = require("../../../GameConstants");
var PathFinder = exports.PathFinder = /** @class */ (function () {
    function PathFinder() {
    }
    PathFinder.prototype.isInDiagonalBlock = function (attacker, attacked) {
        return attacked.getX() - 1 == attacker.getX() && attacked.getY() + 1 == attacker.getY()
            || attacker.getX() - 1 == attacked.getX() && attacker.getY() + 1 == attacked.getY()
            || attacked.getX() + 1 == attacker.getX() && attacked.getY() - 1 == attacker.getY()
            || attacker.getX() + 1 == attacked.getX() && attacker.getY() - 1 == attacked.getY()
            || attacked.getX() + 1 == attacker.getX() && attacked.getY() + 1 == attacked.getY()
            || attacker.getX() + 1 == attacked.getX() && attacker.getY() + 1 == attacker.getY();
    };
    PathFinder.isDiagonalLocation = function (att, def) {
        var attacker = att.getLocation().clone();
        var attacked = def.getLocation().clone();
        var isDia = attacker.getX() - 1 == attacked.getX() && attacker.getY() + 1 == attacked.getY() //top left
            || attacker.getX() + 1 == attacked.getX() && attacker.getY() - 1 == attacked.getY() //bottom right
            || attacker.getX() + 1 == attacked.getX() && attacker.getY() + 1 == attacked.getY() //top right
            || attacker.getX() - 1 == attacked.getX() && attacker.getY() - 1 == attacked.getY(); //bottom right
        return isDia;
    };
    PathFinder.calculateCombatRoute = function (player, target) {
        PathFinder.calculateRoute(player, 0, target.getLocation().getX(), target.getLocation().getY(), 1, 1, 0, 0, false);
        player.setMobileInteraction(target);
    };
    PathFinder.calculateEntityRoute = function (player, destX, destY) {
        PathFinder.calculateRoute(player, 0, destX, destY, 1, 1, 0, 0, false);
    };
    PathFinder.calculateWalkRoute = function (player, destX, destY) {
        PathFinder.calculateRoute(player, 0, destX, destY, 0, 0, 0, 0, true);
    };
    PathFinder.calculateObjectRoute = function (entity, size, destX, destY, xLength, yLength, direction, blockingMask) {
        PathFinder.calculateRoute(entity, size, destX, destY, xLength, yLength, direction, blockingMask, false);
    };
    PathFinder.getClosestAttackableTile = function (attacker, defender, distance) {
        var e_1, _a;
        var privateArea = attacker.getPrivateArea();
        var targetLocation = defender.getLocation();
        if (distance === 1) {
            var size_1 = attacker.getSize();
            var followingSize_1 = defender.getSize();
            var current_1 = attacker.getLocation();
            var tiles = [];
            try {
                for (var _b = __values(defender.outterTiles()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var tile_1 = _c.value;
                    if (!RegionManager_1.RegionManager.canMovestart(attacker.getLocation(), tile_1, size_1, size_1, privateArea)
                        || RegionManager_1.RegionManager.blocked(tile_1, privateArea)) {
                        continue;
                    }
                    // Projectile attack
                    if (attacker.useProjectileClipping() && !RegionManager_1.RegionManager.canProjectileAttackReturn(tile_1, targetLocation, size_1, privateArea)) {
                        continue;
                    }
                    tiles.push(tile_1);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            if (tiles.length !== 0) {
                tiles.sort(function (l1, l2) {
                    var distance1 = l1.getDistance(current_1);
                    var distance2 = l2.getDistance(current_1);
                    var delta = (distance1 - distance2);
                    // Make sure we don't pick a diagonal tile if we're a small entity and have to
                    // attack closely (melee).
                    if (distance1 === distance2 && size_1 === 1 && followingSize_1 === 1) {
                        if (l1.isPerpendicularTo(current_1)) {
                            return -1;
                        }
                        else if (l2.isPerpendicularTo(current_1)) {
                            return 1;
                        }
                    }
                    return delta;
                });
                return tiles[0];
            }
        }
        var tile = undefined;
        // Starting from the max distance, try to find a suitable tile to attack from
        while (tile === undefined) {
            // Fetch the circumference of the closest attackable tiles to the target
            var possibleTiles = PathFinder.getTilesForDistance(targetLocation, distance);
            if (GameConstants_1.GameConstants.DEBUG_ATTACK_DISTANCE && attacker.getAsPlayer() && attacker.getAsPlayer().rights === PlayerRights_1.PlayerRights.DEVELOPER) {
                // If we're debugging attack range
                possibleTiles.forEach(function (t) { return attacker.getAsPlayer().packetSender.sendGraphic(AttackRange_1.AttackRange.PURPLE_GLOW, t); });
            }
            tile = possibleTiles
                // Filter out any tiles which are clipped
                .filter(function (t) { return !RegionManager_1.RegionManager.blocked(t, attacker.getPrivateArea()); })
                // Filter out any tiles which projectiles are blocked from (i.e. tree is in the way)
                .filter(function (t) { return RegionManager_1.RegionManager.canProjectileAttack(attacker, t, targetLocation); })
                // Find the tile closest to the attacker
                .sort(function (a, b) { return attacker.getLocation().getDistance(a) - attacker.getLocation().getDistance(b); })[0];
            if (distance === 1) {
                // We've reached the closest attackable tile, break out of the loop as we can't get any closer
                break;
            }
            else {
                // Check 1 square closer if we don't have any valid tiles at this distance
                distance = Math.max(distance - 1, 1);
            }
        }
        if (!tile) {
            attacker.sendMessage("I can't reach that.");
            return;
        }
        return tile;
    };
    PathFinder.getTilesForDistances = function (center, distance) {
        var deltas = PathFinder.TILE_DISTANCE_DELTAS.get(Math.min(distance, CombatConstants.MAX_ATTACK_DISTANCE));
        return deltas.map(function (d) { return center.clone().getTranslate(d[0], d[1]); });
    };
    PathFinder.getTilesForDistance = function (center, distance) {
        var deltas = PathFinder.TILE_DISTANCE_DELTAS.get(Math.min(distance, CombatConstants.MAX_ATTACK_DISTANCE));
        return deltas.map(function (d) { return center.clone().getTranslate(d[0], d[1]); });
    };
    PathFinder.calculateRoute = function (entity, size, destX, destY, xLength, yLength, direction, blockingMask, basicPather) {
        /** RS Protocol **/
        var byte0 = 104;
        var byte1 = 104;
        var directions = new Array(104);
        for (var i = 0; i < directions.length; i++) {
            directions[i] = new Array(104).fill(0);
        }
        var distanceValues = new Array(104);
        for (var i = 0; i < distanceValues.length; i++) {
            distanceValues[i] = new Array(104).fill(0x5f5e0ff);
        }
        var routeStepsX = new Array(4096);
        var routeStepsY = new Array(4096);
        var anInt1264 = 0;
        var anInt1288 = 0;
        entity.getMovementQueue().lastDestX = destX;
        entity.getMovementQueue().lastDestY = destY;
        for (var l2 = 0; l2 < 104; l2++) {
            for (var i3 = 0; i3 < 104; i3++) {
                directions[l2][i3] = 0;
                distanceValues[l2][i3] = 0x5f5e0ff;
            }
        }
        /** Required for based on client **/
        var localX = entity.getLocation().getRegionX();
        var localY = entity.getLocation().getRegionY();
        /** Stored LocalX/Y into another temp list **/
        var baseX = localX;
        var baseY = localY;
        /** DestinationX for LocalX **/
        var destinationX = destX - (entity.getLocation().getRegionX() << 3);
        /** DestinationY for LocalY **/
        var destinationY = destY - (entity.getLocation().getRegionY() << 3);
        /** RS Protocol **/
        directions[localX][localY] = 99;
        distanceValues[localX][localY] = 0;
        /** Size of the 2nd queue **/
        var tail = 0;
        /** Size of the 1st queue **/
        var queueIndex = 0;
        /** Set in order to loop to find best path **/
        routeStepsX[tail] = localX;
        routeStepsY[tail++] = localY;
        /** Required for custom object walk-to actions. **/
        entity.getMovementQueue().setRoute(false);
        /** Size of the main queue **/
        var queueSizeX = routeStepsX.length;
        /** Entities height **/
        var height = entity.getLocation().getZ();
        /** Private Area **/
        var area = entity.getPrivateArea();
        /** Steps taken to get to best route **/
        var steps = 0;
        /** Loops and checks flags for best route to destination. **/
        while (queueIndex != tail) {
            baseX = routeStepsX[queueIndex];
            baseY = routeStepsY[queueIndex];
            queueIndex = (queueIndex + 1) % queueSizeX;
            var absoluteX = (entity.getLocation().getRegionX() << 3) + baseX;
            var absoluteY = (entity.getLocation().getRegionY() << 3) + baseY;
            if (baseX == destinationX && baseY == destinationY) {
                entity.getMovementQueue().setRoute(true);
                entity.getMovementQueue().setPathX(baseX).setPathY(baseY);
                console.log("Already at destination, breaking loop");
                break;
            }
            if (size != 0) {
                /** Used for basic walking and other packet interactions also size 10 **/
                if ((size < 5 || size == 10) && PathFinder.defaultRoutePath(entity, destinationX, baseX, baseY, direction, size - 1, destinationY)) {
                    console.log("Using normal entity pathing..");
                    entity.getMovementQueue().setRoute(true);
                    break;
                }
                /** Used for larger entities e.g corp/kbd ect **/
                if (size < 10 && PathFinder.largeRoutePath(entity, destinationX, destinationY, baseY, size - 1, direction, baseX)) {
                    Server_1.Server.logDebug("Using larger Size Pathing..");
                    entity.getMovementQueue().setRoute(true);
                    break;
                }
            }
            if (size < 10 && PathFinder.largeRoutePath(entity, destinationX, destinationY, baseY, size - 1, direction, baseX)) {
                Server_1.Server.logDebug("Using larger Size Pathing..");
                entity.getMovementQueue().setRoute(true);
                break;
            }
            var priceValue = distanceValues[baseX][baseY] + 1;
            if (baseX > 0 && directions[baseX - 1][baseY] == 0 && (RegionManager_1.RegionManager.getClipping(absoluteX - 1, absoluteY, height, area) & PathFinder.WEST) == 0) {
                routeStepsX[tail] = baseX - 1;
                routeStepsY[tail] = baseY;
                tail = (tail + 1) % queueSizeX;
                directions[baseX - 1][baseY] = 2;
                distanceValues[baseX - 1][baseY] = priceValue;
            }
            if (baseX < byte0 - 1 && directions[baseX + 1][baseY] == 0 && (RegionManager_1.RegionManager.getClipping(absoluteX + 1, absoluteY, height, area) & PathFinder.EAST) == 0) {
                routeStepsX[tail] = baseX + 1;
                routeStepsY[tail] = baseY;
                tail = (tail + 1) % queueSizeX;
                directions[baseX + 1][baseY] = 8;
                distanceValues[baseX + 1][baseY] = priceValue;
            }
            if (baseY > 0 && directions[baseX][baseY - 1] == 0 && (RegionManager_1.RegionManager.getClipping(absoluteX, absoluteY - 1, height, area) & PathFinder.SOUTH) == 0) {
                routeStepsX[tail] = baseX;
                routeStepsY[tail] = baseY - 1;
                tail = (tail + 1) % queueSizeX;
                directions[baseX][baseY - 1] = 1;
                distanceValues[baseX][baseY - 1] = priceValue;
            }
            if (baseY < byte1 - 1 && directions[baseX][baseY + 1] == 0 && (RegionManager_1.RegionManager.getClipping(absoluteX, absoluteY + 1, height, area) & PathFinder.NORTH) == 0) {
                routeStepsX[tail] = baseX;
                routeStepsY[tail] = baseY + 1;
                tail = (tail + 1) % queueSizeX;
                directions[baseX][baseY + 1] = 4;
                distanceValues[baseX][baseY + 1] = priceValue;
            }
            if (baseX > 0 && baseY > 0 && directions[baseX - 1][baseY - 1] === 0 && (RegionManager_1.RegionManager.getClipping(absoluteX - 1, absoluteY - 1, height, area) & PathFinder.SOUTHWEST) === 0
                && (RegionManager_1.RegionManager.getClipping(absoluteX - 1, absoluteY, height, area) & PathFinder.WEST) === 0 && (RegionManager_1.RegionManager.getClipping(absoluteX, absoluteY - 1, height, area) & PathFinder.SOUTH) === 0) {
                routeStepsX[tail] = baseX - 1;
                routeStepsY[tail] = baseY - 1;
                tail = (tail + 1) % queueSizeX;
                directions[baseX - 1][baseY - 1] = 3;
                distanceValues[baseX - 1][baseY - 1] = priceValue;
            }
            if (baseX < byte0 - 1 && baseY > 0 && directions[baseX + 1][baseY - 1] === 0
                && (RegionManager_1.RegionManager.getClipping(absoluteX + 1, absoluteY - 1, height, area) & PathFinder.SOUTHEAST) === 0 && (RegionManager_1.RegionManager.getClipping(absoluteX + 1, absoluteY, height, area) & PathFinder.EAST) === 0
                && (RegionManager_1.RegionManager.getClipping(absoluteX, absoluteY - 1, height, area) & PathFinder.SOUTH) === 0) {
                routeStepsX[tail] = baseX + 1;
                routeStepsY[tail] = baseY - 1;
                tail = (tail + 1) % queueSizeX;
                directions[baseX + 1][baseY - 1] = 9;
                distanceValues[baseX + 1][baseY - 1] = priceValue;
            }
            if (baseX > 0 && baseY < byte1 - 1 && directions[baseX - 1][baseY + 1] === 0
                && (RegionManager_1.RegionManager.getClipping(absoluteX - 1, absoluteY + 1, height, area) & PathFinder.NORTHWEST) === 0 && (RegionManager_1.RegionManager.getClipping(absoluteX - 1, absoluteY, height, area) & PathFinder.WEST) === 0
                && (RegionManager_1.RegionManager.getClipping(absoluteX, absoluteY + 1, height, area) & PathFinder.NORTH) === 0) {
                routeStepsX[tail] = baseX - 1;
                routeStepsY[tail] = baseY + 1;
                tail = (tail + 1) % queueSizeX;
                directions[baseX - 1][baseY + 1] = 6;
                distanceValues[baseX - 1][baseY + 1] = priceValue;
            }
            if (baseX < byte0 - 1 && baseY < byte1 - 1 && directions[baseX + 1][baseY + 1] === 0
                && (RegionManager_1.RegionManager.getClipping(absoluteX + 1, absoluteY + 1, height, area) & PathFinder.NORTHEAST) === 0 && (RegionManager_1.RegionManager.getClipping(absoluteX + 1, absoluteY, height, area) & PathFinder.EAST) === 0
                && (RegionManager_1.RegionManager.getClipping(absoluteX, absoluteY + 1, height, area) & PathFinder.NORTH) === 0) {
                routeStepsX[tail] = baseX + 1;
                routeStepsY[tail] = baseY + 1;
            }
            if (baseX < byte0 - 1 && baseY < byte1 - 1 && directions[baseX + 1][baseY + 1] === 0 &&
                (RegionManager_1.RegionManager.getClipping(absoluteX + 1, absoluteY + 1, height, area) & PathFinder.NORTHEAST) === 0 &&
                (RegionManager_1.RegionManager.getClipping(absoluteX + 1, absoluteY, height, area) & PathFinder.EAST) === 0 &&
                (RegionManager_1.RegionManager.getClipping(absoluteX, absoluteY + 1, height, area) & PathFinder.NORTH) === 0) {
                routeStepsX[tail] = baseX + 1;
                routeStepsY[tail] = baseY + 1;
                tail = (tail + 1) % queueSizeX;
                directions[baseX + 1][baseY + 1] = 12;
                distanceValues[baseX + 1][baseY + 1] = priceValue;
            }
        }
        anInt1264 = 0;
        if (!entity.getMovementQueue().hasRoute()) {
            if (basicPather) {
                var cost = 100;
                for (var range = 1; range < 5; range++) {
                    for (var xOffset = destinationX - range; xOffset <= destinationX + range; xOffset++) {
                        for (var yOffset = destinationY - range; yOffset <= destinationY + range; yOffset++) {
                            if (xOffset >= 0 && yOffset >= 0 && xOffset < 104 && yOffset < 104 && distanceValues[xOffset][yOffset] < cost) {
                                cost = distanceValues[xOffset][yOffset];
                                baseX = xOffset;
                                baseY = yOffset;
                                anInt1264 = 1;
                                entity.getMovementQueue().setRoute(true);
                            }
                        }
                    }
                    if (entity.getMovementQueue().hasRoute())
                        break;
                }
            }
            if (!entity.getMovementQueue().hasRoute()) {
                Server_1.Server.logDebug("error.. no path found... path probably not reachable.");
                return -1;
            }
        }
        queueIndex = 0;
        routeStepsX[queueIndex] = baseX;
        routeStepsY[queueIndex++] = baseY;
        var l5;
        for (var dirc = l5 = directions[baseX][baseY]; baseX !== localX || baseY !== localY; dirc = directions[baseX][baseY]) {
            if (dirc !== l5) {
                l5 = dirc;
                routeStepsX[queueIndex] = baseX;
                routeStepsY[queueIndex++] = baseY;
            }
            if ((dirc & 2) !== 0)
                baseX++;
            else if ((dirc & 8) !== 0)
                baseX--;
            if ((dirc & 1) !== 0)
                baseY++;
            else if ((dirc & 4) !== 0)
                baseY--;
        }
        if (queueIndex > 0) {
            if (queueIndex > 25)
                queueIndex = 25;
            queueIndex = 25;
        }
        while (queueIndex-- > 0) {
            var absX = entity.getLocation().getRegionX() * 8 + routeStepsX[queueIndex];
            var absY = entity.getLocation().getRegionY() * 8 + routeStepsY[queueIndex];
            entity.getMovementQueue().addSteps(new Location_1.Location(absX, absY, height));
            steps++;
        }
        return steps;
    };
    PathFinder.defaultRoutePath = function (entity, destX, baseX, baseY, direction, size, destY) {
        if (baseX === destX && baseY === destY) {
            entity.getMovementQueue().setPathX(baseX).setPathY(baseY);
            return true;
        }
        var absX = (entity.getLocation().getRegionX() << 3) + baseX;
        var absY = (entity.getLocation().getRegionY() << 3) + baseY;
        var height = entity.getLocation().getZ();
        var area = entity.getPrivateArea();
        baseX -= 0;
        baseY -= 0;
        destX -= 0;
        destY -= 0;
        if (size === 0) {
            if (direction === 0) {
                if (baseX === destX - 1 && baseY === destY) {
                    entity.getMovementQueue().setPathX(baseX).setPathY(baseY);
                    return true;
                }
                if (baseX === destX && baseY === destY + 1 && (RegionManager_1.RegionManager.getClipping(absX, absY, height, area) & 0x1280120) === 0) {
                    entity.getMovementQueue().setPathX(baseX).setPathY(baseY);
                    return true;
                }
                if (baseX === destX && baseY === destY - 1 && (RegionManager_1.RegionManager.getClipping(absX, absY, height, area) & 0x1280102) === 0) {
                    entity.getMovementQueue().setPathX(baseX).setPathY(baseY);
                    return true;
                }
            }
            else if (direction === 1) {
                if (baseX === destX && baseY === destY + 1) {
                    entity.getMovementQueue().setPathX(baseX).setPathY(baseY);
                    return true;
                }
                if (baseX === destX - 1 && baseY === destY && (RegionManager_1.RegionManager.getClipping(absX, absY, height, area) & 0x1280108) === 0) {
                    entity.getMovementQueue().setPathX(baseX).setPathY(baseY);
                    return true;
                }
                if (baseX === destX + 1 && baseY === destY && (RegionManager_1.RegionManager.getClipping(absX, absY, height, area) & 0x1280180) === 0) {
                    entity.getMovementQueue().setPathX(baseX).setPathY(baseY);
                    return true;
                }
            }
            else if (direction === 2) {
                if (baseX === destX + 1 && baseY === destY) {
                    entity.getMovementQueue().setPathX(baseX).setPathY(baseY);
                    return true;
                }
                if (baseX === destX && baseY === destY + 1 && (RegionManager_1.RegionManager.getClipping(absX, absY, height, area) & 0x1280120) === 0) {
                    entity.getMovementQueue().setPathX(baseX).setPathY(baseY);
                    return true;
                }
                if (baseX === destX && baseY === destY - 1 && (RegionManager_1.RegionManager.getClipping(absX, absY, height, area) & 0x1280102) === 0) {
                    entity.getMovementQueue().setPathX(baseX).setPathY(baseY);
                    return true;
                }
            }
            else if (direction == 3) {
                if (baseX == destX && baseY == destY - 1) {
                    entity.getMovementQueue().setPathX(baseX).setPathY(baseY);
                    return true;
                }
                if (baseX == destX - 1 && baseY == destY
                    && (RegionManager_1.RegionManager.getClipping(absX, absY, height, area) & 0x1280108) == 0) {
                    entity.getMovementQueue().setPathX(baseX).setPathY(baseY);
                    return true;
                }
                if (baseX == destX + 1 && baseY == destY
                    && (RegionManager_1.RegionManager.getClipping(absX, absY, height, area) & 0x1280180) == 0) {
                    entity.getMovementQueue().setPathX(baseX).setPathY(baseY);
                    return true;
                }
            }
        }
        if (size == 2) {
            if (direction == 0) {
                if (baseX == destX - 1 && baseY == destY) {
                    entity.getMovementQueue().setPathX(baseX).setPathY(baseY);
                    return true;
                }
                if (baseX == destX && baseY == destY + 1) {
                    entity.getMovementQueue().setPathX(baseX).setPathY(baseY);
                    return true;
                }
                if (baseX == destX + 1 && baseY == destY
                    && (RegionManager_1.RegionManager.getClipping(absX, absY, height, area) & 0x1280180) == 0) {
                    entity.getMovementQueue().setPathX(baseX).setPathY(baseY);
                    return true;
                }
                if (baseX == destX && baseY == destY - 1
                    && (RegionManager_1.RegionManager.getClipping(absX, absY, height, area) & 0x1280102) == 0) {
                    entity.getMovementQueue().setPathX(baseX).setPathY(baseY);
                    return true;
                }
            }
            else if (direction == 1) {
                if (baseX == destX - 1 && baseY == destY
                    && (RegionManager_1.RegionManager.getClipping(absX, absY, height, area) & 0x1280108) == 0) {
                    entity.getMovementQueue().setPathX(baseX).setPathY(baseY);
                    return true;
                }
                if (baseX == destX && baseY == destY + 1) {
                    entity.getMovementQueue().setPathX(baseX).setPathY(baseY);
                    return true;
                }
                if (baseX == destX + 1 && baseY == destY) {
                    entity.getMovementQueue().setPathX(baseX).setPathY(baseY);
                    return true;
                }
                if (baseX == destX && baseY == destY - 1
                    && (RegionManager_1.RegionManager.getClipping(absX, absY, height, area) & 0x1280102) == 0) {
                    entity.getMovementQueue().setPathX(baseX).setPathY(baseY);
                    return true;
                }
            }
            else if (direction == 2) {
                if (baseX == destX - 1 && baseY == destY
                    && (RegionManager_1.RegionManager.getClipping(absX, absY, height, area) & 0x1280108) == 0) {
                    entity.getMovementQueue().setPathX(baseX).setPathY(baseY);
                    return true;
                }
                if (baseX == destX && baseY == destY + 1
                    && (RegionManager_1.RegionManager.getClipping(absX, absY, height, area) & 0x1280120) == 0) {
                    entity.getMovementQueue().setPathX(baseX).setPathY(baseY);
                    return true;
                }
                if (baseX == destX + 1 && baseY == destY) {
                    entity.getMovementQueue().setPathX(baseX).setPathY(baseY);
                    return true;
                }
                if (baseX == destX && baseY == destY - 1) {
                    entity.getMovementQueue().setPathX(baseX).setPathY(baseY);
                    return true;
                }
            }
            else if (direction == 3) {
                if (baseX == destX - 1 && baseY == destY) {
                    entity.getMovementQueue().setPathX(baseX).setPathY(baseY);
                    return true;
                }
                if (baseX == destX && baseY == destY + 1
                    && (RegionManager_1.RegionManager.getClipping(absX, absY, height, area) & 0x1280120) == 0) {
                    entity.getMovementQueue().setPathX(baseX).setPathY(baseY);
                    return true;
                }
                if (baseX == destX + 1 && baseY == destY
                    && (RegionManager_1.RegionManager.getClipping(absX, absY, height, area) & 0x1280180) == 0) {
                    entity.getMovementQueue().setPathX(baseX).setPathY(baseY);
                    return true;
                }
                if (baseX == destX && baseY == destY - 1) {
                    entity.getMovementQueue().setPathX(baseX).setPathY(baseY);
                    return true;
                }
            }
        }
        if (size == 9) {
            if (baseX == destX && baseY == destY + 1 && (RegionManager_1.RegionManager.getClipping(absX, absY, height, area) & 0x20) == 0) {
                entity.getMovementQueue().setPathX(baseX).setPathY(baseY);
                return true;
            }
            if (baseX == destX && baseY == destY - 1 && (RegionManager_1.RegionManager.getClipping(absX, absY, height, area) & 2) == 0) {
                entity.getMovementQueue().setPathX(baseX).setPathY(baseY);
                return true;
            }
            if (baseX == destX - 1 && baseY == destY && (RegionManager_1.RegionManager.getClipping(absX, absY, height, area) & 8) == 0) {
                entity.getMovementQueue().setPathX(baseX).setPathY(baseY);
                return true;
            }
            if (baseX == destX + 1 && baseY == destY && (RegionManager_1.RegionManager.getClipping(absX, absY, height, area) & 0x80) == 0) {
                entity.getMovementQueue().setPathX(baseX).setPathY(baseY);
                return true;
            }
        }
        return false;
    };
    PathFinder.largeRoutePath = function (entity, destX, destY, baseY, size, direction, baseX) {
        if (baseX === destX && baseY === destY) {
            entity.getMovementQueue().setPathX(baseX).setPathY(baseY);
            return true;
        }
        var absX = (entity.getLocation().getRegionX() << 3) + baseX;
        var absY = (entity.getLocation().getRegionY() << 3) + baseY;
        var height = entity.getLocation().getZ();
        var area = entity.getPrivateArea();
        baseX -= 0;
        baseY -= 0;
        destX -= 0;
        destY -= 0;
        if (size == 6 || size == 7) {
            if (size == 7)
                direction = direction + 2 & 3;
            if (direction == 0) {
                if (baseX == destX + 1 && baseY == destY
                    && (RegionManager_1.RegionManager.getClipping(absX, absY, height, area) & 0x80) == 0) {
                    entity.getMovementQueue().setPathX(baseX).setPathY(baseY);
                    return true;
                }
                if (baseX == destX && baseY == destY - 1
                    && (RegionManager_1.RegionManager.getClipping(absX, absY, height, area) & 2) == 0) {
                    entity.getMovementQueue().setPathX(baseX).setPathY(baseY);
                    return true;
                }
            }
            else if (direction == 1) {
                if (baseX == destX - 1 && baseY == destY
                    && (RegionManager_1.RegionManager.getClipping(absX, absY, height, area) & 8) == 0) {
                    entity.getMovementQueue().setPathX(baseX).setPathY(baseY);
                    return true;
                }
                if (baseX == destX && baseY == destY - 1
                    && (RegionManager_1.RegionManager.getClipping(absX, absY, height, area) & 2) == 0) {
                    entity.getMovementQueue().setPathX(baseX).setPathY(baseY);
                    return true;
                }
            }
            else if (direction == 2) {
                if (baseX == destX - 1 && baseY == destY
                    && (RegionManager_1.RegionManager.getClipping(absX, absY, height, area) & 8) == 0) {
                    entity.getMovementQueue().setPathX(baseX).setPathY(baseY);
                    return true;
                }
                if (baseX == destX && baseY == destY + 1
                    && (RegionManager_1.RegionManager.getClipping(absX, absY, height, area) & 0x20) == 0) {
                    entity.getMovementQueue().setPathX(baseX).setPathY(baseY);
                    return true;
                }
            }
            else if (direction == 3) {
                if (baseX == destX + 1 && baseY == destY
                    && (RegionManager_1.RegionManager.getClipping(absX, absY, height, area) & 0x80) == 0) {
                    entity.getMovementQueue().setPathX(baseX).setPathY(baseY);
                    return true;
                }
                if (baseX == destX && baseY == destY + 1
                    && (RegionManager_1.RegionManager.getClipping(absX, absY, height, area) & 0x20) == 0) {
                    entity.getMovementQueue().setPathX(baseX).setPathY(baseY);
                    return true;
                }
            }
        }
        if (size == 8) {
            if (baseX == destX && baseY == destY + 1
                && (RegionManager_1.RegionManager.getClipping(absX, absY, height, area) & 0x20) == 0) {
                entity.getMovementQueue().setPathX(baseX).setPathY(baseY);
                return true;
            }
            if (baseX == destX && baseY == destY - 1 && (RegionManager_1.RegionManager.getClipping(absX, absY, height, area) & 2) == 0) {
                entity.getMovementQueue().setPathX(baseX).setPathY(baseY);
                return true;
            }
            if (baseX == destX - 1 && baseY == destY && (RegionManager_1.RegionManager.getClipping(absX, absY, height, area) & 8) == 0) {
                entity.getMovementQueue().setPathX(baseX).setPathY(baseY);
                return true;
            }
            if (baseX == destX + 1 && baseY == destY
                && (RegionManager_1.RegionManager.getClipping(absX, absY, height, area) & 0x80) == 0) {
                entity.getMovementQueue().setPathX(baseX).setPathY(baseY);
                return true;
            }
        }
        return false;
    };
    PathFinder.sizeRoutePath = function (entity, destY, destX, baseX, sizeX, blockedMask, sizeY, baseY) {
        var absX = (entity.getLocation().getRegionX() << 3) + baseX;
        var absY = (entity.getLocation().getRegionY() << 3) + baseY;
        var height = entity.getLocation().getZ();
        var area = entity.getPrivateArea();
        var xOffset = 0;
        var yOffset = 0;
        var maxX = (destX + sizeY) - 1;
        var maxY = (destY + sizeX) - 1;
        // rest of the function logic
        if (baseX >= destX && baseX <= maxX && baseY >= destY && baseY <= maxY) {
            entity.getMovementQueue().setPathX(baseX).setPathY(baseY);
            return true;
        }
        if (baseX == destX - 1 && baseY >= destY && baseY <= maxY
            && (RegionManager_1.RegionManager.getClipping(absX - xOffset, absY - yOffset, height, area) & 8) == 0
            && (blockedMask & 8) == 0) {
            entity.getMovementQueue().setPathX(baseX).setPathY(baseY);
            return true;
        }
        if (baseX == maxX + 1 && baseY >= destY && baseY <= maxY
            && (RegionManager_1.RegionManager.getClipping(absX - xOffset, absY - yOffset, height, area) & 0x80) == 0
            && (blockedMask & 2) == 0) {
            entity.getMovementQueue().setPathX(baseX).setPathY(baseY);
            return true;
        }
        if (baseY == destY - 1 && baseX >= destX && baseX <= maxX
            && (RegionManager_1.RegionManager.getClipping(absX - xOffset, absY - yOffset, height, area) & 2) == 0
            && (blockedMask & 4) == 0 || baseY == maxY + 1 && baseX >= destX && baseX <= maxX
            && (RegionManager_1.RegionManager.getClipping(absX - xOffset, absY - yOffset, height, area) & 0x20) == 0
            && (blockedMask & 1) == 0) {
            entity.getMovementQueue().setPathX(baseX).setPathY(baseY);
            return true;
        }
        return false;
    };
    PathFinder.findWalkable = function (entity, x, y, targetSize) {
        // Step West
        if (PathFinder.calculateRoute(entity, entity.getSize(), x - targetSize, y, 0, 0, 0, 0, false) > 0)
            return true;
        // Step East
        if (PathFinder.calculateRoute(entity, entity.getSize(), x + targetSize, y, 0, 0, 0, 0, false) > 0)
            return true;
        // Step North
        if (PathFinder.calculateRoute(entity, entity.getSize(), x, y + targetSize, 0, 0, 0, 0, false) > 0)
            return true;
        // Step South
        if (PathFinder.calculateRoute(entity, entity.getSize(), x, y - targetSize, 0, 0, 0, 0, false) > 0)
            return true;
        return false;
    };
    PathFinder.WEST = 0x1280108;
    PathFinder.EAST = 0x1280180;
    PathFinder.SOUTH = 0x1280102;
    PathFinder.NORTH = 0x1280120;
    PathFinder.SOUTHEAST = 0x1280183;
    PathFinder.SOUTHWEST = 0x128010e;
    PathFinder.NORTHEAST = 0x12801e0;
    PathFinder.NORTHWEST = 0x1280138;
    PathFinder.TILE_DISTANCE_DELTAS = new Map()
        .set(1, [[-1, 0], [0, -1], [0, 1], [1, 0]])
        .set(2, [[-2, 0], [-1, -1], [-1, 1], [0, -2], [0, 2], [1, -1], [1, 1], [2, 0]])
        .set(3, [[-3, 0], [-2, -2], [-2, -1], [-2, 1], [-2, 2], [-1, -2], [-1, 2], [0, -3], [0, 3], [1, -2], [1, 2], [2, -2], [2, -1], [2, 1], [2, 2], [3, 0]])
        .set(4, [[-4, 0], [-3, -2], [-3, -1], [-3, 1], [-3, 2], [-2, -3], [-2, 3], [-1, -3], [-1, 3], [0, -4], [0, 4], [1, -3], [1, 3], [2, -3], [2, 3], [3, -2], [3, -1], [3, 1], [3, 2], [4, 0]])
        .set(5, [[-5, 0], [-4, -3], [-4, -2], [-4, -1], [-4, 1], [-4, 2], [-4, 3], [-3, -4], [-3, -3], [-3, 3], [-3, 4], [-2, -4], [-2, 4], [-1, -4], [-1, 4], [0, -5], [0, 5], [1, -4], [1, 4], [2, -4], [2, 4], [3, -4], [3, -3], [3, 3], [3, 4], [4, -3], [4, -2], [4, -1], [4, 1], [4, 2], [4, 3], [5, 0]])
        .set(6, [[-6, 0], [-5, -3], [-5, -2], [-5, -1], [-5, 1], [-5, 2], [-5, 3], [-4, -4], [-4, 4], [-3, -5], [-3, 5], [-2, -5], [-2, 5], [-1, -5], [-1, 5], [0, -6], [0, 6], [1, -5], [1, 5], [2, -5], [2, 5], [3, -5], [3, 5], [4, -4], [4, 4], [5, -3], [5, -2], [5, -1], [5, 1], [5, 2], [5, 3], [6, 0]])
        .set(7, [[-7, 0], [-6, -3], [-6, -2], [-6, -1], [-6, 1], [-6, 2], [-6, 3], [-5, -4], [-5, 4], [-4, -5], [-4, 5], [-3, -6], [-3, 6], [-2, -6], [-2, 6], [-1, -6], [-1, 6], [0, -7], [0, 7], [1, -6], [1, 6], [2, -6], [2, 6], [3, -6], [3, 6], [4, -5], [4, 5], [5, -4], [5, 4], [6, -3], [6, -2], [6, -1], [6, 1], [6, 2], [6, 3], [7, 0]])
        .set(8, [[-8, 0], [-7, -3], [-7, -2], [-7, -1], [-7, 1], [-7, 2], [-7, 3], [-6, -5], [-6, -4],
        [-6, 4], [-6, 5], [-5, -6], [-5, -5], [-5, 5], [-5, 6], [-4, -6], [-4, 6], [-3, -7], [-3, 7], [-2, -7],
        [-2, 7], [-1, -7], [-1, 7], [0, -8], [0, 8], [1, -7], [1, 7], [2, -7], [2, 7], [3, -7], [3, 7], [4, -6],
        [4, 6], [5, -6], [5, -5], [5, 5], [5, 6], [6, -5], [6, -4], [6, 4], [6, 5], [7, -3], [7, -2], [7, -1],
        [7, 1], [7, 2], [7, 3], [8, 0]])
        // Deltas which are exactly 9 squares away
        .set(9, [
        [-9, 0], [-8, -4], [-8, -3], [-8, -2], [-8, -1], [-8, 1], [-8, 2], [-8, 3], [-8, 4],
        [-7, -5], [-7, -4], [-7, 4], [-7, 5], [-6, -6], [-6, 6], [-5, -7], [-5, 7], [-4, -8], [-4, -7], [-4, 7],
        [-4, 8], [-3, -8], [-3, 8], [-2, -8], [-2, 8], [-1, -8], [-1, 8], [0, -9], [0, 9], [1, -8], [1, 8],
        [2, -8], [2, 8], [3, -8], [3, 8], [4, -8], [4, -7], [4, 7], [4, 8], [5, -7], [5, 7], [6, -6], [6, 6],
        [7, -5], [7, -4], [7, 4], [7, 5], [8, -4], [8, -3], [8, -2], [8, -1], [8, 1], [8, 2], [8, 3], [8, 4], [9, 0]
    ])
        .set(10, [
        [-10, 0], [-9, -4], [-9, -3], [-9, -2], [-9, -1], [-9, 1], [-9, 2], [-9, 3], [-9, 4],
        [-8, -6], [-8, -5], [-8, 5], [-8, 6], [-7, -7], [-7, -6], [-7, 6], [-7, 7], [-6, -8], [-6, -7], [-6, 7],
        [-6, 8], [-5, -8], [-5, 8], [-4, -9], [-4, 9], [-3, -9], [-3, 9], [-2, -9], [-2, 9], [-1, -9], [-1, 9],
        [0, -10], [0, 10], [1, -9], [1, 9], [2, -9], [2, 9], [3, -9], [3, 9], [4, -9], [4, 9], [5, -8], [5, 8],
        [6, -8], [6, -7], [6, 7], [6, 8], [7, -7], [7, -6], [7, 6], [7, 7], [8, -6], [8, -5], [8, 5], [8, 6], [9, -4],
        [9, -3], [9, -2], [9, -1], [9, 1], [9, 2], [9, 3], [9, 4], [10, 0]
    ]);
    return PathFinder;
}());
//# sourceMappingURL=PathFinder.js.map