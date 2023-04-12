import { NPC } from "../NPC";
import { God } from "../../../../model/God"
import { Location } from "../../../../model/Location"
export class GodwarsFollower extends NPC {
    private god: God;
    constructor(id: number, position: Location, god: God) {
        super(id, position);
        this.god = god;
    }

    public getGod(): God {
        return this.god;
    }
}
