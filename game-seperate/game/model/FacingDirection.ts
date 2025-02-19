import { Direction } from './Direction';

export class FacingDirection {
    public static readonly NORTH = new FacingDirection(Direction.NORTH);
    public static readonly SOUTH = new FacingDirection(Direction.SOUTH);
    public static readonly EAST = new FacingDirection(Direction.EAST);
    public static readonly WEST = new FacingDirection(Direction.WEST);

    private direction: Direction;

    constructor(direction: Direction) {
        this.direction = direction;
    }
    public getDirection(): Direction {
        return this.direction;
    }
}