import { TimerKey } from "../../util/timers/TimerKey";
import { Player } from "../entity/impl/player/Player";
import { Sounds } from "../Sounds";
import { Sound } from "../Sound";
import { Skill } from "../model/Skill";
import { Item } from "../model/Item";
import { Animation } from "../model/Animation";

export class Food {
    /**
     * The {@link Animation} that will be played when consuming food.
     */
    private static readonly ANIMATION = new Animation(829);

    public static consume(player: Player, item: number, slot: number): boolean {
        const food = Edible.types.get(item);
        // Check if {@code item} is a valid food type..
        if (!food) {
            return false;
        }

        if (player.getArea() != null) {
            if (!player.getArea().canEat(player, item)) {
                player.getPacketSender().sendMessage("You cannot eat here.");
                return true;
            }
        }

        // Check if we're currently able to eat..
        if (player.getTimers().has(TimerKey.STUN)) {
            player.getPacketSender().sendMessage("You're currently stunned!");
            return true;
        }

        if (food == Edible.KARAMBWAN) {
            if (player.getTimers().has(TimerKey.KARAMBWAN))
                return true;
        } else {
            if (player.getTimers().has(TimerKey.FOOD)) {
                return true;
            }
        }

        player.getTimers().extendOrRegister(TimerKey.FOOD, 3);
        player.getTimers().extendOrRegister(TimerKey.COMBAT_ATTACK, 5);

        if (food == Edible.KARAMBWAN) {
            player.getTimers().registers(TimerKey.KARAMBWAN, 3); // Register karambwan timer too
            player.getTimers().registers(TimerKey.POTION, 3); // Register the potion timer (karambwan blocks pots)
        }

        // Close interfaces..
        player.getPacketSender().sendInterfaceRemoval();

        // Stop skilling..
        player.getSkillManager().stopSkillable();

        // Send sound..
        Sounds.sendSound(player, Sound.FOOD_EAT);

        player.performAnimation(Food.ANIMATION);

        // Delete food from inventory..
        player.getInventory().deleteItem(food.item, slot);

        // Heal the player..
        const currentHp = player.getSkillManager().getCurrentLevel(Skill.HITPOINTS);
        let maxHp = player.getSkillManager().getMaxLevel(Skill.HITPOINTS);
        let healAmount = food.heal;

        if (food == Edible.ANGLERFISH) {
                let c: number = 2;
            if (currentHp >= 25) {
                c = 4;
            }
            if (currentHp >= 50) {
                c = 6;
            }
            if (currentHp >= 75) {
                c = 8;
            }
            if (currentHp >= 93) {
                c = 13;
            }
            healAmount = Math.floor((currentHp / 10) + c);
            if (healAmount > 22) {
                healAmount = 22;
            }
            maxHp += healAmount;
        }

        if (healAmount + currentHp > maxHp) {
            healAmount = maxHp - currentHp;
        }
        if (healAmount < 0) {
            healAmount = 0;
        }

        player.setHitpoints(player.getHitpoints() + healAmount);

        // Send message to player..
        const e: string = food == Edible.BANDAGES ? "use" : "eat";
        player.getPacketSender().sendMessage("You " + e + " the " + food.name + ".");

        // Handle cake slices..
        if (food == Edible.CAKE || food == Edible.SECOND_CAKE_SLICE) {
            player.getInventory().deleteItem(new Item(food.item.getId() + 2),1);
        }
        return true;
    }

}

export class Edible {
    public static readonly KEBAB = new Edible(new Item(1971), 4);
    public static readonly CHEESE = new Edible(new Item(1985), 4);
    public static readonly CAKE = new Edible(new Item(1891), 5 );
    public static readonly SECOND_CAKE_SLICE = new Edible(new Item(1893), 5 );
    public static readonly THIRD_CAKE_SLICE = new Edible(new Item(1895), 5 );
    public static readonly BANDAGES = new Edible(new Item(14640), 12 );
    public static readonly JANGERBERRIES = new Edible(new Item(247), 2 );
    public static readonly WORM_CRUNCHIES = new Edible(new Item(2205), 7 );
    public static readonly EDIBLE_SEAWEED = new Edible(new Item(403), 4 );
    public static readonly ANCHOVIES = new Edible(new Item(319), 1 );
    public static readonly SHRIMPS = new Edible(new Item(315), 3 );
    public static readonly SARDINE = new Edible(new Item(325), 4 );
    public static readonly COD = new Edible(new Item(339), 7 );
    public static readonly TROUT = new Edible(new Item(333), 7 );
    public static readonly PIKE = new Edible(new Item(351), 8 );
    public static readonly SALMON = new Edible(new Item(329), 9 );
    public static readonly TUNA = new Edible(new Item(361), 10 );
    public static readonly LOBSTER = new Edible(new Item(379), 12 );
    public static readonly BASS = new Edible(new Item(365), 13 );
    public static readonly SWORDFISH = new Edible(new Item(373), 14 );
    public static readonly MEAT_PIZZA = new Edible(new Item(2293), 14 );
    public static readonly MONKFISH = new Edible(new Item(7946), 16 );
    public static readonly SHARK = new Edible(new Item(385), 20 );
    public static readonly SEA_TURTLE = new Edible(new Item(397), 21 );
    public static readonly DARK_CRAB = new Edible(new Item(11936), 22 );
    public static readonly MANTA_RAY = new Edible(new Item(391), 22 );
    public static readonly KARAMBWAN = new Edible(new Item(3144), 18);
    public static readonly ANGLERFISH = new Edible(new Item(13441), 22 );
    /*
    * Baked goods food types a player can make with the cooking skill.
    */
    public static readonly POTATO = ( new Item(1942), 1 );
    public static readonly BAKED_POTATO = ( new Item(6701), 4 );
    public static readonly POTATO_WITH_BUTTER = (  new Item(6703), 14 );
    public static readonly CHILLI_POTATO = ( new Item(7054), 14 );
    public static readonly EGG_POTATO = ( new Item(7056), 16 );
    public static readonly POTATO_WITH_CHEESE = ( new Item(6705), 16 );
    public static readonly MUSHROOM_POTATO = ( new Item(7058), 20 );
    public static readonly TUNA_POTATO = ( new Item(7060), 20 );
    public static readonly SPINACH_ROLL = ( new Item(1969), 2 );
    public static readonly BANANA = ( new Item(1963), 2 );
    public static readonly BANANA_ = ( new Item(18199), 2 );
    public static readonly CABBAGE = ( new Item(1965), 2 );
    public static readonly ORANGE = ( new Item(2108), 2 );
    public static readonly PINEAPPLE_CHUNKS = ( new Item(2116), 2 );
    public static readonly PINEAPPLE_RINGS = ( new Item(2118), 2 );
    public static readonly PEACH = ( new Item(6883), 8 );
    public static readonly PURPLE_SWEETS = ( new Item(4561), 3 );

    public static types = new Map<number, Edible>([
        [1971, new Edible(new Item(1971), 4)], // Kebab
        [1985, new Edible(new Item(1985), 4)], // Cheese
        [1891, new Edible(new Item(1891), 5)], // Cake
        [1893, new Edible(new Item(1893), 5)], // Second cake slice
        [1895, new Edible(new Item(1895), 5)], // Third cake slice
        [14640, new Edible(new Item(14640), 12)], // Bandages
        [247, new Edible(new Item(247), 2)], // Jangerberries
        [2205, new Edible(new Item(2205), 7)], // Worm crunchies
        [403, new Edible(new Item(403), 4)], // Edible seaweed
        [319, new Edible(new Item(319), 1)], // Anchovies
        [315, new Edible(new Item(315), 3)], // Shrimps
        [325, new Edible(new Item(325), 4)], // Sardine
        [339, new Edible(new Item(339), 7)], // Cod
        [333, new Edible(new Item(333), 7)], // Trout
        [351, new Edible(new Item(351), 8)], // Pike
        [329, new Edible(new Item(329), 9)], // Salmon
        [361, new Edible(new Item(361), 10)], // Tuna
        [379, new Edible(new Item(379), 12)], // Lobster
        [365, new Edible(new Item(365), 13)], // Bass
        [373, new Edible(new Item(373), 14)], // Swordfish
        [2293, new Edible(new Item(2293), 14)], // Meat pizza
        [7946, new Edible(new Item(7946), 16)], // Monkfish
        [385, new Edible(new Item(385), 20)], // Shark
        [397, new Edible(new Item(397), 21)], // Sea turtle
        [11936, new Edible(new Item(11936), 22)], // Dark crab
        [391, new Edible(new Item(391), 22)], // Manta ray
        [3144, new Edible(new Item(3144), 18)], // Karambwan
        [13441, new Edible(new Item(13441), 22)], // Anglerfish
        [1942, new Edible(new Item(1942), 1)], // Potato
        [6701, new Edible(new Item(6701), 4)], // Baked potato
        [6703, new Edible(new Item(6703), 14)], // Potato with butter
        [7054, new Edible(new Item(7054), 14)], // Chilli potato
        [7056, new Edible(new Item(7056), 16)], // Egg potato
        [6705, new Edible(new Item(6705), 16)], // Potato with cheese
        [7058, new Edible(new Item(7058), 20)], // Mushroom potato
        [7060, new Edible(new Item(7060), 20)], // Tuna potato
        // TODO: Fill out other foods
        ]);


    public item: Item;
    public heal: number;
    public name: string;

    constructor(item: Item, heal: number, name?: string) {
        this.item = item;
        this.heal = heal;
        this.name = name.toLowerCase().replace(/__/g, "-").replace(/_/g, " ");
    }

    public getItem(): Item {
        return this.item;
    }

    /**
     * Returns an array of all Edible item ids.
     *
     * @return {Integer[]} edibleTypes
     */
    public static getTypes(): number[] {
        return Object.keys(Edible.types).map(Number);
    }

    public getHeal(): number {
        return this.heal;
    }
}
