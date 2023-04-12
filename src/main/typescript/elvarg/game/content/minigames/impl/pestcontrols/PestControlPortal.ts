import { Location } from "../../../../model/Location";

class PestControlPortal {


    public id: number;
    public location: Location;

    constructor(id: number,  loc: Location) {
        this.id = id;
        this.location = loc;
    }
}