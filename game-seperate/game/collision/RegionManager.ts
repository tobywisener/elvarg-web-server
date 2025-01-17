import { GameConstants } from '../GameConstants'
import { ObjectDefinition } from '../definition/ObjectDefinition'
import { Mobile } from '../entity/impl/Mobile'
import { GameObject } from '../entity/impl/object/GameObject'
import { MapObjects } from '../entity/impl/object/MapObjects'
import { Direction } from '../model/Direction'
import { Location } from '../model/Location'
import { PrivateArea } from '../model/areas/impl/PrivateArea'
import { fs } from "fs-extra"
import { Buffer } from './Buffer'
import { Region } from './Region'
import pako from 'pako';




export class RegionManager {
    public static PROJECTILE_NORTH_WEST_BLOCKED = 0x200;
    public static PROJECTILE_NORTH_BLOCKED = 0x400;
    public static PROJECTILE_NORTH_EAST_BLOCKED = 0x800;
    public static PROJECTILE_EAST_BLOCKED = 0x1000;
    public static PROJECTILE_SOUTH_EAST_BLOCKED = 0x2000;
    public static PROJECTILE_SOUTH_BLOCKED = 0x4000;
    public static PROJECTILE_SOUTH_WEST_BLOCKED = 0x8000;
    public static PROJECTILE_WEST_BLOCKED = 0x10000;
    public static PROJECTILE_TILE_BLOCKED = 0x20000;
    public static UNKNOWN = 0x80000;
    public static BLOCKED_TILE = 0x200000;
    public static UNLOADED_TILE = 0x1000000;
    public static OCEAN_TILE = 2097152;

    public static regions: Map<number, Region> = new Map<number, Region>();

    public static init(): void {
        // Load object definitions..
        ObjectDefinition.init();
        // Load regions..
        let map_index = new fs(GameConstants.CLIPPING_DIRECTORY + "map_index");
        if (!map_index.exists()) {
            throw new Error("map_index was not found!");
        }
        let data = fs.readAllBytes(map_index.toPath());
        let stream = new Buffer(data);
        let size = stream.readUShort();
        for (let i = 0; i < size; i++) {
            let regionId = stream.readUShort();
            let terrainFile = stream.readUShort();
            let objectFile = stream.readUShort();
            RegionManager.regions.set(regionId, new Region(regionId, terrainFile, objectFile));
        }
    }

    public static getRegionid(regionId: number): Region | undefined {
        return this.regions.get(regionId);
    }

    public static getRegion(x: number, y: number): Region | undefined {
        RegionManager.loadMapFiles(x, y);
        let regionX = x >> 3;
        let regionY = y >> 3;
        let regionId = ((regionX / 8) << 8) + (regionY / 8);
        return RegionManager.getRegionid(regionId);
    }
    private static addClippingForVariableObject(x: number, y: number, height: number, type: number, direction: number, tall: boolean, privateArea: PrivateArea) {
        if (type == 0) {
            if (direction == 0) {
                this.addClipping(x, y, height, 128, privateArea);
                this.addClipping(x - 1, y, height, 8, privateArea);
            } else if (direction == 1) {
                this.addClipping(x, y, height, 2, privateArea);
                this.addClipping(x, y + 1, height, 32, privateArea);
            } else if (direction == 2) {
                this.addClipping(x, y, height, 8, privateArea);
                this.addClipping(x + 1, y, height, 128, privateArea);
            } else if (direction == 3) {
                this.addClipping(x, y, height, 32, privateArea);
                this.addClipping(x, y - 1, height, 2, privateArea);
            }
        } else if (type == 1 || type == 3) {
            if (direction == 0) {
                this.addClipping(x, y, height, 1, privateArea);
                this.addClipping(x - 1, y, height, 16, privateArea);
            } else if (direction == 1) {
                this.addClipping(x, y, height, 4, privateArea);
                this.addClipping(x + 1, y + 1, height, 64, privateArea);
            } else if (direction == 2) {
                this.addClipping(x, y, height, 16, privateArea);
                this.addClipping(x + 1, y - 1, height, 1, privateArea);
            } else if (direction == 3) {
                this.addClipping(x, y, height, 64, privateArea);
                this.addClipping(x - 1, y - 1, height, 4, privateArea);
            }
        } else if (type == 2) {
            if (direction == 0) {
                this.addClipping(x, y, height, 130, privateArea);
                this.addClipping(x - 1, y, height, 8, privateArea);
                this.addClipping(x, y + 1, height, 32, privateArea);
            } else if (direction == 1) {
                this.addClipping(x, y, height, 10, privateArea);
                this.addClipping(x, y + 1, height, 32, privateArea);
                this.addClipping(x + 1, y, height, 128, privateArea);
            } else if (direction == 2) {
                this.addClipping(x, y, height, 40, privateArea);
                this.addClipping(x + 1, y, height, 128, privateArea);
                this.addClipping(x, y - 1, height, 2, privateArea);
            } else if (direction == 3) {
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
                } else if (direction == 1) {
                    this.addClipping(x, y, height, 1024, privateArea);
                    this.addClipping(x, y + 1, height, 16384, privateArea);
                } else if (direction == 2) {
                    this.addClipping(x, y, height, 4096, privateArea);
                    this.addClipping(x + 1, y, height, 65536, privateArea);
                } else if (direction == 3) {
                    this.addClipping(x, y, height, 16384, privateArea);
                    this.addClipping(x, y - 1, height, 1024, privateArea);
                }
            } else if (type == 1 || type == 3) {
                if (direction == 0) {
                    this.addClipping(x, y, height, 512, privateArea);
                    this.addClipping(x - 1, y + 1, height, 8192, privateArea);
                } else if (direction == 1) {
                    this.addClipping(x, y, height, 2048, privateArea);
                    this.addClipping(x + 1, y + 1, height, 32768, privateArea);
                } else if (direction == 2) {
                    this.addClipping(x, y, height, 8192, privateArea);
                    this.addClipping(x + 1, y + 1, height, 512, privateArea);
                } else if (direction == 3) {
                    this.addClipping(x, y, height, 32768, privateArea);
                    this.addClipping(x - 1, y - 1, height, 2048, privateArea);
                }
            } else if (type == 2) {
                if (direction == 0) {
                    this.addClipping(x, y, height, 66560, privateArea);
                    this.addClipping(x - 1, y, height, 4096, privateArea);
                    this.addClipping(x, y + 1, height, 16384, privateArea);
                } else if (direction == 1) {
                    this.addClipping(x, y, height, 5120, privateArea);
                    this.addClipping(x, y + 1, height, 16384, privateArea);
                    this.addClipping(x + 1, y, height, 65536, privateArea);
                } else if (direction == 2) {
                    this.addClipping(x, y, height, 20480, privateArea);
                    this.addClipping(x + 1, y, height, 65536, privateArea);
                    this.addClipping(x, y - 1, height, 1024, privateArea);
                } else if (direction == 3) {
                    this.addClipping(x, y, height, 81920, privateArea);
                    this.addClipping(x, y - 1, height, 1024, privateArea);
                    this.addClipping(x - 1, y, height, 4096, privateArea);
                }
            }
        }
    }
    public static removeClippingForVariableObject(x: number, y: number, height: number, type: number, direction: number, tall: boolean, privateArea: PrivateArea) {
        if (type == 0) {
            if (direction == 0) {
                RegionManager.removeClipping(x, y, height, 128, privateArea);
                RegionManager.removeClipping(x - 1, y, height, 8, privateArea);
            } else if (direction == 1) {
                RegionManager.removeClipping(x, y, height, 2, privateArea);
                RegionManager.removeClipping(x, y + 1, height, 32, privateArea);
            } else if (direction == 2) {
                RegionManager.removeClipping(x, y, height, 8, privateArea);
                RegionManager.removeClipping(x + 1, y, height, 128, privateArea);
            } else if (direction == 3) {
                RegionManager.removeClipping(x, y, height, 32, privateArea);
                RegionManager.removeClipping(x, y - 1, height, 2, privateArea);
            }
        } else if (type == 1 || type == 3) {
            if (direction == 0) {
                RegionManager.removeClipping(x, y, height, 1, privateArea);
                RegionManager.removeClipping(x - 1, y, height, 16, privateArea);
            } else if (direction == 1) {
                RegionManager.removeClipping(x, y, height, 4, privateArea);
                RegionManager.removeClipping(x + 1, y + 1, height, 64, privateArea);
            } else if (direction == 2) {
                RegionManager.removeClipping(x, y, height, 16, privateArea);
                RegionManager.removeClipping(x + 1, y - 1, height, 1, privateArea);
            } else if (direction == 3) {
                RegionManager.removeClipping(x, y, height, 64, privateArea);
                RegionManager.removeClipping(x - 1, y - 1, height, 4, privateArea);
            }
        } else if (type == 2) {
            if (direction == 0) {
                RegionManager.removeClipping(x, y, height, 130, privateArea);
                RegionManager.removeClipping(x - 1, y, height, 8, privateArea);
                RegionManager.removeClipping(x, y + 1, height, 32, privateArea);
            } else if (direction == 1) {
                RegionManager.removeClipping(x, y, height, 10, privateArea);
                RegionManager.removeClipping(x, y + 1, height, 32, privateArea);
                RegionManager.removeClipping(x + 1, y, height, 128, privateArea);
            } else if (direction == 2) {
                RegionManager.removeClipping(x, y, height, 40, privateArea);
                RegionManager.removeClipping(x + 1, y, height, 128, privateArea);
                RegionManager.removeClipping(x, y - 1, height, 2, privateArea);
            } else if (direction == 3) {
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
                } else if (direction === 1) {
                    RegionManager.removeClipping(x, y, height, 1024, privateArea);
                    RegionManager.removeClipping(x, y + 1, height, 16384, privateArea);
                } else if (direction === 2) {
                    RegionManager.removeClipping(x, y, height, 4096, privateArea);
                    RegionManager.removeClipping(x + 1, y, height, 65536, privateArea);
                } else if (direction === 3) {
                    RegionManager.removeClipping(x, y, height, 16384, privateArea);
                    RegionManager.removeClipping(x, y - 1, height, 1024, privateArea);
                }
            }
        }
        if (type == 1 || type == 3) {
            if (direction == 0) {
                RegionManager.removeClipping(x, y, height, 512, privateArea);
                RegionManager.removeClipping(x - 1, y + 1, height, 8192, privateArea);
            } else if (direction == 1) {
                RegionManager.removeClipping(x, y, height, 2048, privateArea);
                RegionManager.removeClipping(x + 1, y + 1, height, 32768, privateArea);
            } else if (direction == 2) {
                RegionManager.removeClipping(x, y, height, 8192, privateArea);
                RegionManager.removeClipping(x + 1, y + 1, height, 512, privateArea);
            } else if (direction == 3) {
                RegionManager.removeClipping(x, y, height, 32768, privateArea);
                RegionManager.removeClipping(x - 1, y - 1, height, 2048, privateArea);
            }
        } else if (type == 2) {
            if (direction == 0) {
                RegionManager.removeClipping(x, y, height, 66560, privateArea);
                RegionManager.removeClipping(x - 1, y, height, 4096, privateArea);
                RegionManager.removeClipping(x, y + 1, height, 16384, privateArea);
            } else if (direction == 1) {
                RegionManager.removeClipping(x, y, height, 5120, privateArea);
                RegionManager.removeClipping(x, y + 1, height, 16384, privateArea);
                RegionManager.removeClipping(x + 1, y, height, 65536, privateArea);
            } else if (direction == 2) {
                RegionManager.removeClipping(x, y, height, 20480, privateArea);
                RegionManager.removeClipping(x + 1, y, height, 65536, privateArea);
                RegionManager.removeClipping(x, y - 1, height, 1024, privateArea);
            } else if (direction == 3) {
                RegionManager.removeClipping(x, y, height, 81920, privateArea);
                RegionManager.removeClipping(x, y - 1, height, 1024, privateArea);
                RegionManager.removeClipping(x - 1, y, height, 4096, privateArea);
            }
        }
    }
    private static addClippingForSolidObject(x: number, y: number, height: number, xLength: number, yLength: number, flag: boolean, privateArea: PrivateArea): void {
        let clipping: number = 256;
        if (flag) {
            clipping += 0x20000;
        }
        for (let i = x; i < x + xLength; i++) {
            for (let i2 = y; i2 < y + yLength; i2++) {
                this.addClipping(i, i2, height, clipping, privateArea);
            }
        }
    }

    private static removeClippingForSolidObject(x: number, y: number, height: number, xLength: number, yLength: number, flag: boolean, privateArea: PrivateArea): void {
        let clipping: number = 256;
        if (flag) {
            clipping += 0x20000;
        }

        for (let x_ = x; x_ < x + xLength; x_++) {
            for (let y_ = y; y_ < y + yLength; y_++) {
                this.removeClipping(x_, y_, height, clipping, privateArea);
            }
        }
    }

    public static addObject(objectId: number, x: number, y: number, height: number, type: number, direction: number) {
        const position = new Location(x, y);

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
            MapObjects.clear(position, type);
        } else {
            MapObjects.add(new GameObject(objectId, position, type, direction, null));
        }
    }
    public static addObjectClipping(object: GameObject) {
        const id = object.getId();
        const x = object.getLocation().getX();
        const y = object.getLocation().getY();
        const height = object.getLocation().getZ();
        const type = object.getType();
        const direction = object.getFace();

        if (id === -1) {
            this.removeClipping(x, y, height, 0x000000, object.getPrivateArea());
            return;
        }

        const def: ObjectDefinition = object.getDefinition();
        if (!def) {
            return;
        }

        let xLength: number;
        let yLength: number;
        if (direction !== 1 && direction !== 3) {
            xLength = def.getSizeX();
            yLength = def.getSizeY();
        } else {
            yLength = def.getSizeX();
            xLength = def.getSizeY();
        }

        if (type === 22) {
            if (def.hasActions() && ObjectDefinition.solid) {
                RegionManager.addClipping(x, y, height, 0x200000, object.getPrivateArea());
            }
        } else if (type >= 9) {
            if (ObjectDefinition.solid) {
                RegionManager.addClippingForSolidObject(x, y, height, xLength, yLength, ObjectDefinition.impenetrable, object.getPrivateArea());
            }
        } else if (type >= 0 && type <= 3) {
            if (ObjectDefinition.solid) {
                RegionManager.addClippingForVariableObject(x, y, height, type, direction, ObjectDefinition.impenetrable, object.getPrivateArea());
            }
        }
    }
    public static removeObjectClipping(object: GameObject) {
        const x = object.getLocation().getX();
        const y = object.getLocation().getY();
        const height = object.getLocation().getZ();
        const type = object.getType();
        const direction = object.getFace();

        if (object.getId() === -1) {
            this.removeClipping(x, y, height, 0x000000, object.getPrivateArea());
            return;
        }

        const def = object.getDefinition();
        if (!def) {
            return;
        }
        let xLength: number;
        let yLength: number;
        if (direction !== 1 && direction !== 3) {
            xLength = def.getSizeX();
            yLength = def.getSizeY();
        } else {
            yLength = def.getSizeX();
            xLength = def.getSizeY();
        }

        if (type === 22) {
            if (def.hasActions() && ObjectDefinition.solid) {
                this.removeClipping(x, y, height, 0x200000, object.getPrivateArea());
            }
        } else if (type >= 9) {
            if (ObjectDefinition.solid) {
                this.removeClippingForSolidObject(x, y, height, xLength, yLength, ObjectDefinition.solid, object.getPrivateArea());
            }
        } else if (type >= 0 && type <= 3) {
            if (ObjectDefinition.solid) {
                RegionManager.removeClippingForVariableObject(x, y, height, type, direction, ObjectDefinition.solid, object.getPrivateArea());
            }
        }
    }

    public static addClipping(x: number, y: number, height: number, shift: number, privateArea: PrivateArea) {
        if (privateArea) {
            privateArea.setClip(new Location(x, y), shift);
            return;
        }
        const r = RegionManager.getRegion(x, y);
        if (r) {
            r.addClip(x, y, height, shift);
        }
    }

    public static removeClipping(x: number, y: number, height: number, shift: number, privateArea: PrivateArea) {
        if (privateArea) {
            privateArea.removeClip(new Location(x, y, height));
            return;
        }
        const r = RegionManager.getRegion(x, y);
        if (r) {
            r.removeClip(x, y, height, shift);
        }
    }

    public static getClipping(x: number, y: number, height: number, privateArea: PrivateArea) {
        if (privateArea) {
            const privateClip = privateArea.getClip(new Location(x, y));
            if (privateClip !== 0) {
                return privateClip;
            }
        }


        const r = RegionManager.getRegion(x, y);
        if (r) {
            return r.getClip(x, y, height);
        }
        return 0;
    }

    public static wallExists(location: Location, area: PrivateArea, type: number) {
        const object = MapObjects.get(type, location, area);
        if (object) {
            const objectDef = object.getDefinition();
            if (!objectDef.name || objectDef.name === "null") {
                return true;
            }
        }
        return false;
    }

    public static wallsExist(location: Location, area: PrivateArea) {
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
    }



    public static canMoveIsBlocked(pos: Location, direction: number, privateArea: PrivateArea) {
        if (direction === 0) {
            return !RegionManager.blockedNorthWest(pos, privateArea) && !RegionManager.blockedNorth(pos, privateArea) && !RegionManager.blockedWest(pos, privateArea);
        } else if (direction === 1) {
            return !RegionManager.blockedNorth(pos, privateArea);
        } else if (direction === 2) {
            return !RegionManager.blockedNorthEast(pos, privateArea) && !RegionManager.blockedNorth(pos, privateArea) && !RegionManager.blockedEast(pos, privateArea);
        } else if (direction === 3) {
            return !RegionManager.blockedWest(pos, privateArea);
        } else if (direction === 4) {
            return !RegionManager.blockedEast(pos, privateArea);
        } else if (direction === 5) {
            return !RegionManager.blockedSouthWest(pos, privateArea) && !RegionManager.blockedSouth(pos, privateArea) && !RegionManager.blockedWest(pos, privateArea);
        } else if (direction === 6) {
            return !RegionManager.blockedSouth(pos, privateArea);
        } else if (direction === 7) {
            return !RegionManager.blockedSouthEast(pos, privateArea) && !RegionManager.blockedSouth(pos, privateArea) && !RegionManager.blockedEast(pos, privateArea);
        }
        return false;
    }

    public static blockedProjectile(position: Location, privateArea: PrivateArea) {
        return (RegionManager.getClipping(position.getX(), position.getY(), position.getZ(), privateArea) & 0x20000) === 0;
    }

    public static blocked(pos: Location, privateArea: PrivateArea) {
        return (RegionManager.getClipping(pos.getX(), pos.getY(), pos.getZ(), privateArea) & 0x1280120) !== 0;
    }

    public static blockedNorth(pos: Location, privateArea: PrivateArea) {
        return (RegionManager.getClipping(pos.getX(), pos.getY() + 1, pos.getZ(), privateArea) & 0x1280120) !== 0;
    }

    public static blockedEast(pos: Location, privateArea: PrivateArea) {
        return (RegionManager.getClipping(pos.getX() + 1, pos.getY(), pos.getZ(), privateArea) & 0x1280180) !== 0;
    }

    public static blockedSouth(pos: Location, privateArea: PrivateArea) {
        return (RegionManager.getClipping(pos.getX(), pos.getY() - 1, pos.getZ(), privateArea) & 0x1280102) !== 0;
    }

    public static blockedWest(pos: Location, privateArea: PrivateArea): boolean {
        return (RegionManager.getClipping(pos.getX() - 1, pos.getY(), pos.getZ(), privateArea) & 0x1280108) != 0;
    }

    public static blockedNorthEast(pos: Location, privateArea: PrivateArea): boolean {
        return (RegionManager.getClipping(pos.getX() + 1, pos.getY() + 1, pos.getZ(), privateArea) & 0x12801e0) != 0;
    }

    public static blockedNorthWest(pos: Location, privateArea: PrivateArea): boolean {
        return (RegionManager.getClipping(pos.getX() - 1, pos.getY() + 1, pos.getZ(), privateArea) & 0x1280138) != 0;
    }

    public static blockedSouthEast(pos: Location, privateArea: PrivateArea): boolean {
        return (RegionManager.getClipping(pos.getX() + 1, pos.getY() - 1, pos.getZ(), privateArea) & 0x1280183) != 0;
    }

    public static blockedSouthWest(pos: Location, privateArea: PrivateArea): boolean {
        return (RegionManager.getClipping(pos.getX() - 1, pos.getY() - 1, pos.getZ(), privateArea) & 0x128010e) != 0;
    }
    public static canProjectileAttack(attacker: Mobile, from: Location, to: Location): boolean {
        let a = from;
        let b = to;
        if (a.getX() > b.getX()) {
            a = to;
            b = from;
        }
        return this.canProjectileAttack(attacker, from, to);
    }
    public static canProjectileAttackTarget(attacker: Mobile, target: Mobile): boolean {
        let a = attacker.getLocation();
        let b = target.getLocation();

        if (attacker.isPlayer() && target.isPlayer()) {
            if (a.getX() > b.getX()) {
                a = target.getLocation();
                b = attacker.getLocation();
            }
        } else if (target.isPlayer()) {
            a = target.getLocation();
            b = attacker.getLocation();
        }
        return RegionManager.canProjectileAttack(attacker, a, b);
    }

    public static canProjectileAttackReturn(a: Location, b: Location, size: number, area: PrivateArea): boolean {
        return RegionManager.canProjectileMove(a.getX(), a.getY(), b.getX(), b.getY(), a.getZ(), size, size, area);
    }
    public static canProjectileMove(startX: number, startY: number, endX: number, endY: number, height: number, xLength: number, yLength: number, privateArea: PrivateArea) {
        let diffX = endX - startX;
        let diffY = endY - startY;
        let max = Math.max(Math.abs(diffX), Math.abs(diffY));
        for (let ii = 0; ii < max; ii++) {
            let currentX = endX - diffX;
            let currentY = endY - diffY;
            for (let i = 0; i < xLength; i++) {
                for (let i2 = 0; i2 < yLength; i2++) {
                    if (diffX < 0 && diffY < 0) {
                        if ((RegionManager.getClipping(currentX + i - 1, currentY + i2 - 1, height, privateArea) & (RegionManager.UNLOADED_TILE
                            | /* BLOCKED_TILE | */RegionManager.UNKNOWN | RegionManager.PROJECTILE_TILE_BLOCKED | RegionManager.PROJECTILE_EAST_BLOCKED
                            | RegionManager.PROJECTILE_NORTH_EAST_BLOCKED | RegionManager.PROJECTILE_NORTH_BLOCKED)) != 0
                            || (RegionManager.getClipping(currentX + i - 1, currentY + i2, height, privateArea)
                                & (RegionManager.UNLOADED_TILE | /* BLOCKED_TILE | */RegionManager.UNKNOWN | RegionManager.PROJECTILE_TILE_BLOCKED
                                    | RegionManager.PROJECTILE_EAST_BLOCKED)) != 0
                            || (RegionManager.getClipping(currentX + i, currentY + i2 - 1, height, privateArea)
                                & (RegionManager.UNLOADED_TILE | /* BLOCKED_TILE | */RegionManager.UNKNOWN | RegionManager.PROJECTILE_TILE_BLOCKED
                                    | RegionManager.PROJECTILE_NORTH_BLOCKED)) != 0) {
                            return false;
                        }
                    } else if (diffX < 0 && diffY > 0) {
                        if ((RegionManager.getClipping(currentX + i - 1, currentY + i2 + 1, height, privateArea) & (RegionManager.UNLOADED_TILE | RegionManager.UNKNOWN | RegionManager.PROJECTILE_TILE_BLOCKED | RegionManager.PROJECTILE_SOUTH_BLOCKED | RegionManager.PROJECTILE_SOUTH_EAST_BLOCKED | RegionManager.PROJECTILE_EAST_BLOCKED)) != 0
                            || (RegionManager.getClipping(currentX + i - 1, currentY + i2, height, privateArea) & (RegionManager.UNLOADED_TILE | RegionManager.UNKNOWN | RegionManager.PROJECTILE_TILE_BLOCKED | RegionManager.PROJECTILE_EAST_BLOCKED)) != 0
                            || (RegionManager.getClipping(currentX + i, currentY + i2 + 1, height, privateArea) & (RegionManager.UNLOADED_TILE | RegionManager.UNKNOWN | RegionManager.PROJECTILE_TILE_BLOCKED | RegionManager.PROJECTILE_SOUTH_BLOCKED)) != 0) {
                            return false;
                        }
                    } else if (diffX > 0 && diffY < 0) {
                        if ((RegionManager.getClipping(currentX + i + 1, currentY + i2 - 1, height, privateArea) & (RegionManager.UNLOADED_TILE
                            | /* BLOCKED_TILE | */RegionManager.UNKNOWN | RegionManager.PROJECTILE_TILE_BLOCKED | RegionManager.PROJECTILE_WEST_BLOCKED
                            | RegionManager.PROJECTILE_NORTH_BLOCKED | RegionManager.PROJECTILE_NORTH_WEST_BLOCKED)) != 0
                            || (RegionManager.getClipping(currentX + i + 1, currentY + i2, height, privateArea)
                                & (RegionManager.UNLOADED_TILE | /* BLOCKED_TILE | */RegionManager.UNKNOWN | RegionManager.PROJECTILE_TILE_BLOCKED
                                    | RegionManager.PROJECTILE_WEST_BLOCKED)) != 0
                            || (RegionManager.getClipping(currentX + i, currentY + i2 - 1, height, privateArea)
                                & (RegionManager.UNLOADED_TILE | /* BLOCKED_TILE | */RegionManager.UNKNOWN | RegionManager.PROJECTILE_TILE_BLOCKED
                                    | RegionManager.PROJECTILE_NORTH_BLOCKED)) != 0) {
                            return false;
                        }
                    } else if (diffX > 0 && diffY == 0) {
                        if ((RegionManager.getClipping(currentX + i + 1, currentY + i2, height, privateArea)
                            & (RegionManager.UNLOADED_TILE | /* BLOCKED_TILE | */RegionManager.UNKNOWN | RegionManager.PROJECTILE_TILE_BLOCKED
                                | RegionManager.PROJECTILE_WEST_BLOCKED)) != 0) {
                            return false;
                        }
                    } else if (diffX < 0 && diffY == 0) {
                        if ((RegionManager.getClipping(currentX + i - 1, currentY + i2, height, privateArea)
                            & (RegionManager.UNLOADED_TILE | /* BLOCKED_TILE | */RegionManager.UNKNOWN | RegionManager.PROJECTILE_TILE_BLOCKED
                                | RegionManager.PROJECTILE_EAST_BLOCKED)) != 0) {
                            return false;
                        }
                    }
                    else if (diffX === 0 && diffY > 0) {
                        if ((RegionManager.getClipping(currentX + i, currentY + i2 + 1, height, privateArea) & (RegionManager.UNLOADED_TILE | RegionManager.UNKNOWN | RegionManager.PROJECTILE_TILE_BLOCKED | RegionManager.PROJECTILE_SOUTH_BLOCKED)) !== 0) {
                            return false;
                        }
                    } else if (diffX === 0 && diffY < 0) {
                        if ((RegionManager.getClipping(currentX + i, currentY + i2 - 1, height, privateArea) & (RegionManager.UNLOADED_TILE | RegionManager.UNKNOWN | RegionManager.PROJECTILE_TILE_BLOCKED | RegionManager.PROJECTILE_NORTH_BLOCKED)) !== 0) {
                            return false;
                        }
                    }
                }
            }
            if (diffX < 0) {
                diffX++;
            } else if (diffX > 0) {
                diffX--;
            }
            if (diffY < 0) {
                diffY++;
            } else if (diffY > 0) {
                diffY--;
            }
        }
        return true;
    }
    public static canMove(startX: number, startY: number, endX: number, endY: number, height: number, xLength: number, yLength: number, privateArea: PrivateArea): boolean {
        let diffX = endX - startX;
        let diffY = endY - startY;
        let max = Math.max(Math.abs(diffX), Math.abs(diffY));
        for (let ii = 0; ii < max; ii++) {
            let currentX = endX - diffX;
            let currentY = endY - diffY;
            for (let i = 0; i < xLength; i++) {
                for (let i2 = 0; i2 < yLength; i2++)
                    if (diffX < 0 && diffY < 0) {
                        if ((RegionManager.getClipping((currentX + i) - 1, (currentY + i2) - 1, height, privateArea) & 0x128010e) !== 0
                            || (RegionManager.getClipping((currentX + i) - 1, currentY + i2, height, privateArea) & 0x1280108) !== 0
                            || (RegionManager.getClipping(currentX + i, (currentY + i2) - 1, height, privateArea) & 0x1280102) !== 0)
                            return false;
                    } else if (diffX > 0 && diffY > 0) {
                        if ((RegionManager.getClipping(currentX + i + 1, currentY + i2 + 1, height, privateArea) & 0x12801e0) !== 0
                            || (RegionManager.getClipping(currentX + i + 1, currentY + i2, height, privateArea) & 0x1280180) !== 0
                            || (RegionManager.getClipping(currentX + i, currentY + i2 + 1, height, privateArea) & 0x1280120) !== 0)
                            return false;
                    } else if (diffX < 0 && diffY > 0) {
                        if ((RegionManager.getClipping((currentX + i) - 1, currentY + i2 + 1, height, privateArea) & 0x1280138) !== 0
                            || (RegionManager.getClipping((currentX + i) - 1, currentY + i2, height, privateArea) & 0x1280108) !== 0
                            || (RegionManager.getClipping(currentX + i, currentY + i2 + 1, height, privateArea) & 0x1280120) !== 0)
                            return false;
                    } else if (diffX > 0 && diffY < 0) {
                        if ((RegionManager.getClipping(currentX + i + 1, (currentY + i2) - 1, height, privateArea) & 0x1280183) !== 0
                            || (RegionManager.getClipping(currentX + i + 1, currentY + i2, height, privateArea) & 0x1280180) !== 0
                            || (RegionManager.getClipping(currentX + i, (currentY + i2) - 1, height, privateArea) & 0x1280102) !== 0)
                            return false;
                    } else if (diffX > 0 && diffY === 0) {
                        if ((RegionManager.getClipping(currentX + i + 1, currentY + i2, height, privateArea) & 0x1280180) !== 0)
                            return false;
                    } else if (diffX < 0 && diffY === 0) {
                        if ((RegionManager.getClipping((currentX + i) - 1, currentY + i2, height, privateArea) & 0x1280108) !== 0)
                            return false;
                    } else if (diffX === 0 && diffY > 0) {
                        if ((RegionManager.getClipping(currentX + i, currentY + i2 + 1, height, privateArea) & 0x1280120) !== 0)
                            return false;
                    } else if (diffX === 0 && diffY < 0
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
    }

    public static canMovestart(start: Location, end: Location, xLength: number, yLength: number, privateArea: PrivateArea): boolean {
        return this.canMove(start.getX(), start.getY(), end.getX(), end.getY(), start.getZ(), xLength, yLength, privateArea);
    }

    public static canMoveposition(position: Location, direction: Direction, size: number, privateArea: PrivateArea): boolean {
        const end = position.transform(direction.getX(), direction.getY());
        return this.canMove(position.getX(), position.getY(), end.getX(), end.getY(), position.getZ(), size, size, privateArea);
    }

    public static loadMapFiles(x: number, y: number) {
        try {
            const regionX = x >> 3;
            const regionY = y >> 3;
            const regionId = ((regionX / 8) << 8) + (regionY / 8);
            const r: Region = RegionManager.getRegionid(regionId);

            if (r == null || r == undefined || !r) {
                if (!r) {
                    return;
                }
                if (r.isLoaded) {
                    return;
                }

                r.setLoaded = (loaded: boolean) => {
                    true;
                }

            }


            // Attempt to create streams..
            const oFileData = pako.gunzip(
                pako.readFile(GameConstants.CLIPPING_DIRECTORY + "maps/" + r.getTerrainFile() + ".dat")
            );
            const gFileData = pako.gunzip(
                pako.readFile(GameConstants.CLIPPING_DIRECTORY + "maps/" + r.getTerrainFile() + ".dat")
            );

            // Don't allow ground file to be invalid..
            if (!gFileData) {
                return;
            }

            // Read values using our streams..
            const groundStream = new Buffer(gFileData);
            const absX = (r.getRegionId() >> 8) * 64;
            const absY = (r.getRegionId() & 0xff) * 64;
            const heightMap = Array.from({ length: 4 }, () =>
                Array.from({ length: 64 }, () => new Array(64).fill(0))
            );
            for (let z = 0; z < 4; z++) {
                for (let tileX = 0; tileX < 64; tileX++) {
                    for (let tileY = 0; tileY < 64; tileY++) {
                        while (true) {
                            const tileType = groundStream.readUnsignedByte();
                            if (tileType === 0) {
                                break;
                            } else if (tileType === 1) {
                                groundStream.readUnsignedByte();
                                break;
                            } else if (tileType <= 49) {
                                groundStream.readUnsignedByte();
                            } else if (tileType <= 81) {
                                heightMap[z][tileX][tileY] = tileType - 49;
                            }
                        }
                    }
                }
            }
            for (let i = 0; i < 4; i++) {
                for (let i2 = 0; i2 < 64; i2++) {
                    for (let i3 = 0; i3 < 64; i3++) {
                        if ((heightMap[i][i2][i3] & 1) === 1) {
                            let height = i;
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
                const objectStream = new Buffer(oFileData);
                let objectId = -1;
                let incr;
                while ((incr = objectStream.getUSmart()) !== 0) {
                    objectId += incr;
                    let location = 0;
                    let incr2;
                    while ((incr2 = objectStream.getUSmart()) !== 0) {
                        location += incr2 - 1;
                        const localX = (location >> 6 & 0x3f);
                        const localY = (location & 0x3f);
                        let height = location >> 12;
                        const hash = objectStream.readUnsignedByte();
                        const type = hash >> 2;
                        const direction = hash & 0x3;
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
        } catch (e) {
            console.error(e);
        }
    }
}
