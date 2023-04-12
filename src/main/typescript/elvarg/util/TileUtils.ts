import {Location} from '../game/model/Location';

export class TileUtils {

    public static getDistance(source: Location, dest: Location): number {
        return TileUtils.calculateDistance(source.getX(), source.getY(), dest.getX(), dest.getY());
    }
    
    public static hasGetDistance(source: Location, destX: number, destY: number): number {
        return TileUtils.calculateDistance(source.getX(), source.getY(), destX, destY);
    }
    
    private static calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }
}