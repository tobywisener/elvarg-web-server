import { Location } from "../../../../model/Location";
import { Player } from "../../../../entity/impl/player/Player";

export class PestControlBoat {

    public static readonly NOVICE = new PestControlBoat(40, 14315, new Location(2661, 2639), 1771, 2953, "NOVICE");
    public static readonly INTERMEDIATE = new PestControlBoat(70, 25631, new Location(2640, 2644), 1772, 2953, "INTERMEDIATE");
    public static readonly VETERAN = new PestControlBoat(100, 25632, new Location(2634, 2653), 1773, 2950, "VETERAN");;

    public combatLevelRequirement: number
    public objectId: number;
    public enterBoatLocation: Location;
    public name: string;

    public squireId: number;
    public void_knight_id: number;

    private queue: Player[];

    getQueue(): Player[] {
        if (!this.queue) {
            this.queue = [];
        }
        return this.queue;
    }

    constructor(combatLevelRequirement: number, objectId: number, enterBoatLocation: Location, squireId: number, void_knight_id: number, name: string) {
        this.combatLevelRequirement = combatLevelRequirement;
        this.objectId = objectId;
        this.enterBoatLocation = enterBoatLocation;
        this.squireId = squireId;
        this.void_knight_id = void_knight_id;
        this.name = name;
    }

    static getBoat(ladderId: number): PestControlBoat{
        const boats = Object.values(PestControlBoat);
        return boats.find((l) => l.objectId === ladderId) ?? null;
    }

    public getName(): string{
        return this.name;
    }
}
