import { Item } from "../model/Item";
import { RandomGen } from "../../util/RandomGen";

export class NpcDropDefinition {
    public static definitions = new Map<number, NpcDropDefinition>();
    private npcIds: number[];
    private rdtChance: number;
    private alwaysDrops: NPCDrop[];
    private commonDrops: NPCDrop[];
    private uncommonDrops: NPCDrop[];
    private rareDrops: NPCDrop[];
    private veryRareDrops: NPCDrop[];
    private specialDrops: NPCDrop[];

    public static get(npcId: number): NpcDropDefinition | undefined {
        return this.definitions.get(npcId);
    }

    public getNpcIds(): number[] {
        return this.npcIds;
    }

    public getRdtChance(): number {
        return this.rdtChance;
    }

    public getAlwaysDrops(): NPCDrop[] {
        return this.alwaysDrops;
    }

    public getCommonDrops(): NPCDrop[] {
        return this.commonDrops;
    }

    public getUncommonDrops(): NPCDrop[] {
        return this.uncommonDrops;
    }

    public getRareDrops(): NPCDrop[] {
        return this.rareDrops;
    }

    public getVeryRareDrops(): NPCDrop[] {
        return this.veryRareDrops;
    }


    public getSpecialDrops(): NPCDrop[] {
        return this.specialDrops;
    }

}

export class NPCDrop {
    itemId: number;
    minAmount: number;
    maxAmount: number;
    chance: number;

    constructor(itemId: number, minAmount: number, maxAmount: number, chance?: number) {
        this.itemId = itemId;
        this.minAmount = minAmount;
        this.maxAmount = maxAmount;
        if (chance === null) {
            this.chance = chance;

        } else {
            this.chance = -1;

        }
    }

    getItemId(): number {
        return this.itemId;
    }

    getMinAmount(): number {
        return this.minAmount;
    }

    getMaxAmount(): number {
        return this.maxAmount;
    }

    toItem(random: RandomGen): Item {
        return new Item(this.itemId, random.getInclusive(this.minAmount, this.maxAmount));
    }

    getChance(): number {
        return this.chance;
    }
}

export class DropTable {
    public static readonly COMMON = new DropTable(90);
    public static readonly UNCOMMON = new DropTable(40);
    public static readonly RARE = new DropTable(6);
    public static readonly VERY_RARE = new DropTable(0.6);
    public static readonly SPECIAL = new DropTable(-1);

    public readonly randomRequired: number;

    constructor(randomRequired: number) {
        this.randomRequired = randomRequired;
    }

    public getRandomRequired(): number {
        return this.randomRequired;
    }
}

export class RDT {
    public static readonly LAW_RUNE = new RDT(563, 45, 64);
    public static readonly DEATH_RUNE = new RDT(560, 45, 64);
    public static readonly NATURE_RUNE = new RDT(561, 67, 43);
    public static readonly STEEL_ARROW = new RDT(886, 150, 64);
    public static readonly RUNE_ARROW = new RDT(886, 42, 64);
    public static readonly UNCUT_SAPPHIRE = new RDT(1623, 1, 1);
    public static readonly UNCUT_EMERALD = new RDT(1621, 1, 20);
    public static readonly UNCUT_RUBY = new RDT(1619, 1, 20);
    public static readonly UNCUT_DIAMOND = new RDT(1617, 1, 64);
    public static readonly DRAGONSTONE = new RDT(1631, 1, 64);
    public static readonly RUNITE_BAR = new RDT(2363, 1, 20);
    public static readonly SILVER_ORE = new RDT(443, 100, 64);
    public static readonly COINS = new RDT(995, 3000, 1);
    public static readonly CHAOS_TALISMAN = new RDT(1452, 1, 1);
    public static readonly NATURE_TALISMAN = new RDT(1462, 1, 20);
    public static readonly LOOP_HALF_OF_KEY = new RDT(987, 6, 1);
    public static readonly TOOTH_HALF_OF_KEY = new RDT(985, 6, 1);
    public static readonly ADAMANT_JAVELIN = new RDT(829, 20, 64);
    public static readonly RUNE_JAVELIN = new RDT(830, 5, 33);
    public static readonly RUNE_2H_SWORD = new RDT(1319, 1, 43);
    public static readonly RUNE_BATTLEAXE = new RDT(1373, 1, 43);
    public static readonly RUNE_SQUARE_SHIELD = new RDT(1185, 1, 64);
    public static readonly RUNE_KITE_SHIELD = new RDT(1201, 1, 128);
    public static readonly DRAGON_MED_HELM = new RDT(1149, 1, 128);
    public static readonly RUNE_SPEAR = new RDT(1247, 1, 137);
    public static readonly SHIELD_LEFT_HALF = new RDT(2366, 1, 273);
    public static readonly DRAGON_SPEAR = new RDT(1249, 1, 364);

    itemId: number;
    amount: number;
    chance: number;


    constructor(itemId: number, amount: number, chance: number) {
        this.itemId = itemId;
        this.amount = amount;
        this.chance = chance;
    }

    getItemId(): number {
        return this.itemId;
    }

    getAmount(): number {
        return this.amount;
    }

    getChance(): number {
        return this.chance;
    }
}