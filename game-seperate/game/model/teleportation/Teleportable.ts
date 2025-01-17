import { Location } from "../Location";
import { CastleWars } from "../../content/minigames/impl/CastleWars";
import { TeleportButton } from '../teleportation/TeleportButton'

export class Teleportable {
    readonly EDGEVILLE_DITCH = new Teleportable(
        TeleportButton.WILDERNESS,
        0,
        0,
        new Location(3088, 3520)
    )
    readonly WEST_DRAGONS = new Teleportable(
        TeleportButton.WILDERNESS,
        0,
        1,
        new Location(2979, 3592)
    )
    readonly EAST_DRAGONS = new Teleportable(
        TeleportButton.WILDERNESS,
        0,
        2,
        new Location(3356, 3675)
    )
    readonly KING_BLACK_DRAGON = new Teleportable(
        TeleportButton.BOSSES,
        2,
        1,
        new Location(3005, 3850)
    )
    readonly CHAOS_ELEMENTAL = new Teleportable(
        TeleportButton.BOSSES,
        2,
        2,
        new Location(3267, 3916)
    )
    readonly ELDER_CHAOS_DRUID = new Teleportable(
        TeleportButton.BOSSES,
        2,
        3,
        new Location(3236, 3636)
    )
    readonly CRAZY_ARCHAEOLOGIST = new Teleportable(
        TeleportButton.BOSSES,
        2,
        4,
        new Location(2980, 3708)
    )
    readonly CHAOS_FANATIC = new Teleportable(
        TeleportButton.BOSSES,
        2,
        5,
        new Location(2986, 3838)
    )
    readonly VENENATIS = new Teleportable(
        TeleportButton.BOSSES,
        2,
        6,
        new Location(3346, 3727)
    )
    readonly VET_ION = new Teleportable(
        TeleportButton.BOSSES,
        2,
        7,
        new Location(3187, 3787)
    )
    readonly CALLISTO = new Teleportable(
        TeleportButton.BOSSES,
        2,
        8,
        new Location(3312, 3830)
    )
    public static readonly DUEL_ARENA = new Teleportable(
        TeleportButton.MINIGAME,
        1,
        0,
        new Location(3370, 3270)
    )

    readonly BARROWS = new Teleportable(
        TeleportButton.MINIGAME,
        1,
        1,
        new Location(3565, 3313)
    )
    readonly FIGHT_CAVES = new Teleportable(
        TeleportButton.MINIGAME,
        1,
        2,
        new Location(2439, 5171)
    )
    readonly CASTLE_WARS = new Teleportable(
        TeleportButton.MINIGAME,
        1,
        3,
        CastleWars.LOBBY_TELEPORT
    )

    private teleportButton: TeleportButton;
    private type: number;
    private index: number;
    private position: Location;

    constructor(teleportButton: TeleportButton, type: number, index: number, position: Location) {
        this.teleportButton = teleportButton;
        this.type = type;
        this.index = index;
        this.position = position;
    }

    public getTeleportButton(): TeleportButton {
        return this.teleportButton;
    }

    public getType(): number {
        return this.type;
    }

    public getIndex(): number {
        return this.index;
    }

    public getPosition(): Location {
        return this.position;
    }
}