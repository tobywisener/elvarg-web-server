import { Boundary } from './Boundary';
import { Location } from "./Location";
import { Path } from "paper";

export class PolygonalBoundary extends Boundary {
    private polygon = new Path();
    constructor(points: number[][]) {
        super(0, 0, 0, 0, 0);

        let xCoords: number[] = new Array(points.length);
        let yCoords: number[] = new Array(points.length);

        for (let i = 0; i < points.length; i++) {
            xCoords[i] = points[i][0];
            yCoords[i] = points[i][1];
        }

        this.polygon = new Path([xCoords, yCoords, points.length]);
    }

    inside(p: Location) {
        return this.polygon.contains([p.getX(), p.getY()]);
    }
}