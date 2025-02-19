import { Location } from "../model/Location";
import { FighterPreset } from "../entity/impl/playerbot/fightstyle/FighterPreset";

export class PlayerBotDefinition {

    private readonly username: string;

    private readonly spawnLocation: Location;

    private readonly fighterPreset: FighterPreset;

    constructor(username: string, spawnLocation: Location, fighterPreset: FighterPreset) {
        this.username = username;
        this.spawnLocation = spawnLocation;
        this.fighterPreset = fighterPreset;
    }

    public getUsername(): string {
        return this.username;
    }

    public getSpawnLocation(): Location {
        return this.spawnLocation;
    }

    public getFighterPreset(): FighterPreset {
        return this.fighterPreset;
    }
}
