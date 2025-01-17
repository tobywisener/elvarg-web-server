import { Location } from '../model/Location';
import { Player } from '../entity/impl/player/Player';

export class Region {
    private regionId: number;
    private terrainFile: number;
    private objectFile: number;
    public clips: number[][][] = new Array(4).fill([]);
    private loaded: boolean;

    constructor(regionId: number, terrainFile: number, objectFile: number) {
        this.regionId = regionId;
        this.terrainFile = terrainFile;
        this.objectFile = objectFile;
    }
    public getRegionId(): number {
        return this.regionId;
    }

    public getTerrainFile(): number {
        return this.terrainFile;
    }

    public getObjectFile(): number {
        return this.objectFile;
    }

    public getClip(x: number, y: number, height: number): number {
        let regionAbsX = (this.regionId >> 8) * 64;
        let regionAbsY = (this.regionId & 0xff) * 64;
        if (height < 0 || height >= 4)
            height = 0;
        if (!this.clips[height]) {
            this.clips[height] = new Array(64).fill(new Array(64).fill(0));
        }
        return this.clips[height][x - regionAbsX][y - regionAbsY];
    }

    public addClip(x: number, y: number, height: number, shift: number): void {
        let regionAbsX = (this.regionId >> 8) * 64;
        let regionAbsY = (this.regionId & 0xff) * 64;
        if (height < 0 || height >= 4)
            height = 0;
        if (!this.clips[height]) {
            this.clips[height] = new Array(64).fill(new Array(64).fill(0));
        }
        this.clips[height][x - regionAbsX][y - regionAbsY] |= shift;
    }
    public removeClip(x: number, y: number, height: number, shift: number): void {
        let regionAbsX: number = (this.regionId >> 8) * 64;
        let regionAbsY: number = (this.regionId & 0xff) * 64;
        if (height < 0 || height >= 4)
            height = 0;
        if (!this.clips[height]) {
            this.clips[height] = new Array(64).fill(new Array(64).fill(0));
        }
        this.clips[height][x - regionAbsX][y - regionAbsY] &= ~shift;
    }

    public getLocalPosition(position: Location): number[] {
        let absX: number = position.getX();
        let absY: number = position.getY();
        let regionAbsX: number = (this.regionId >> 8) * 64;
        let regionAbsY: number = (this.regionId & 0xff) * 64;
        let localX: number = absX - regionAbsX;
        let localY: number = absY - regionAbsY;
        return [localX, localY];
    }

    public isLoaded(): boolean {
        return this.loaded;
    }

    public setLoaded(loaded: boolean) {
        this.loaded = loaded;
    }

}