import { GameObject } from "../../../../entity/impl/object/GameObject";
import { Animation } from "../../../../model/Animation";
import { Skill } from "../../../../model/Skill";
import { ItemCreationSkillable } from './ItemCreationSkillable'
import { RequiredItem } from "../../../../model/RequiredItem";
import { Item } from "../../../../model/Item";
import { AnimationLoop } from "../../../../model/AnimationLoop";
import { Misc } from "../../../../../util/Misc";
import { ItemDefinition } from "../../../../definition/ItemDefinition";
import { ObjectIdentifiers } from "../../../../../util/ObjectIdentifiers";
import { Player } from "../../../../entity/impl/player/Player";
import { ObjectManager } from "../../../../entity/impl/object/ObjectManager";

export class Cooking extends ItemCreationSkillable {
    public static ANIMATION = new Animation(896);

    private object: GameObject;
    private cookable: Cookable;

    constructor(object: GameObject, cookable: Cookable, amount: number) {
        super(
            [new RequiredItem(new Item(cookable.getrawItem()), true)],
            new Item(cookable.getcookedItem()), amount,
            new AnimationLoop(Cooking.ANIMATION, 4),
            cookable.getReqReq(), cookable.getxp(), Skill.COOKING
        );
        this.object = object;
        this.cookable = cookable;
    }

    static success(player: Player, burnBonus: number, ReqReq: number, stopBurn: number): boolean {
        if (player.getSkillManager().getCurrentLevel(Skill.COOKING) >= stopBurn) {
            return true;
        }
        let burn_chance = (45.0 - burnBonus);
        let cook_Req = player.getSkillManager().getCurrentLevel(Skill.COOKING);
        let lev_needed = ReqReq;
        let burn_stop = stopBurn;
        let multi_a = (burn_stop - lev_needed);
        let burn_dec = (burn_chance / multi_a);
        let multi_b = (cook_Req - lev_needed);
        burn_chance -= (multi_b * burn_dec);
        let randNum = Misc.getRandomInt() * 100.0;
        return burn_chance <= randNum;
    }

    finishedCycle(player: Player) {
        // Decrement amount left to cook..
        this.decrementAmount();

        // Delete raw food..
        player.getInventory().deleteNumber(this.cookable.getrawItem(), 1);

        // Add burnt or cooked item..
        if (Cooking.success(player, 3, this.cookable.getReqReq(), this.cookable.getstopBurn())) {
            player.getInventory().adds(this.cookable.getcookedItem(), 1);
            player.getPacketSender()
                .sendMessage("You cook the " + ItemDefinition.forId(this.cookable.getrawItem()).getName() + ".");
            player.getSkillManager().addExperiences(Skill.COOKING, this.cookable.getxp());
        } else {
            player.getInventory().adds(this.cookable.getburntItem(), 1);
            player.getPacketSender()
                .sendMessage("You burn the " + ItemDefinition.forId(this.cookable.getrawItem()).getName() + ".");
        }
    }

    hasRequirements(player: Player): boolean {
        // If we're using a fire, make sure to check it's still there.
        if (this.object.getId() == ObjectIdentifiers.FIRE_5
            && !ObjectManager.exists(ObjectIdentifiers.FIRE_5, this.object.getLocation())) {
            return false;
        }
        return super.hasRequirements(player);
    }

}

export class Cookable {
    SHRIMP = {
        rawItem: 317,
        cookedItem: 315,
        Item: 7954,
        Req: 1,
        xp: 30,
        stopBurn: 33,
        name: "shrimp"
    };
    ANCHOVIES = {
        rawItem: 321,
        cookedItem: 319,
        Item: 323,
        Req: 1,
        xp: 30,
        stopBurn: 34,
        name: "anchovies"
    };
    TROUT = {
        rawItem: 335,
        cookedItem: 333,
        Item: 343,
        Req: 15,
        xp: 70,
        stopBurn: 50,
        name: "trout"
    };
    COD = {
        rawItem: 341,
        cookedItem: 339,
        Item: 343,
        Req: 18,
        xp: 75,
        stopBurn: 54,
        name: "cod"
    };
    SALMON = {
        rawItem: 331,
        cookedItem: 329,
        Item: 343,
        Req: 25,
        xp: 90,
        stopBurn: 58,
        name: "salmon"
    };
    TUNA = {
        rawItem: 359,
        cookedItem: 361,
        Item: 367,
        Req: 30,
        xp: 100,
        stopBurn: 58,
        name: "tuna"
    };
    LOBSTER = {
        rawItem: 377,
        cookedItem: 379,
        Item: 381,
        Req: 40,
        xp: 120,
        stopBurn: 74,
        name: "lobster"
    };
    BASS = {
        rawItem: 363,
        cookedItem: 365,
        Item: 367,
        Req: 40,
        xp: 130,
        stopBurn: 75,
        name: "bass"
    };
    SWORDFISH = {
        rawItem: 371,
        cookedItem: 373,
        Item: 375,
        Req: 45,
        xp: 140,
        stopBurn: 86,
        name: "swordfish"
    };
    MONKFISH = {
        rawItem: 7944,
        cookedItem: 7946,
        Item: 7948,
        Req: 62,
        xp: 150,
        stopBurn: 91,
        name: "monkfish"
    };
    SHARK = {
        rawItem: 383,
        cookedItem: 385,
        Item: 387,
        Req: 80,
        xp: 210,
        stopBurn: 94,
        name: "shark"
    };
    SEA_TURTLE = {
        rawItem: 395,
        cookedItem: 397,
        Item: 399,
        Req: 82,
        xp: 212,
        stopBurn: 105,
        name: "sea turtle"
    };
    MANTA_RAY = {
        rawItem: 389,
        cookedItem: 391,
        burntItem: 393,
        levelReq: 91,
        xp: 217,
        stopBurn: 99,
        name: "manta ray"
    };

    private static cookables: { [key: number]: Cookable } = {};

    rawItem: number;
    cookedItem: number;
    burntItem: number;
    ReqReq: number;
    xp: number;
    stopBurn: number;
    name: string;
    //TODO IMPLEMENTAR INTERFACE E O METODO NEXT

    static initialize() {
        for (let c of Object.values(Cookable)) {
            Cookable.cookables[c[0]] = c;
            Cookable.cookables[c[1]] = c;
        }
    }

    public static getForItems(item: number): Cookable | undefined {
        return Cookable.cookables[item];
    }

    constructor(rawItem: number, cookedItem: number, burntItem: number, ReqReq: number, xp: number, stopBurn: number, name: string) {
        this.rawItem = rawItem;
        this.cookedItem = cookedItem;
        this.burntItem = burntItem;
        this.ReqReq = ReqReq;
        this.xp = xp;
        this.stopBurn = stopBurn;
        this.name = name;
    }

    public static getForItem(item: number): Cookable | undefined {
        return Cookable.cookables[item];
    }

    getrawItem(): number {
        return this.rawItem;
    }

    getcookedItem(): number {
        return this.cookedItem;
    }

    getburntItem(): number {
        return this.burntItem;
    }

    getReqReq(): number {
        return this.ReqReq;
    }

    getxp(): number {
        return this.xp;
    }

    getstopBurn(): number {
        return this.stopBurn;
    }

    getname(): string {
        return this.name;
    }
}

