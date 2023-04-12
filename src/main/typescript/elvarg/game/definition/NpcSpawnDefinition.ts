import { Direction } from "../model/Direction";
import { FacingDirection } from "../model/FacingDirection";
import { Location } from "../model/Location";
import { DefaultSpawnDefinition } from "./DefaultSpawnDefinition";

export class NpcSpawnDefinition extends DefaultSpawnDefinition {

    facing: Direction;
    radius: number;
    description: string;


    constructor(id: number, position: Location, facing: Direction, radius: number, descripton?: string) {
        super(id, position);
        this.facing = facing;
        this.radius = radius;
        this.description = descripton;
    }

    getFacing(): Direction {
        return this.facing;
    }

    getRadius(): number {
        return this.radius;
    }

    equals(o: Object): boolean {
        if (!(o instanceof NpcSpawnDefinition))
            return false;
        let def = o as NpcSpawnDefinition;
        return def.getPosition().equals(this.getPosition())
            && def.getId() == this.getId()
            && def.getFacing() == this.getFacing()
            && def.getRadius() == this.getRadius();
    }
}