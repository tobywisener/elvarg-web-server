export class Sound {

    // crafting sounds

    public static CUTTING = new Sound(375, 1, 0, 0)

    // cooking sounds

    public static COOKING_COOK = new Sound(1039, 1, 10, 0)

    public static COOKING_BURN = new Sound(240, 1, 0, 0)

    // runecrafting sounds

    public static CRAFT_RUNES = new Sound(207, 0, 0, 0)

    // mining sounds

    public static MINING_MINE = new Sound(432, 1, 15, 0)

    public static MINING_ROCK_GONE = new Sound(431, 1, 0, 0)

    public static MINING_ROCK_RESTORE = new Sound(463, 1, 0, 0)

    public static MINING_ROCK_EXPLODE = new Sound(1021, 1, 0, 0)

    // fishing sounds

    public static FISHING_FISH = new Sound(379, 1, 10, 0)

    // woodcutting sounds



    public static readonly WOODCUTTING_CHOP = new Sound(472, 1, 10, 0);

    public static WOODCUTTING_TREE_DOWN = new Sound(473, 1, 0, 0)

    // Getting hit
    public static FEMALE_GETTING_HIT = new Sound(818, 1, 25, 0)

    // weapon sounds

    public static IMP_ATTACKING = new Sound(10, 1, 25, 0)

    public static SHOOT_ARROW = new Sound(370, 1, 0, 0)

    public static WEAPON = new Sound(398, 1, 25, 0) // default/other

    public static WEAPON_GODSWORD = new Sound(390, 1, 25, 0)

    public static WEAPON_STAFF = new Sound(394, 1, 25, 0)

    public static WEAPON_BOW = new Sound(370, 1, 25, 0)

    public static WEAPON_BATTLE_AXE = new Sound(399, 1, 25, 0)

    public static WEAPON_TWO_HANDER = new Sound(400, 1, 25, 0)

    public static WEAPON_SCIMITAR = new Sound(396, 1, 25, 0)

    public static WEAPON_WHIP = new Sound(1080, 1, 25, 0)

    // Special attack

    public static readonly DRAGON_DAGGER_SPECIAL = new Sound(385, 1, 25, 0)

    // Spell sounds

    public static SPELL_FAIL_SPLASH = new Sound(193, 1, 0, 0)
    public static TELEPORT = new Sound(202, 1, 0, 0)

    public static ICA_BARRAGE_IMPACT = new Sound(1125, 1, 0, 0)

    public static DROP_ITEM = new Sound(376, 1, 0, 0)
    public static PICK_UP_ITEM = new Sound(358, 1, 0, 0)


    public static SET_UP_BARRICADE = new Sound(358, 1, 0, 0)

    public static FIRE_LIGHT = new Sound(375, 1, 0, 0)
    public static FIRE_SUCCESSFUL = new Sound(608, 1, 0, 0)
    public static FIRE_FIRST_ATTEMPT = new Sound(2584, 1, 0, 0)
    public static SLASH_WEB = new Sound(237, 1, 0, 0)
    public static FAIL_SLASH_WEB = new Sound(2548, 1, 0, 0)
    public static FOOD_EAT = new Sound(317, 1, 0, 0)
    public static DRINK = new Sound(334, 1, 0, 0)

    public id: number;
    public volume: number;
    public delay: number;

    public loopType: number;

    constructor(id: number, volume: number, delay: number, loopType: number) {

        this.id = id;
        this.volume = volume;
        this.delay = delay;
        this.loopType = loopType;
    }

    public getId(): number {
        return this.id;
    }

    public getVolume(): number {
        return this.volume;
    }

    public getDelay(): number {
        return this.delay;
    }

    public getLoopType(): number { return this.loopType; }

}


