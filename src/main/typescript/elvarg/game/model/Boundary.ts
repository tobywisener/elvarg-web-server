import { Location } from "./Location";
export class Boundary {
    private readonly x: number;
    private readonly x2: number;
    private readonly y: number;
    private readonly y2: number;
    public height: number;

    constructor(x: number, x2: number, y: number, y2: number, height?: number) {
        this.x = x;
        this.x2 = x2;
        this.y = y;
        this.y2 = y2;
        this.height = height;
    }

    getX(): number {
        return this.x;
    }

    getX2(): number {
        return this.x2;
    }

    getY(): number {
        return this.y;
    }

    getY2(): number {
        return this.y2;
    }

    inside(p: Location): boolean {
        return p.getX() >= this.x && p.getX() <= this.x2 && p.getY() >= this.y && p.getY() <= this.y2 && this.height == p.getZ();
    }
}
