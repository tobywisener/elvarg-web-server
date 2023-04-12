import { Location } from "../model/Location";

export class DefaultSpawnDefinition {
    constructor(id: number, position: Location) {
        this.id = id;
        this.position = position;
    }

    private id: number;
    private position: Location;

    public getId(): number {
        return this.id;
    }

    public getPosition(): Location {
        return this.position;
    }
}