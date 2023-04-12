import { Misc } from "../../util/Misc";

export enum Directions {
    
}

export class Direction {
    public static readonly NORTH = new Direction(1, 0, 1, 6)
    public static readonly NORTH_EAST = new Direction(2, 1, 1, 5)
    public static readonly EAST = new Direction(4, 1, 0, 3)
    public static readonly SOUTH_EAST = new Direction(7, 1, -1, 0)
    public static readonly SOUTH = new Direction(6, 0, -1, 1)
    public static readonly SOUTH_WEST = new Direction(5, -1, -1, 2)
    public static readonly WEST = new Direction(3, -1, 0, 4)
    public static readonly NORTH_WEST = new Direction(0, -1, 1, 7)
    public static readonly NONE = new Direction(-1, 0, 0, -1)

    public id: number;
    public x: number;
    public y: number;
    public opposite: number;
    public diagonal: boolean;

    constructor(id: number, x: number, y: number, opposite: number) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.opposite = opposite;
        this.diagonal = Object.keys(Direction)[id].includes('_');
    }

    public getId() {
        return this.id;
    }

    public getX() {
        return this.x;
    }

    public getY() {
        return this.y;
    }

    public getOpposite() {
        return this.opposite;
    }

    public isDiagonal() {
        return this.diagonal;
    }

    public static valueOf(id: number) {
        switch (id) {
            case 0: return Direction.NORTH_WEST;
            case 1: return Direction.NORTH;
            case 2: return Direction.NORTH_EAST;
            case 3: return Direction.WEST;
            case 4: return Direction.EAST;
            case 5: return Direction.SOUTH_WEST;
            case 6: return Direction.SOUTH;
            case 7: return Direction.SOUTH_EAST;
            default: return Direction.NONE;
        }
    }

    public static random(): Direction {
        return this.valueOf(Misc.randomInclusive(0, 7));
    }

    public static fromDeltas(dx: number, dy: number): Direction {
        if (dx < 0) {
            if (dy < 0) {
                return Direction.SOUTH_WEST;
            } else if (dy > 0) {
                return Direction.NORTH_WEST;
            } else {
                return Direction.WEST;
            }
        } else if (dx > 0) {
            if (dy < 0) {
                return Direction.SOUTH_EAST;
            } else if (dy > 0) {
                return Direction.NORTH_EAST;
            } else {
                return Direction.EAST;
            }
        } else {
            if (dy < 0) {
                return Direction.SOUTH;
            } else if (dy > 0) {
                return Direction.NORTH;
            } else {
                return Direction.NONE;
            }
        }
    }

}
