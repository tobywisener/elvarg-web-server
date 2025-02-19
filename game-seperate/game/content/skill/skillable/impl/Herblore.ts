import { Player } from "../../../../entity/impl/player/Player";
import { Item } from "../../../../model/Item";
import { ItemIdentifiers } from "../../../../../util/ItemIdentifiers";
import { ItemCreationSkillable } from "./ItemCreationSkillable";
import { CreationMenu } from "../../../../model/menu/CreationMenu";
import { RequiredItem } from "../../../../model/RequiredItem";
import { AnimationLoop } from "../../../../model/AnimationLoop";
import { Skill } from "../../../../model/Skill";
import { Animation } from "../../../../model/Animation";
import { CreationMenuAction } from "../../../../model/menu/CreationMenu";

class HerbloreAction implements CreationMenuAction{
    constructor(private readonly execFunc: Function){

    }
    execute(item: number, amount: number): void {
        this.execFunc();
    }

}

export class Herblore extends ItemIdentifiers {
    private static ANIMATION: Animation = new Animation(363);

    public static concatenate(player: Player, itemUsed: Item, usedOn: Item): boolean {
        if (!(itemUsed.getDefinition().getName().includes("(") && usedOn.getDefinition().getName().includes(")"))) {
            return false;
        }

        let dose = PotionDose.forId(itemUsed.getId());

        if (dose) {
            if (dose.getDoseForID(usedOn.getId()) > 0) {
                let firstPotAmount = dose.getDoseForID(itemUsed.getId());
                let secondPotAmount = dose.getDoseForID(usedOn.getId());
                if (firstPotAmount + secondPotAmount <= 4) {
                    player.getInventory().deleteItem(itemUsed, 1);
                    player.getInventory().deleteItem(usedOn, 1);
                    player.getInventory().adds(dose.getIDForDose(firstPotAmount + secondPotAmount), 1);
                    player.getInventory().adds(Herblore.EMPTY_VIAL, 1);
                } else {
                    let overflow = (firstPotAmount + secondPotAmount) - 4;
                    player.getInventory().deleteItem(itemUsed, 1);
                    player.getInventory().deleteItem(usedOn, 1);
                    player.getInventory().adds(dose.getIDForDose(4), 1);
                    player.getInventory().adds(dose.getIDForDose(overflow), 1);
                }
                return true;
            }
        }
        return false;
    }

    public static makeUnfinishedPotion(player: Player, itemUsed: number, usedWith: number): boolean {
        if (itemUsed == ItemIdentifiers.VIAL_OF_WATER || usedWith == ItemIdentifiers.VIAL_OF_WATER) {
            let herb = itemUsed == ItemIdentifiers.VIAL_OF_WATER ? usedWith : itemUsed;
            let unfinished = UnfinishedPotion.potions.get(herb);
            if (unfinished != null) {
                player.getPacketSender().sendCreationMenu(new CreationMenu("How many potions would you like to make?", [unfinished.getUnfPotion()], new HerbloreAction((itemId: number, amount: number) => {
                    let skillable = new ItemCreationSkillable([new RequiredItem(new Item(ItemIdentifiers.VIAL_OF_WATER), true), new RequiredItem(new Item(unfinished.getHerbNeeded()), true)],
                        new Item(unfinished.getUnfPotion()), amount, new AnimationLoop(Herblore.ANIMATION, 4),
                        unfinished.getLevelReq(), 10, Skill.HERBLORE);
                    player.getSkillManager().startSkillable(skillable);
                })));
                return true;
            }
        }
        return false;
    }

    public static finishPotion(player: Player, itemUsed: number, usedWith: number): boolean {
        let finished = FinishedPotion.forId(itemUsed, usedWith);
        if (finished != null) {
            player.getPacketSender().sendCreationMenu(new CreationMenu("How many potions would you like to make?", [finished.getFinishedPotion()], new HerbloreAction((itemId: number, amount: number) => {
                let skillable = new ItemCreationSkillable([new RequiredItem(new Item(ItemIdentifiers.VIAL_OF_WATER), true), new RequiredItem(new Item(finished.getItemNeeded()), true)],
                    new Item(finished.getFinishedPotion()), amount, new AnimationLoop(Herblore.ANIMATION, 4),
                    finished.getLevelReq(), 10, Skill.HERBLORE);
                player.getSkillManager().startSkillable(skillable);
            })));
            return true;
        }
        return false;
    }

    public static cleanHerb(player: Player, itemId: number): boolean {
        let herb = CleanableHerb.herbs.get(itemId);
        if (herb != null) {
            if (player.getInventory().contains(herb.getGrimyHerb())) {
                if (player.getSkillManager().getCurrentLevel(Skill.HERBLORE) < herb.getLevelReq()) {
                    player.getPacketSender().sendMessage(`You need a Herblore level of at least ${herb.getLevelReq()} to clean this leaf.`);
                } else {
                    if (player.getClickDelay().elapsedTime(150)) {
                        player.getInventory().deleteNumber(herb.getGrimyHerb(), 1);
                        player.getInventory().adds(herb.getCleanHerb(), 1);
                        player.getSkillManager().addExperiences(Skill.HERBLORE, herb.getExp());
                        player.getPacketSender().sendMessage("You clean the dirt off the leaf.");
                        player.getClickDelay().reset();
                    }
                }
            }
            return true;
        }
        return false;
    }
}

class CleanableHerb {
    GUAM = new CleanableHerb(199, 249, 1, 2);
    MARRENTILL = new CleanableHerb(201, 251, 5, 4);
    TARROMIN = new CleanableHerb(203, 253, 11, 5);
    HARRALANDER = new CleanableHerb(205, 255, 20, 6);
    RANARR = new CleanableHerb(207, 257, 25, 7);
    TOADFLAX = new CleanableHerb(3049, 2998, 30, 8);
    SPIRITWEED = new CleanableHerb(12174, 12172, 35, 9);
    IRIT = new CleanableHerb(209, 259, 40, 10);
    WERGALI = new CleanableHerb(14836, 14854, 30, 11);
    AVANTOE = new CleanableHerb(211, 261, 48, 12);
    KWUARM = new CleanableHerb(213, 263, 54, 13);
    SNAPDRAGON = new CleanableHerb(3051, 3000, 59, 13);
    CADANTINE = new CleanableHerb(215, 265, 65, 14);
    LANTADYME = new CleanableHerb(2485, 2481, 67, 16);
    DWARFWEED = new CleanableHerb(217, 267, 70, 18);
    TORSTOL = new CleanableHerb(219, 269, 75, 21);


    static herbs: Map<number, CleanableHerb> = new Map<number, CleanableHerb>();

    static initialize() {
        for (let herb of Object.values(CleanableHerb)) {
            CleanableHerb.herbs.set(herb.grimyHerb, herb);
        }
    }



    private grimyHerb: number;
    private cleanHerb: number;
    private levelReq: number;
    private cleaningExp: number;

    constructor(grimyHerb: number, cleanHerb: number, levelReq: number, cleaningExp: number) {
        this.grimyHerb = grimyHerb;
        this.cleanHerb = cleanHerb;
        this.levelReq = levelReq;
        this.cleaningExp = cleaningExp;
    }

    public getGrimyHerb(): number {
        return this.grimyHerb;
    }

    public getCleanHerb(): number {
        return this.cleanHerb;
    }

    public getLevelReq(): number {
        return this.levelReq;
    }

    public getExp(): number {
        return this.cleaningExp;
    }
}

class UnfinishedPotion {
    GUAM_POTION = new UnfinishedPotion(91, 249, 1);
    MARRENTILL_POTION = new UnfinishedPotion(93, 251, 5);
    TARROMIN_POTION = new UnfinishedPotion(95, 253, 12);
    HARRALANDER_POTION = new UnfinishedPotion(97, 255, 22);
    RANARR_POTION = new UnfinishedPotion(99, 257, 30);
    TOADFLAX_POTION = new UnfinishedPotion(3002, 2998, 34);
    SPIRIT_WEED_POTION = new UnfinishedPotion(12181, 12172, 40);
    IRIT_POTION = new UnfinishedPotion(101, 259, 45);
    WERGALI_POTION = new UnfinishedPotion(14856, 14854, 1);
    AVANTOE_POTION = new UnfinishedPotion(103, 261, 50);
    KWUARM_POTION = new UnfinishedPotion(105, 263, 55);
    SNAPDRAGON_POTION = new UnfinishedPotion(3004, 3000, 63);
    CADANTINE_POTION = new UnfinishedPotion(107, 265, 66);
    LANTADYME = new UnfinishedPotion(2483, 2481, 69);
    DWARF_WEED_POTION = new UnfinishedPotion(109, 267, 72);
    TORSTOL_POTION = new UnfinishedPotion(111, 269, 78);

    static potions: Map<number, UnfinishedPotion> = new Map<number, UnfinishedPotion>();

    static initialize() {
        for (let potion of Object.values(UnfinishedPotion)) {
            this.potions.set(potion.herbNeeded, potion);
        }
    }

    private unfinishedPotion: number;
    private herbNeeded: number;
    private levelReq: number;

    constructor(unfinishedPotion: number, herbNeeded: number, levelReq: number) {
        this.unfinishedPotion = unfinishedPotion;
        this.herbNeeded = herbNeeded;
        this.levelReq = levelReq;
    }

    public getUnfPotion(): number {
        return this.unfinishedPotion;
    }

    public getHerbNeeded(): number {
        return this.herbNeeded;
    }

    public getLevelReq(): number {
        return this.levelReq;
    }
}



class FinishedPotion {
    ATTACK_POTION = new FinishedPotion(121, 91, 221, 1, 25);
    ANTIPOISON = new FinishedPotion(175, 93, 235, 5, 38);
    STRENGTH_POTION = new FinishedPotion(115, 95, 225, 12, 50);
    RESTORE_POTION = new FinishedPotion(127, 97, 223, 22, 63);
    ENERGY_POTION = new FinishedPotion(3010, 97, 1975, 26, 68);
    DEFENCE_POTION = new FinishedPotion(133, 99, 239, 30, 75);
    AGILITY_POTION = new FinishedPotion(3034, 3002, 2152, 34, 80);
    COMBAT_POTION = new FinishedPotion(9741, 97, 9736, 36, 84);
    PRAYER_POTION = new FinishedPotion(139, 99, 231, 38, 88);
    SUMMONING_POTION = new FinishedPotion(12142, 12181, 12109, 40, 92);
    CRAFTING_POTION = new FinishedPotion(14840, 14856, 5004, 42, 92);
    SUPER_ATTACK = new FinishedPotion(145, 101, 221, 45, 100);
    VIAL_OF_STENCH = new FinishedPotion(18661, 101, 1871, 46, 0);
    FISHING_POTION = new FinishedPotion(181, 101, 231, 48, 106);
    SUPER_ENERGY = new FinishedPotion(3018, 103, 2970, 52, 118);
    SUPER_STRENGTH = new FinishedPotion(157, 105, 225, 55, 125);
    WEAPON_POISON = new FinishedPotion(187, 105, 241, 60, 138);
    SUPER_RESTORE = new FinishedPotion(3026, 3004, 223, 63, 143);
    SUPER_DEFENCE = new FinishedPotion(163, 107, 239, 66, 150);
    ANTIFIRE = new FinishedPotion(2454, 2483, 241, 69, 158);
    RANGING_POTION = new FinishedPotion(169, 109, 245, 72, 163);
    MAGIC_POTION = new FinishedPotion(3042, 2483, 3138, 76, 173);
    ZAMORAK_BREW = new FinishedPotion(189, 111, 247, 78, 175);
    SARADOMIN_BREW = new FinishedPotion(6687, 3002, 6693, 81, 180);
    RECOVER_SPECIAL = new FinishedPotion(15301, 3018, 5972, 84, 200);
    SUPER_ANTIFIRE = new FinishedPotion(15305, 2454, 4621, 85, 210);
    SUPER_PRAYER = new FinishedPotion(15329, 139, 4255, 94, 270);
    SUPER_ANTIPOISON = new FinishedPotion(181, 101, 235, 48, 103);
    HUNTER_POTION = new FinishedPotion(10000, 103, 10111, 53, 110);
    FLETCHING_POTION = new FinishedPotion(14848, 103, 11525, 58, 105);
    ANTIPOISON_PLUS = new FinishedPotion(5945, 3002, 6049, 68, 15);

    // TODO - populate map for potions
    static potions: Map<number, FinishedPotion> = new Map();

    finishedPotion: number;
    unfinishedPotion: number;
    itemNeeded: number;
    levelReq: number;
    expGained: number;

    constructor(finishedPotion: number, unfinishedPotion: number, itemNeeded: number, levelReq: number, expGained: number) {
        this.finishedPotion = finishedPotion;
        this.unfinishedPotion = unfinishedPotion;
        this.itemNeeded = itemNeeded;
        this.levelReq = levelReq;
        this.expGained = expGained;
    }

    public static forId = (usedItem: number, usedOn: number): FinishedPotion | undefined => {
        let potion = FinishedPotion.potions.get(usedItem);
        if (potion != null) {
            if (FinishedPotion.requiredItems(potion, usedItem, usedOn)) {
                return potion;
            }
        }
        potion = FinishedPotion.potions.get(usedOn);
        if (potion != null) {
            if (FinishedPotion.requiredItems(potion, usedItem, usedOn)) {
                return potion;
            }
        }
        return undefined;
    }

    public static requiredItems(potion: FinishedPotion, usedItem: number, usedOn: number): boolean {
        return ((potion.itemNeeded === usedItem || potion.itemNeeded === usedOn) && (potion.unfinishedPotion === usedItem
            || potion.unfinishedPotion == usedOn))
    }

    public getFinishedPotion(): number {
        return this.finishedPotion;
    }

    public getUnfinishedPotion(): number {
        return this.unfinishedPotion;
    }

    public getItemNeeded(): number {
        return this.itemNeeded;
    }

    public getLevelReq(): number {
        return this.levelReq;
    }

    public getExpGained(): number {
        return this.expGained;
    }
}


class PotionDose {
    STRENGTH = new PotionDose(119, 117, 115, 113, ItemIdentifiers.VIAL_OF_WATER, "Strength");
    SUPER_STRENGTH = new PotionDose(161, 159, 157, 2440, ItemIdentifiers.VIAL_OF_WATER, "Super strength");
    SUPER_COMBAT = new PotionDose(12701, 12699, 12697, 12695, ItemIdentifiers.VIAL_OF_WATER, "Super combat");
    ATTACK = new PotionDose(125, 123, 121, 2428, ItemIdentifiers.VIAL_OF_WATER, "Attack");
    SUPER_ATTACK = new PotionDose(149, 147, 145, 2436, ItemIdentifiers.VIAL_OF_WATER, "Super attack");
    DEFENCE = new PotionDose(137, 135, 133, 2432, ItemIdentifiers.VIAL_OF_WATER, "Defence");
    SUPER_DEFENCE = new PotionDose(167, 165, 163, 2442, ItemIdentifiers.VIAL_OF_WATER, "Super defence");
    RANGING_POTION = new PotionDose(173, 171, 169, 2444, ItemIdentifiers.VIAL_OF_WATER, "Ranging");
    FISHING = new PotionDose(155, 153, 151, 2438, ItemIdentifiers.VIAL_OF_WATER, "Fishing");
    PRAYER = new PotionDose(143, 141, 139, 2434, ItemIdentifiers.VIAL_OF_WATER, "Prayer");
    ANTIFIRE = new PotionDose(458, 2456, 2454, 2452, ItemIdentifiers.VIAL_OF_WATER, "Antifire");
    ZAMORAK_BREW = new PotionDose(193, 191, 189, 2450, ItemIdentifiers.VIAL_OF_WATER, "Zamorakian brew");
    ANTIPOISON = new PotionDose(179, 177, 175, 2446, ItemIdentifiers.VIAL_OF_WATER, "Antipoison");
    RESTORE = new PotionDose(131, 129, 127, 2430, ItemIdentifiers.VIAL_OF_WATER, "Restoration");
    MAGIC_POTION = new PotionDose(3046, 3044, 3042, 3040, ItemIdentifiers.VIAL_OF_WATER, "Magic");
    SUPER_RESTORE = new PotionDose(3030, 3028, 3026, 3024, ItemIdentifiers.VIAL_OF_WATER, "Super Restoration");
    ENERGY = new PotionDose(3014, 3012, 3010, 3008, ItemIdentifiers.VIAL_OF_WATER, "Energy");
    SUPER_ENERGY = new PotionDose(3022, 3020, 3018, 3016, ItemIdentifiers.VIAL_OF_WATER, "Super Energy");
    AGILITY = new PotionDose(3038, 3036, 3034, 3032, ItemIdentifiers.VIAL_OF_WATER, "Agility");
    SARADOMIN_BREW = new PotionDose(6691, 6689, 6687, 6685, ItemIdentifiers.VIAL_OF_WATER, "Saradomin brew");
    ANTIPOISON1 = new PotionDose(5949, 5947, 5945, 5943, ItemIdentifiers.VIAL_OF_WATER, "Antipoison (+)");
    ANTIPOISON2 = new PotionDose(5958, 5956, 5954, 5952, ItemIdentifiers.VIAL_OF_WATER, "Antipoison (++)");
    SUPER_ANTIPOISON = new PotionDose(185, 183, 181, 2448, ItemIdentifiers.VIAL_OF_WATER, "Super Antipoison");
    RELICYMS_BALM = new PotionDose(4848, 4846, 4844, 4842, ItemIdentifiers.VIAL_OF_WATER, "Relicym's balm");
    SERUM_207 = new PotionDose(3414, 3412, 3410, 3408, ItemIdentifiers.VIAL_OF_WATER, "Serum 207");
    COMBAT = new PotionDose(9745, 9743, 9741, 9739, ItemIdentifiers.VIAL_OF_WATER, "Combat");

    // TODO - Populate map for potions
    static potions = new Map<number, PotionDose>();

    oneDosePotionID: number;
    twoDosePotionID: number;
    threeDosePotionID: number;
    fourDosePotionID: number;
    vial: number;
    potionName: string;

    constructor(oneDosePotionID: number, twoDosePotionID: number,
        threeDosePotionID: number, fourDosePotionID: number, vial: number,
        potionName: string) {
        this.oneDosePotionID = oneDosePotionID;
        this.twoDosePotionID = twoDosePotionID;
        this.threeDosePotionID = threeDosePotionID;
        this.fourDosePotionID = fourDosePotionID;
        this.vial = vial;
        this.potionName = potionName;
    }


    static forId(itemId: number): PotionDose | undefined {
        return this.potions[itemId];
    }

    getDoseID1(): number {
        return this.oneDosePotionID;
    }

    getDoseID2(): number {
        return this.twoDosePotionID;
    }

    getDoseID3(): number {
        return this.threeDosePotionID;
    }

    getFourDosePotionID(): number {
        return this.fourDosePotionID;
    }

    getVial(): number {
        return this.vial;
    }

    getPotionName(): string {
        return this.potionName;
    }

    getDoseForID(id: number) {
        if (id == this.oneDosePotionID) {
            return 1;
        }
        if (id == this.twoDosePotionID) {
            return 2;
        }
        if (id == this.threeDosePotionID) {
            return 3;
        }
        if (id == this.fourDosePotionID) {
            return 4;
        }
        return -1;
    }

    getIDForDose(dose: number) {
        if (dose == 1) {
            return this.oneDosePotionID;
        }
        if (dose == 2) {
            return this.twoDosePotionID;
        }
        if (dose == 3) {
            return this.threeDosePotionID;
        }
        if (dose == 4) {
            return this.fourDosePotionID;
        }
        if (dose == 0) {
            return ItemIdentifiers.EMPTY_VIAL;
        }
        return -1;
    }
}
