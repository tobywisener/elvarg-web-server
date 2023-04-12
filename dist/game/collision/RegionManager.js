"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegionManager = void 0;
var GameConstants_1 = require("../GameConstants");
var ObjectDefinition_1 = require("../definition/ObjectDefinition");
var GameObject_1 = require("../entity/impl/object/GameObject");
var MapObjects_1 = require("../entity/impl/object/MapObjects");
var Location_1 = require("../model/Location");
var fs_extra_1 = require("fs-extra");
var Buffer_1 = require("./Buffer");
var Region_1 = require("./Region");
var pako_1 = require("pako");
var RegionManager = exports.RegionManager = /** @class */ (function () {
    function RegionManager() {
    }
    RegionManager.init = function () {
        // Load object definitions..
        ObjectDefinition_1.ObjectDefinition.init();
        // Load regions..
        var map_index = new fs_extra_1.fs(GameConstants_1.GameConstants.CLIPPING_DIRECTORY + "map_index");
        if (!map_index.exists()) {
            throw new Error("map_index was not found!");
        }
        var data = fs_extra_1.fs.readAllBytes(map_index.toPath());
        var stream = new Buffer_1.Buffer(data);
        var size = stream.readUShort();
        for (var i = 0; i < size; i++) {
            var regionId = stream.readUShort();
            var terrainFile = stream.readUShort();
            var objectFile = stream.readUShort();
            RegionManager.regions.set(regionId, new Region_1.Region(regionId, terrainFile, objectFile));
        }
    };
    RegionManager.getRegionid = function (regionId) {
        return this.regions.get(regionId);
    };
    RegionManager.getRegion = function (x, y) {
        RegionManager.loadMapFiles(x, y);
        var regionX = x >> 3;
        var regionY = y >> 3;
        var regionId = ((regionX / 8) << 8) + (regionY / 8);
        return RegionManager.getRegionid(regionId);
    };
    RegionManager.addClippingForVariableObject = function (x, y, height, type, direction, tall, privateArea) {
        if (type == 0) {
            if (direction == 0) {
                this.addClipping(x, y, height, 128, privateArea);
                this.addClipping(x - 1, y, height, 8, privateArea);
            }
            else if (direction == 1) {
                this.addClipping(x, y, height, 2, privateArea);
                this.addClipping(x, y + 1, height, 32, privateArea);
            }
            else if (direction == 2) {
                this.addClipping(x, y, height, 8, privateArea);
                this.addClipping(x + 1, y, height, 128, privateArea);
            }
            else if (direction == 3) {
                this.addClipping(x, y, height, 32, privateArea);
                this.addClipping(x, y - 1, height, 2, privateArea);
            }
        }
        else if (type == 1 || type == 3) {
            if (direction == 0) {
                this.addClipping(x, y, height, 1, privateArea);
                this.addClipping(x - 1, y, height, 16, privateArea);
            }
            else if (direction == 1) {
                this.addClipping(x, y, height, 4, privateArea);
                this.addClipping(x + 1, y + 1, height, 64, privateArea);
            }
            else if (direction == 2) {
                this.addClipping(x, y, height, 16, privateArea);
                this.addClipping(x + 1, y - 1, height, 1, privateArea);
            }
            else if (direction == 3) {
                this.addClipping(x, y, height, 64, privateArea);
                this.addClipping(x - 1, y - 1, height, 4, privateArea);
            }
        }
        else if (type == 2) {
            if (direction == 0) {
                this.addClipping(x, y, height, 130, privateArea);
                this.addClipping(x - 1, y, height, 8, privateArea);
                this.addClipping(x, y + 1, height, 32, privateArea);
            }
            else if (direction == 1) {
                this.addClipping(x, y, height, 10, privateArea);
                this.addClipping(x, y + 1, height, 32, privateArea);
                this.addClipping(x + 1, y, height, 128, privateArea);
            }
            else if (direction == 2) {
                this.addClipping(x, y, height, 40, privateArea);
                this.addClipping(x + 1, y, height, 128, privateArea);
                this.addClipping(x, y - 1, height, 2, privateArea);
            }
            else if (direction == 3) {
                this.addClipping(x, y, height, 160, privateArea);
                this.addClipping(x, y - 1, height, 2, privateArea);
                this.addClipping(x - 1, y, height, 8, privateArea);
            }
        }
        if (tall) {
            // If an object is tall, it blocks projectiles too
            if (type == 0) {
                if (direction == 0) {
                    this.addClipping(x, y, height, 65536, privateArea);
                    this.addClipping(x - 1, y, height, 4096, privateArea);
                }
                else if (direction == 1) {
                    this.addClipping(x, y, height, 1024, privateArea);
                    this.addClipping(x, y + 1, height, 16384, privateArea);
                }
                else if (direction == 2) {
                    this.addClipping(x, y, height, 4096, privateArea);
                    this.addClipping(x + 1, y, height, 65536, privateArea);
                }
                else if (direction == 3) {
                    this.addClipping(x, y, height, 16384, privateArea);
                    this.addClipping(x, y - 1, height, 1024, privateArea);
                }
            }
            else if (type == 1 || type == 3) {
                if (direction == 0) {
                    this.addClipping(x, y, height, 512, privateArea);
                    this.addClipping(x - 1, y + 1, height, 8192, privateArea);
                }
                else if (direction == 1) {
                    this.addClipping(x, y, height, 2048, privateArea);
                    this.addClipping(x + 1, y + 1, height, 32768, privateArea);
                }
                else if (direction == 2) {
                    this.addClipping(x, y, height, 8192, privateArea);
                    this.addClipping(x + 1, y + 1, height, 512, privateArea);
                }
                else if (direction == 3) {
                    this.addClipping(x, y, height, 32768, privateArea);
                    this.addClipping(x - 1, y - 1, height, 2048, privateArea);
                }
            }
            else if (type == 2) {
                if (direction == 0) {
                    this.addClipping(x, y, height, 66560, privateArea);
                    this.addClipping(x - 1, y, height, 4096, privateArea);
                    this.addClipping(x, y + 1, height, 16384, privateArea);
                }
                else if (direction == 1) {
                    this.addClipping(x, y, height, 5120, privateArea);
                    this.addClipping(x, y + 1, height, 16384, privateArea);
                    this.addClipping(x + 1, y, height, 65536, privateArea);
                }
                else if (direction == 2) {
                    this.addClipping(x, y, height, 20480, privateArea);
                    this.addClipping(x + 1, y, height, 65536, privateArea);
                    this.addClipping(x, y - 1, height, 1024, privateArea);
                }
                else if (direction == 3) {
                    this.addClipping(x, y, height, 81920, privateArea);
                    this.addClipping(x, y - 1, height, 1024, privateArea);
                    this.addClipping(x - 1, y, height, 4096, privateArea);
                }
            }
        }
    };
    RegionManager.removeClippingForVariableObject = function (x, y, height, type, direction, tall, privateArea) {
        if (type == 0) {
            if (direction == 0) {
                RegionManager.removeClipping(x, y, height, 128, privateArea);
                RegionManager.removeClipping(x - 1, y, height, 8, privateArea);
            }
            else if (direction == 1) {
                RegionManager.removeClipping(x, y, height, 2, privateArea);
                RegionManager.removeClipping(x, y + 1, height, 32, privateArea);
            }
            else if (direction == 2) {
                RegionManager.removeClipping(x, y, height, 8, privateArea);
                RegionManager.removeClipping(x + 1, y, height, 128, privateArea);
            }
            else if (direction == 3) {
                RegionManager.removeClipping(x, y, height, 32, privateArea);
                RegionManager.removeClipping(x, y - 1, height, 2, privateArea);
            }
        }
        else if (type == 1 || type == 3) {
            if (direction == 0) {
                RegionManager.removeClipping(x, y, height, 1, privateArea);
                RegionManager.removeClipping(x - 1, y, height, 16, privateArea);
            }
            else if (direction == 1) {
                RegionManager.removeClipping(x, y, height, 4, privateArea);
                RegionManager.removeClipping(x + 1, y + 1, height, 64, privateArea);
            }
            else if (direction == 2) {
                RegionManager.removeClipping(x, y, height, 16, privateArea);
                RegionManager.removeClipping(x + 1, y - 1, height, 1, privateArea);
            }
            else if (direction == 3) {
                RegionManager.removeClipping(x, y, height, 64, privateArea);
                RegionManager.removeClipping(x - 1, y - 1, height, 4, privateArea);
            }
        }
        else if (type == 2) {
            if (direction == 0) {
                RegionManager.removeClipping(x, y, height, 130, privateArea);
                RegionManager.removeClipping(x - 1, y, height, 8, privateArea);
                RegionManager.removeClipping(x, y + 1, height, 32, privateArea);
            }
            else if (direction == 1) {
                RegionManager.removeClipping(x, y, height, 10, privateArea);
                RegionManager.removeClipping(x, y + 1, height, 32, privateArea);
                RegionManager.removeClipping(x + 1, y, height, 128, privateArea);
            }
            else if (direction == 2) {
                RegionManager.removeClipping(x, y, height, 40, privateArea);
                RegionManager.removeClipping(x + 1, y, height, 128, privateArea);
                RegionManager.removeClipping(x, y - 1, height, 2, privateArea);
            }
            else if (direction == 3) {
                RegionManager.removeClipping(x, y, height, 160, privateArea);
                RegionManager.removeClipping(x, y - 1, height, 2, privateArea);
                RegionManager.removeClipping(x - 1, y, height, 8, privateArea);
            }
        }
        if (tall) {
            // If an object is tall, it blocks projectiles too
            if (type === 0) {
                if (direction === 0) {
                    RegionManager.removeClipping(x, y, height, 65536, privateArea);
                    RegionManager.removeClipping(x - 1, y, height, 4096, privateArea);
                }
                else if (direction === 1) {
                    RegionManager.removeClipping(x, y, height, 1024, privateArea);
                    RegionManager.removeClipping(x, y + 1, height, 16384, privateArea);
                }
                else if (direction === 2) {
                    RegionManager.removeClipping(x, y, height, 4096, privateArea);
                    RegionManager.removeClipping(x + 1, y, height, 65536, privateArea);
                }
                else if (direction === 3) {
                    RegionManager.removeClipping(x, y, height, 16384, privateArea);
                    RegionManager.removeClipping(x, y - 1, height, 1024, privateArea);
                }
            }
        }
        if (type == 1 || type == 3) {
            if (direction == 0) {
                RegionManager.removeClipping(x, y, height, 512, privateArea);
                RegionManager.removeClipping(x - 1, y + 1, height, 8192, privateArea);
            }
            else if (direction == 1) {
                RegionManager.removeClipping(x, y, height, 2048, privateArea);
                RegionManager.removeClipping(x + 1, y + 1, height, 32768, privateArea);
            }
            else if (direction == 2) {
                RegionManager.removeClipping(x, y, height, 8192, privateArea);
                RegionManager.removeClipping(x + 1, y + 1, height, 512, privateArea);
            }
            else if (direction == 3) {
                RegionManager.removeClipping(x, y, height, 32768, privateArea);
                RegionManager.removeClipping(x - 1, y - 1, height, 2048, privateArea);
            }
        }
        else if (type == 2) {
            if (direction == 0) {
                RegionManager.removeClipping(x, y, height, 66560, privateArea);
                RegionManager.removeClipping(x - 1, y, height, 4096, privateArea);
                RegionManager.removeClipping(x, y + 1, height, 16384, privateArea);
            }
            else if (direction == 1) {
                RegionManager.removeClipping(x, y, height, 5120, privateArea);
                RegionManager.removeClipping(x, y + 1, height, 16384, privateArea);
                RegionManager.removeClipping(x + 1, y, height, 65536, privateArea);
            }
            else if (direction == 2) {
                RegionManager.removeClipping(x, y, height, 20480, privateArea);
                RegionManager.removeClipping(x + 1, y, height, 65536, privateArea);
                RegionManager.removeClipping(x, y - 1, height, 1024, privateArea);
            }
            else if (direction == 3) {
                RegionManager.removeClipping(x, y, height, 81920, privateArea);
                RegionManager.removeClipping(x, y - 1, height, 1024, privateArea);
                RegionManager.removeClipping(x - 1, y, height, 4096, privateArea);
            }
        }
    };
    RegionManager.addClippingForSolidObject = function (x, y, height, xLength, yLength, flag, privateArea) {
        var clipping = 256;
        if (flag) {
            clipping += 0x20000;
        }
        for (var i = x; i < x + xLength; i++) {
            for (var i2 = y; i2 < y + yLength; i2++) {
                this.addClipping(i, i2, height, clipping, privateArea);
            }
        }
    };
    RegionManager.removeClippingForSolidObject = function (x, y, height, xLength, yLength, flag, privateArea) {
        var clipping = 256;
        if (flag) {
            clipping += 0x20000;
        }
        for (var x_ = x; x_ < x + xLength; x_++) {
            for (var y_ = y; y_ < y + yLength; y_++) {
                this.removeClipping(x_, y_, height, clipping, privateArea);
            }
        }
    };
    RegionManager.addObject = function (objectId, x, y, height, type, direction) {
        var position = new Location_1.Location(x, y);
        if (height === 0) {
            if (x >= 3092 && x <= 3094 && (y === 3513 || y === 3514 || y === 3507 || y === 3506)) {
                objectId = -1;
            }
        }
        switch (objectId) {
            case 14233: // pest control gates
            case 14235: // pest control gates
                return;
        }
        if (objectId === -1) {
            MapObjects_1.MapObjects.clear(position, type);
        }
        else {
            MapObjects_1.MapObjects.add(new GameObject_1.GameObject(objectId, position, type, direction, null));
        }
    };
    RegionManager.addObjectClipping = function (object) {
        var id = object.getId();
        var x = object.getLocation().getX();
        var y = object.getLocation().getY();
        var height = object.getLocation().getZ();
        var type = object.getType();
        var direction = object.getFace();
        if (id === -1) {
            this.removeClipping(x, y, height, 0x000000, object.getPrivateArea());
            return;
        }
        var def = object.getDefinition();
        if (!def) {
            return;
        }
        var xLength;
        var yLength;
        if (direction !== 1 && direction !== 3) {
            xLength = def.getSizeX();
            yLength = def.getSizeY();
        }
        else {
            yLength = def.getSizeX();
            xLength = def.getSizeY();
        }
        if (type === 22) {
            if (def.hasActions() && ObjectDefinition_1.ObjectDefinition.solid) {
                RegionManager.addClipping(x, y, height, 0x200000, object.getPrivateArea());
            }
        }
        else if (type >= 9) {
            if (ObjectDefinition_1.ObjectDefinition.solid) {
                RegionManager.addClippingForSolidObject(x, y, height, xLength, yLength, ObjectDefinition_1.ObjectDefinition.impenetrable, object.getPrivateArea());
            }
        }
        else if (type >= 0 && type <= 3) {
            if (ObjectDefinition_1.ObjectDefinition.solid) {
                RegionManager.addClippingForVariableObject(x, y, height, type, direction, ObjectDefinition_1.ObjectDefinition.impenetrable, object.getPrivateArea());
            }
        }
    };
    RegionManager.removeObjectClipping = function (object) {
        var x = object.getLocation().getX();
        var y = object.getLocation().getY();
        var height = object.getLocation().getZ();
        var type = object.getType();
        var direction = object.getFace();
        if (object.getId() === -1) {
            this.removeClipping(x, y, height, 0x000000, object.getPrivateArea());
            return;
        }
        var def = object.getDefinition();
        if (!def) {
            return;
        }
        var xLength;
        var yLength;
        if (direction !== 1 && direction !== 3) {
            xLength = def.getSizeX();
            yLength = def.getSizeY();
        }
        else {
            yLength = def.getSizeX();
            xLength = def.getSizeY();
        }
        if (type === 22) {
            if (def.hasActions() && ObjectDefinition_1.ObjectDefinition.solid) {
                this.removeClipping(x, y, height, 0x200000, object.getPrivateArea());
            }
        }
        else if (type >= 9) {
            if (ObjectDefinition_1.ObjectDefinition.solid) {
                this.removeClippingForSolidObject(x, y, height, xLength, yLength, ObjectDefinition_1.ObjectDefinition.solid, object.getPrivateArea());
            }
        }
        else if (type >= 0 && type <= 3) {
            if (ObjectDefinition_1.ObjectDefinition.solid) {
                RegionManager.removeClippingForVariableObject(x, y, height, type, direction, ObjectDefinition_1.ObjectDefinition.solid, object.getPrivateArea());
            }
        }
    };
    RegionManager.addClipping = function (x, y, height, shift, privateArea) {
        if (privateArea) {
            privateArea.setClip(new Location_1.Location(x, y), shift);
            return;
        }
        var r = RegionManager.getRegion(x, y);
        if (r) {
            r.addClip(x, y, height, shift);
        }
    };
    RegionManager.removeClipping = function (x, y, height, shift, privateArea) {
        if (privateArea) {
            privateArea.removeClip(new Location_1.Location(x, y, height));
            return;
        }
        var r = RegionManager.getRegion(x, y);
        if (r) {
            r.removeClip(x, y, height, shift);
        }
    };
    RegionManager.getClipping = function (x, y, height, privateArea) {
        if (privateArea) {
            var privateClip = privateArea.getClip(new Location_1.Location(x, y));
            if (privateClip !== 0) {
                return privateClip;
            }
        }
        var r = RegionManager.getRegion(x, y);
        if (r) {
            return r.getClip(x, y, height);
        }
        return 0;
    };
    RegionManager.wallExists = function (location, area, type) {
        var object = MapObjects_1.MapObjects.get(type, location, area);
        if (object) {
            var objectDef = object.getDefinition();
            if (!objectDef.name || objectDef.name === "null") {
                return true;
            }
        }
        return false;
    };
    RegionManager.wallsExist = function (location, area) {
        if (RegionManager.wallExists(location, area, 0)) {
            return true;
        }
        if (RegionManager.wallExists(location, area, 1)) {
            return true;
        }
        if (RegionManager.wallExists(location, area, 2)) {
            return true;
        }
        if (RegionManager.wallExists(location, area, 3)) {
            return true;
        }
        if (RegionManager.wallExists(location, area, 9)) {
            return true;
        }
        return false;
    };
    RegionManager.canMoveIsBlocked = function (pos, direction, privateArea) {
        if (direction === 0) {
            return !RegionManager.blockedNorthWest(pos, privateArea) && !RegionManager.blockedNorth(pos, privateArea) && !RegionManager.blockedWest(pos, privateArea);
        }
        else if (direction === 1) {
            return !RegionManager.blockedNorth(pos, privateArea);
        }
        else if (direction === 2) {
            return !RegionManager.blockedNorthEast(pos, privateArea) && !RegionManager.blockedNorth(pos, privateArea) && !RegionManager.blockedEast(pos, privateArea);
        }
        else if (direction === 3) {
            return !RegionManager.blockedWest(pos, privateArea);
        }
        else if (direction === 4) {
            return !RegionManager.blockedEast(pos, privateArea);
        }
        else if (direction === 5) {
            return !RegionManager.blockedSouthWest(pos, privateArea) && !RegionManager.blockedSouth(pos, privateArea) && !RegionManager.blockedWest(pos, privateArea);
        }
        else if (direction === 6) {
            return !RegionManager.blockedSouth(pos, privateArea);
        }
        else if (direction === 7) {
            return !RegionManager.blockedSouthEast(pos, privateArea) && !RegionManager.blockedSouth(pos, privateArea) && !RegionManager.blockedEast(pos, privateArea);
        }
        return false;
    };
    RegionManager.blockedProjectile = function (position, privateArea) {
        return (RegionManager.getClipping(position.getX(), position.getY(), position.getZ(), privateArea) & 0x20000) === 0;
    };
    RegionManager.blocked = function (pos, privateArea) {
        return (RegionManager.getClipping(pos.getX(), pos.getY(), pos.getZ(), privateArea) & 0x1280120) !== 0;
    };
    RegionManager.blockedNorth = function (pos, privateArea) {
        return (RegionManager.getClipping(pos.getX(), pos.getY() + 1, pos.getZ(), privateArea) & 0x1280120) !== 0;
    };
    RegionManager.blockedEast = function (pos, privateArea) {
        return (RegionManager.getClipping(pos.getX() + 1, pos.getY(), pos.getZ(), privateArea) & 0x1280180) !== 0;
    };
    RegionManager.blockedSouth = function (pos, privateArea) {
        return (RegionManager.getClipping(pos.getX(), pos.getY() - 1, pos.getZ(), privateArea) & 0x1280102) !== 0;
    };
    RegionManager.blockedWest = function (pos, privateArea) {
        return (RegionManager.getClipping(pos.getX() - 1, pos.getY(), pos.getZ(), privateArea) & 0x1280108) != 0;
    };
    RegionManager.blockedNorthEast = function (pos, privateArea) {
        return (RegionManager.getClipping(pos.getX() + 1, pos.getY() + 1, pos.getZ(), privateArea) & 0x12801e0) != 0;
    };
    RegionManager.blockedNorthWest = function (pos, privateArea) {
        return (RegionManager.getClipping(pos.getX() - 1, pos.getY() + 1, pos.getZ(), privateArea) & 0x1280138) != 0;
    };
    RegionManager.blockedSouthEast = function (pos, privateArea) {
        return (RegionManager.getClipping(pos.getX() + 1, pos.getY() - 1, pos.getZ(), privateArea) & 0x1280183) != 0;
    };
    RegionManager.blockedSouthWest = function (pos, privateArea) {
        return (RegionManager.getClipping(pos.getX() - 1, pos.getY() - 1, pos.getZ(), privateArea) & 0x128010e) != 0;
    };
    RegionManager.canProjectileAttack = function (attacker, from, to) {
        var a = from;
        var b = to;
        if (a.getX() > b.getX()) {
            a = to;
            b = from;
        }
        return this.canProjectileAttack(attacker, from, to);
    };
    RegionManager.canProjectileAttackTarget = function (attacker, target) {
        var a = attacker.getLocation();
        var b = target.getLocation();
        if (attacker.isPlayer() && target.isPlayer()) {
            if (a.getX() > b.getX()) {
                a = target.getLocation();
                b = attacker.getLocation();
            }
        }
        else if (target.isPlayer()) {
            a = target.getLocation();
            b = attacker.getLocation();
        }
        return RegionManager.canProjectileAttack(attacker, a, b);
    };
    RegionManager.canProjectileAttackReturn = function (a, b, size, area) {
        return RegionManager.canProjectileMove(a.getX(), a.getY(), b.getX(), b.getY(), a.getZ(), size, size, area);
    };
    RegionManager.canProjectileMove = function (startX, startY, endX, endY, height, xLength, yLength, privateArea) {
        var diffX = endX - startX;
        var diffY = endY - startY;
        var max = Math.max(Math.abs(diffX), Math.abs(diffY));
        for (var ii = 0; ii < max; ii++) {
            var currentX = endX - diffX;
            var currentY = endY - diffY;
            for (var i = 0; i < xLength; i++) {
                for (var i2 = 0; i2 < yLength; i2++) {
                    if (diffX < 0 && diffY < 0) {
                        if ((RegionManager.getClipping(currentX + i - 1, currentY + i2 - 1, height, privateArea) & (RegionManager.UNLOADED_TILE
                            | /* BLOCKED_TILE | */ RegionManager.UNKNOWN | RegionManager.PROJECTILE_TILE_BLOCKED | RegionManager.PROJECTILE_EAST_BLOCKED
                            | RegionManager.PROJECTILE_NORTH_EAST_BLOCKED | RegionManager.PROJECTILE_NORTH_BLOCKED)) != 0
                            || (RegionManager.getClipping(currentX + i - 1, currentY + i2, height, privateArea)
                                & (RegionManager.UNLOADED_TILE | /* BLOCKED_TILE | */ RegionManager.UNKNOWN | RegionManager.PROJECTILE_TILE_BLOCKED
                                    | RegionManager.PROJECTILE_EAST_BLOCKED)) != 0
                            || (RegionManager.getClipping(currentX + i, currentY + i2 - 1, height, privateArea)
                                & (RegionManager.UNLOADED_TILE | /* BLOCKED_TILE | */ RegionManager.UNKNOWN | RegionManager.PROJECTILE_TILE_BLOCKED
                                    | RegionManager.PROJECTILE_NORTH_BLOCKED)) != 0) {
                            return false;
                        }
                    }
                    else if (diffX < 0 && diffY > 0) {
                        if ((RegionManager.getClipping(currentX + i - 1, currentY + i2 + 1, height, privateArea) & (RegionManager.UNLOADED_TILE | RegionManager.UNKNOWN | RegionManager.PROJECTILE_TILE_BLOCKED | RegionManager.PROJECTILE_SOUTH_BLOCKED | RegionManager.PROJECTILE_SOUTH_EAST_BLOCKED | RegionManager.PROJECTILE_EAST_BLOCKED)) != 0
                            || (RegionManager.getClipping(currentX + i - 1, currentY + i2, height, privateArea) & (RegionManager.UNLOADED_TILE | RegionManager.UNKNOWN | RegionManager.PROJECTILE_TILE_BLOCKED | RegionManager.PROJECTILE_EAST_BLOCKED)) != 0
                            || (RegionManager.getClipping(currentX + i, currentY + i2 + 1, height, privateArea) & (RegionManager.UNLOADED_TILE | RegionManager.UNKNOWN | RegionManager.PROJECTILE_TILE_BLOCKED | RegionManager.PROJECTILE_SOUTH_BLOCKED)) != 0) {
                            return false;
                        }
                    }
                    else if (diffX > 0 && diffY < 0) {
                        if ((RegionManager.getClipping(currentX + i + 1, currentY + i2 - 1, height, privateArea) & (RegionManager.UNLOADED_TILE
                            | /* BLOCKED_TILE | */ RegionManager.UNKNOWN | RegionManager.PROJECTILE_TILE_BLOCKED | RegionManager.PROJECTILE_WEST_BLOCKED
                            | RegionManager.PROJECTILE_NORTH_BLOCKED | RegionManager.PROJECTILE_NORTH_WEST_BLOCKED)) != 0
                            || (RegionManager.getClipping(currentX + i + 1, currentY + i2, height, privateArea)
                                & (RegionManager.UNLOADED_TILE | /* BLOCKED_TILE | */ RegionManager.UNKNOWN | RegionManager.PROJECTILE_TILE_BLOCKED
                                    | RegionManager.PROJECTILE_WEST_BLOCKED)) != 0
                            || (RegionManager.getClipping(currentX + i, currentY + i2 - 1, height, privateArea)
                                & (RegionManager.UNLOADED_TILE | /* BLOCKED_TILE | */ RegionManager.UNKNOWN | RegionManager.PROJECTILE_TILE_BLOCKED
                                    | RegionManager.PROJECTILE_NORTH_BLOCKED)) != 0) {
                            return false;
                        }
                    }
                    else if (diffX > 0 && diffY == 0) {
                        if ((RegionManager.getClipping(currentX + i + 1, currentY + i2, height, privateArea)
                            & (RegionManager.UNLOADED_TILE | /* BLOCKED_TILE | */ RegionManager.UNKNOWN | RegionManager.PROJECTILE_TILE_BLOCKED
                                | RegionManager.PROJECTILE_WEST_BLOCKED)) != 0) {
                            return false;
                        }
                    }
                    else if (diffX < 0 && diffY == 0) {
                        if ((RegionManager.getClipping(currentX + i - 1, currentY + i2, height, privateArea)
                            & (RegionManager.UNLOADED_TILE | /* BLOCKED_TILE | */ RegionManager.UNKNOWN | RegionManager.PROJECTILE_TILE_BLOCKED
                                | RegionManager.PROJECTILE_EAST_BLOCKED)) != 0) {
                            return false;
                        }
                    }
                    else if (diffX === 0 && diffY > 0) {
                        if ((RegionManager.getClipping(currentX + i, currentY + i2 + 1, height, privateArea) & (RegionManager.UNLOADED_TILE | RegionManager.UNKNOWN | RegionManager.PROJECTILE_TILE_BLOCKED | RegionManager.PROJECTILE_SOUTH_BLOCKED)) !== 0) {
                            return false;
                        }
                    }
                    else if (diffX === 0 && diffY < 0) {
                        if ((RegionManager.getClipping(currentX + i, currentY + i2 - 1, height, privateArea) & (RegionManager.UNLOADED_TILE | RegionManager.UNKNOWN | RegionManager.PROJECTILE_TILE_BLOCKED | RegionManager.PROJECTILE_NORTH_BLOCKED)) !== 0) {
                            return false;
                        }
                    }
                }
            }
            if (diffX < 0) {
                diffX++;
            }
            else if (diffX > 0) {
                diffX--;
            }
            if (diffY < 0) {
                diffY++;
            }
            else if (diffY > 0) {
                diffY--;
            }
        }
        return true;
    };
    RegionManager.canMove = function (startX, startY, endX, endY, height, xLength, yLength, privateArea) {
        var diffX = endX - startX;
        var diffY = endY - startY;
        var max = Math.max(Math.abs(diffX), Math.abs(diffY));
        for (var ii = 0; ii < max; ii++) {
            var currentX = endX - diffX;
            var currentY = endY - diffY;
            for (var i = 0; i < xLength; i++) {
                for (var i2 = 0; i2 < yLength; i2++)
                    if (diffX < 0 && diffY < 0) {
                        if ((RegionManager.getClipping((currentX + i) - 1, (currentY + i2) - 1, height, privateArea) & 0x128010e) !== 0
                            || (RegionManager.getClipping((currentX + i) - 1, currentY + i2, height, privateArea) & 0x1280108) !== 0
                            || (RegionManager.getClipping(currentX + i, (currentY + i2) - 1, height, privateArea) & 0x1280102) !== 0)
                            return false;
                    }
                    else if (diffX > 0 && diffY > 0) {
                        if ((RegionManager.getClipping(currentX + i + 1, currentY + i2 + 1, height, privateArea) & 0x12801e0) !== 0
                            || (RegionManager.getClipping(currentX + i + 1, currentY + i2, height, privateArea) & 0x1280180) !== 0
                            || (RegionManager.getClipping(currentX + i, currentY + i2 + 1, height, privateArea) & 0x1280120) !== 0)
                            return false;
                    }
                    else if (diffX < 0 && diffY > 0) {
                        if ((RegionManager.getClipping((currentX + i) - 1, currentY + i2 + 1, height, privateArea) & 0x1280138) !== 0
                            || (RegionManager.getClipping((currentX + i) - 1, currentY + i2, height, privateArea) & 0x1280108) !== 0
                            || (RegionManager.getClipping(currentX + i, currentY + i2 + 1, height, privateArea) & 0x1280120) !== 0)
                            return false;
                    }
                    else if (diffX > 0 && diffY < 0) {
                        if ((RegionManager.getClipping(currentX + i + 1, (currentY + i2) - 1, height, privateArea) & 0x1280183) !== 0
                            || (RegionManager.getClipping(currentX + i + 1, currentY + i2, height, privateArea) & 0x1280180) !== 0
                            || (RegionManager.getClipping(currentX + i, (currentY + i2) - 1, height, privateArea) & 0x1280102) !== 0)
                            return false;
                    }
                    else if (diffX > 0 && diffY === 0) {
                        if ((RegionManager.getClipping(currentX + i + 1, currentY + i2, height, privateArea) & 0x1280180) !== 0)
                            return false;
                    }
                    else if (diffX < 0 && diffY === 0) {
                        if ((RegionManager.getClipping((currentX + i) - 1, currentY + i2, height, privateArea) & 0x1280108) !== 0)
                            return false;
                    }
                    else if (diffX === 0 && diffY > 0) {
                        if ((RegionManager.getClipping(currentX + i, currentY + i2 + 1, height, privateArea) & 0x1280120) !== 0)
                            return false;
                    }
                    else if (diffX === 0 && diffY < 0
                        && (RegionManager.getClipping(currentX + i, (currentY + i2) - 1, height, privateArea) & 0x1280102) !== 0)
                        return false;
            }
            if (diffX < 0) {
                diffX++;
            }
            else if (diffX > 0) {
                diffX--;
            }
            if (diffY < 0) {
                diffY++;
            }
            else if (diffY > 0)
                diffY--;
        }
        return true;
    };
    RegionManager.canMovestart = function (start, end, xLength, yLength, privateArea) {
        return this.canMove(start.getX(), start.getY(), end.getX(), end.getY(), start.getZ(), xLength, yLength, privateArea);
    };
    RegionManager.canMoveposition = function (position, direction, size, privateArea) {
        var end = position.transform(direction.getX(), direction.getY());
        return this.canMove(position.getX(), position.getY(), end.getX(), end.getY(), position.getZ(), size, size, privateArea);
    };
    RegionManager.loadMapFiles = function (x, y) {
        try {
            var regionX = x >> 3;
            var regionY = y >> 3;
            var regionId = ((regionX / 8) << 8) + (regionY / 8);
            var r = RegionManager.getRegionid(regionId);
            if (r == null || r == undefined || !r) {
                if (!r) {
                    return;
                }
                if (r.isLoaded) {
                    return;
                }
                r.setLoaded = function (loaded) {
                    true;
                };
            }
            // Attempt to create streams..
            var oFileData = pako_1.default.gunzip(pako_1.default.readFile(GameConstants_1.GameConstants.CLIPPING_DIRECTORY + "maps/" + r.getTerrainFile() + ".dat"));
            var gFileData = pako_1.default.gunzip(pako_1.default.readFile(GameConstants_1.GameConstants.CLIPPING_DIRECTORY + "maps/" + r.getTerrainFile() + ".dat"));
            // Don't allow ground file to be invalid..
            if (!gFileData) {
                return;
            }
            // Read values using our streams..
            var groundStream = new Buffer_1.Buffer(gFileData);
            var absX = (r.getRegionId() >> 8) * 64;
            var absY = (r.getRegionId() & 0xff) * 64;
            var heightMap = Array.from({ length: 4 }, function () {
                return Array.from({ length: 64 }, function () { return new Array(64).fill(0); });
            });
            for (var z = 0; z < 4; z++) {
                for (var tileX = 0; tileX < 64; tileX++) {
                    for (var tileY = 0; tileY < 64; tileY++) {
                        while (true) {
                            var tileType = groundStream.readUnsignedByte();
                            if (tileType === 0) {
                                break;
                            }
                            else if (tileType === 1) {
                                groundStream.readUnsignedByte();
                                break;
                            }
                            else if (tileType <= 49) {
                                groundStream.readUnsignedByte();
                            }
                            else if (tileType <= 81) {
                                heightMap[z][tileX][tileY] = tileType - 49;
                            }
                        }
                    }
                }
            }
            for (var i = 0; i < 4; i++) {
                for (var i2 = 0; i2 < 64; i2++) {
                    for (var i3 = 0; i3 < 64; i3++) {
                        if ((heightMap[i][i2][i3] & 1) === 1) {
                            var height = i;
                            if ((heightMap[1][i2][i3] & 2) === 2) {
                                height--;
                            }
                            if (height >= 0 && height <= 3) {
                                RegionManager.addClipping(absX + i2, absY + i3, height, 0x200000, null);
                            }
                        }
                    }
                }
            }
            if (oFileData != null) {
                var objectStream = new Buffer_1.Buffer(oFileData);
                var objectId = -1;
                var incr = void 0;
                while ((incr = objectStream.getUSmart()) !== 0) {
                    objectId += incr;
                    var location_1 = 0;
                    var incr2 = void 0;
                    while ((incr2 = objectStream.getUSmart()) !== 0) {
                        location_1 += incr2 - 1;
                        var localX = (location_1 >> 6 & 0x3f);
                        var localY = (location_1 & 0x3f);
                        var height = location_1 >> 12;
                        var hash = objectStream.readUnsignedByte();
                        var type = hash >> 2;
                        var direction = hash & 0x3;
                        if (localX < 0 || localX >= 64 || localY < 0 || localY >= 64) {
                            continue;
                        }
                        if ((heightMap[1][localX][localY] & 2) === 2) {
                            height--;
                        }
                        // Add object..
                        if (height >= 0 && height <= 3) {
                            RegionManager.addObject(objectId, absX + localX, absY + localY, height, type, direction);
                        }
                    }
                }
            }
        }
        catch (e) {
            console.error(e);
        }
    };
    RegionManager.PROJECTILE_NORTH_WEST_BLOCKED = 0x200;
    RegionManager.PROJECTILE_NORTH_BLOCKED = 0x400;
    RegionManager.PROJECTILE_NORTH_EAST_BLOCKED = 0x800;
    RegionManager.PROJECTILE_EAST_BLOCKED = 0x1000;
    RegionManager.PROJECTILE_SOUTH_EAST_BLOCKED = 0x2000;
    RegionManager.PROJECTILE_SOUTH_BLOCKED = 0x4000;
    RegionManager.PROJECTILE_SOUTH_WEST_BLOCKED = 0x8000;
    RegionManager.PROJECTILE_WEST_BLOCKED = 0x10000;
    RegionManager.PROJECTILE_TILE_BLOCKED = 0x20000;
    RegionManager.UNKNOWN = 0x80000;
    RegionManager.BLOCKED_TILE = 0x200000;
    RegionManager.UNLOADED_TILE = 0x1000000;
    RegionManager.OCEAN_TILE = 2097152;
    RegionManager.regions = new Map();
    return RegionManager;
}());
//# sourceMappingURL=RegionManager.js.map