import { Location } from "../model/Location";
import { DefaultSpawnDefinition } from "./DefaultSpawnDefinition";

export class ObjectSpawnDefinition extends DefaultSpawnDefinition {

    constructor(id: number, position: Location) {
		super(id, position);
    }
    
    private face: number = 0;
    private type: number = 10;

    public getFace(): number {
        return this.face;
    }

    public getType(): number {
        return this.type;
    }
}