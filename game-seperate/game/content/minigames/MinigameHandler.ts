import { CastleWars } from "./impl/CastleWars";
import { Player } from "../../entity/impl/player/Player";
import { GameObject } from "../../entity/impl/object/GameObject";
import { PestControl } from "./impl/pestcontrols/PestControl";
import { PestControlBoat } from "./impl/pestcontrols/PestControlBoat";
import { Minigame } from "./Minigame";

export class MinigameHandler {
    public static readonly CASTLEWARS = new MinigameHandler("Castlewars", new CastleWars());
    public static readonly PEST_CONTROL = new MinigameHandler("Pest Control", new PestControl(PestControlBoat.NOVICE));

    private readonly name: String;
    private readonly minigame: Minigame;

    constructor(name: String, minigame: Minigame) {
        this.name = name;
        this.minigame = minigame;
    }

    public static getAll() {
        return Object.values(MinigameHandler)
          .filter(m => m instanceof MinigameHandler && m.minigame != null)
          .map(m => m.minigame);
    }

    public get(): Minigame {
        return this.minigame;
    }

    public static firstClickObject(player: Player, object: GameObject): boolean {
        return this.getAll().some(m => m.firstClickObject(player, object));
    }

    public static handleButtonClick(player: Player, button: number): boolean {
        return this.getAll().some(m => m.handleButtonClick(player, button));
    }

    public static process(): void {
        this.getAll().forEach(m => m.process());
    }
}
