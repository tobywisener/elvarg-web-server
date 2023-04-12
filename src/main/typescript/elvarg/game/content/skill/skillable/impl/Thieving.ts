
import { PetHandler } from "../../../PetHandler";
import { CombatFactory } from "../../../combat/CombatFactory";
import { HitDamage } from "../../../combat/hit/HitDamage";
import { HitMask } from "../../../combat/hit/HitMask";
import { NPC } from "../../../../entity/impl/npc/NPC";
import { GameObject } from "../../../../entity/impl/object/GameObject";
import { Player } from "../../../../entity/impl/player/Player";
import { Animation } from "../../../../model/Animation";
import { Graphic } from "../../../../model/Graphic";
import { GraphicHeight } from "../../../../model/GraphicHeight";
import { Item } from "../../../../model/Item";
import { Skill } from "../../../../model/Skill";
import { Task } from "../../../../task/Task";
import { TaskManager } from "../../../../task/TaskManager";
import { TimedObjectReplacementTask } from "../../../../task/impl/TimedObjectReplacementTask";
import { ItemIdentifiers } from "../../../../../util/ItemIdentifiers";
import { Misc } from "../../../../../util/Misc";
import { TimerKey } from "../../../../../util/timers/TimerKey";

class ThievingTask extends Task {
    constructor(private readonly execFunction: Function, player: Player) {
        super(2, false, undefined, );
    }


    execute(): void {
        this.execFunction();
    }
}




/**

The {@link Animation} a player will perform when thieving.
*/
const THIEVING_ANIMATION = new Animation(881);
/**

The {@link Graphic} a player will perform when being stunned.
*/
const STUNNED_GFX = new Graphic(254, GraphicHeight.HIGH);
/**

The {@link Animation} an npc will perform when attacking a pickpocket.
*/
const NPC_ATTACK_ANIMATION = new Animation(401);
/**

The {@link Animation} the player will perform when blocking an attacking
{@link NPC}.
*/
const PLAYER_BLOCK_ANIMATION = new Animation(404);
/**

Handles Pickpocketing.
*/
export default class Thieving extends ItemIdentifiers {
    /**
    
    Attempts to pickpocket an npc.
    */
    public static Pickpocketing = class {
        /**
        scss
        Copy code
         * Attempts to pickpocket an npc.
         *
         * @param player
         * @param npc
         * @return
         */
        public static init(player: Player, npc: NPC): boolean {
            const pickpocket: Pickpocketable = Pickpocketable.get(npc.getId());
            if (pickpocket) {
                if (this.hasRequirements(player, npc, Pickpocketable.get(npc.getId()))) {
                    // Stop movement..
                    player.getMovementQueue().reset();

                    // Start animation..
                    player.performAnimation(THIEVING_ANIMATION);

                    // Send message..
                    let name: string = npc.getCurrentDefinition().getName().toLowerCase();
                    if (!name.endsWith("s")) {
                        name += "'s";
                    }
                    player.getPacketSender().sendMessage(`You attempt to pick the ${name} pocket..`);

                    // Face npc..
                    player.setPositionToFace(npc.getLocation());

                    // Reset click delay..
                    player.getClickDelay().reset();

                    // Mark npc as immune for 5 seconds..
                    // This makes it so other players can't attack it.
                    npc.getTimers().registers(TimerKey.ATTACK_IMMUNITY, Misc.getTicks(5));


                    // Submit new task..
                    TaskManager.submit(new ThievingTask(() => {
                        if (this.isSuccessful(player, Pickpocketable.get(npc.getId()))) {
                            // Get the loot..
                            const loot: Item = Pickpocketable.get(npc.getId()).getRewards()[Misc.getRandom(Pickpocketable.get(npc.getId()).getRewards().length - 1)].clone();

                            // If we're pickpocketing the Master farmer and the required chance
                            // isn't hit, make sure to reward the default item.
                            // This is to make sure the other seeds remain semi-rare.
                            if (Pickpocketable.get(npc.getId()) === Pickpocketable.MASTER_FARMER) {
                                if (Misc.getRandom(100) > 18) {
                                    let loot = Pickpocketable.get(npc.getId()).getRewards()[0];
                                }

                                // Mix up loot amounts aswell for seeds..
                                if (loot.getAmount() > 1) {
                                    loot.setAmount(1 + Misc.getRandom(loot.getAmount()));
                                }
                            }

                            // Reward loot
                            if (!player.getInventory().isFull()) {
                                player.getInventory().addItem(loot);
                            }

                            // Send second item loot message..
                            let name: string = loot.getDefinition().getName().toLowerCase();
                            if (!name.endsWith("s") && loot.getAmount() > 1) {
                                name += "s";
                            }
                            player.getPacketSender().sendMessage(`You steal ${loot.getAmount() > 1 ? loot.getAmount().toString() : Misc.anOrA(name)} ${name}.`);

                            // Add experience..
                            player.getSkillManager().addExperiences(Skill.THIEVING, Math.floor(Pickpocketable.get(npc.getId()).getExp()));
                        } else {
                            // Make npc hit the player..
                            npc.setPositionToFace(player.getLocation());
                            npc.forceChat((Pickpocketable.get(npc.getId()) === Pickpocketable.MASTER_FARMER ? "Cor blimey, mate! What are ye doing in me pockets?" : "What do you think you're doing?"));
                            npc.performAnimation(NPC_ATTACK_ANIMATION);
                            player.getPacketSender().sendMessage("You fail to pick the pocket.");
                            CombatFactory.stun(player, Pickpocketable.get(npc.getId()).getStunTime(), true);
                            player.getCombat().getHitQueue().addPendingDamage([new HitDamage(Pickpocketable.get(npc.getId()).getStunDamage(), HitMask.RED)]);
                            player.getMovementQueue().reset();
                        }
                        // Add pet..
                        PetHandler.onSkill(player, Skill.THIEVING);

                    }, player));
                    return true;
                }
            }
        }
        /**
 * Checks if a player has the requirements to thieve the given
 * {@link Pickpocketable}.
 *
 * @param player
 * @param npc
 * @param pickpocketable
 * @return
 */
        private static hasRequirements(player: Player, npc: NPC, pickpocketable: Pickpocketable): boolean {
            // Make sure they aren't spam clicking..
            if (!player.getClickDelay().elapsedTime(1500)) {
                return false;
            }

            // Check thieving level..
            if (player.getSkillManager().getCurrentLevel(Skill.THIEVING) < pickpocketable.getLevel()) {
                // DialogueManager.sendStatement(player, "You need a Thieving level of at least " + Integer.toString(pickpocketable.getLevel()) + " to do this.");
                return false;
            }

            // Check stun..
            if (player.getTimers().has(TimerKey.STUN)) {
                return false;
            }

            // Make sure we aren't in combat..
            if (CombatFactory.inCombat(player)) {
                player.getPacketSender().sendMessage("You must wait a few seconds after being in combat to do this.");
                return false;
            }

            // Make sure they aren't in combat..
            if (CombatFactory.inCombat(npc)) {
                player.getPacketSender().sendMessage("That npc is currently in combat and cannot be pickpocketed.");
                return false;
            }

            // Make sure we have inventory space..
            if (player.getInventory().isFull()) {
                player.getInventory().full();
                return false;
            }

            return true;
        }
        /**
         * Determines the chance of failure. method.
         *
         * @param player The entity who is urging to reach for the pocket.
         * @return the result of chance.
         */
        private static isSuccessful(player: Player, p: Pickpocketable): boolean {
            let base = 4;
            if (p === Pickpocketable.FEMALE_HAM_MEMBER || p === Pickpocketable.MALE_HAM_MEMBER) {
                // TODO: Handle ham clothing bonus chance of success
            }
            let factor: number = Misc.getRandom(player.getSkillManager().getCurrentLevel(Skill.THIEVING) + base);
            let fluke: number = Misc.getRandom(p.getLevel());
            return factor > fluke;
        }
    }

}
export class Pickpocketable {

    public static readonly MAN_WOMAN = new Pickpocketable(1, 8, 5, 1, [new Item(ItemIdentifiers.COINS, 3)], [3014, 3015, 3078, 3079, 3080, 3081, 3082, 3083, 3084, 3085, 3267, 3268, 3260, 3264, 3265, 3266, 3267, 3268])
    public static readonly FARMER = new Pickpocketable(10, 15, 5, 1, [new Item(ItemIdentifiers.COINS, 9), new Item(ItemIdentifiers.POTATO_SEED)], [3086, 3087, 3088, 3089, 3090, 3091])
    public static readonly FEMALE_HAM_MEMBER = new Pickpocketable(15, 19, 4, 3, [new Item(ItemIdentifiers.BUTTONS), new Item(ItemIdentifiers.RUSTY_SWORD), new Item(ItemIdentifiers.DAMAGED_ARMOUR), new Item(ItemIdentifiers.FEATHER, 5), new Item(ItemIdentifiers.BRONZE_ARROW), new Item(ItemIdentifiers.BRONZE_AXE), new Item(ItemIdentifiers.BRONZE_DAGGER), new Item(ItemIdentifiers.BRONZE_PICKAXE), new Item(ItemIdentifiers.COWHIDE), new Item(ItemIdentifiers.IRON_AXE), new Item(ItemIdentifiers.IRON_PICKAXE), new Item(ItemIdentifiers.LEATHER_BOOTS), new Item(ItemIdentifiers.LEATHER_GLOVES), new Item(ItemIdentifiers.LEATHER_BODY), new Item(ItemIdentifiers.LOGS), new Item(ItemIdentifiers.THREAD), new Item(ItemIdentifiers.RAW_ANCHOVIES), new Item(ItemIdentifiers.LOGS), new Item(ItemIdentifiers.RAW_CHICKEN), new Item(ItemIdentifiers.IRON_ORE), new Item(ItemIdentifiers.COAL), new Item(ItemIdentifiers.STEEL_ARROW, 2), new Item(ItemIdentifiers.STEEL_AXE), new Item(ItemIdentifiers.STEEL_PICKAXE), new Item(ItemIdentifiers.KNIFE), new Item(ItemIdentifiers.NEEDLE), new Item(ItemIdentifiers.STEEL_DAGGER), new Item(ItemIdentifiers.TINDERBOX), new Item(ItemIdentifiers.UNCUT_JADE), new Item(ItemIdentifiers.UNCUT_OPAL), new Item(ItemIdentifiers.COINS, 25), new Item(ItemIdentifiers.HAM_GLOVES), new Item(ItemIdentifiers.HAM_CLOAK), new Item(ItemIdentifiers.HAM_BOOTS), new Item(ItemIdentifiers.HAM_SHIRT), new Item(ItemIdentifiers.HAM_ROBE), new Item(ItemIdentifiers.HAM_LOGO), new Item(ItemIdentifiers.HAM_HOOD), new Item(ItemIdentifiers.GRIMY_GUAM_LEAF), new Item(ItemIdentifiers.GRIMY_MARRENTILL), new Item(ItemIdentifiers.GRIMY_TARROMIN), new Item(ItemIdentifiers.GRIMY_HARRALANDER)], [2540, 2541])
    public static readonly MALE_HAM_MEMBER = new Pickpocketable(20, 23, 4, 3, [new Item(ItemIdentifiers.BUTTONS), new Item(ItemIdentifiers.RUSTY_SWORD), new Item(ItemIdentifiers.DAMAGED_ARMOUR), new Item(ItemIdentifiers.FEATHER, 5), new Item(ItemIdentifiers.BRONZE_ARROW), new Item(ItemIdentifiers.BRONZE_AXE), new Item(ItemIdentifiers.BRONZE_DAGGER), new Item(ItemIdentifiers.BRONZE_PICKAXE), new Item(ItemIdentifiers.COWHIDE), new Item(ItemIdentifiers.IRON_AXE), new Item(ItemIdentifiers.IRON_PICKAXE), new Item(ItemIdentifiers.LEATHER_BOOTS), new Item(ItemIdentifiers.LEATHER_GLOVES), new Item(ItemIdentifiers.LEATHER_BODY), new Item(ItemIdentifiers.LOGS), new Item(ItemIdentifiers.THREAD), new Item(ItemIdentifiers.RAW_ANCHOVIES), new Item(ItemIdentifiers.LOGS), new Item(ItemIdentifiers.RAW_CHICKEN), new Item(ItemIdentifiers.IRON_ORE), new Item(ItemIdentifiers.COAL), new Item(ItemIdentifiers.STEEL_ARROW, 2), new Item(ItemIdentifiers.STEEL_AXE), new Item(ItemIdentifiers.STEEL_PICKAXE), new Item(ItemIdentifiers.KNIFE), new Item(ItemIdentifiers.NEEDLE), new Item(ItemIdentifiers.STEEL_DAGGER), new Item(ItemIdentifiers.TINDERBOX), new Item(ItemIdentifiers.UNCUT_JADE), new Item(ItemIdentifiers.UNCUT_OPAL), new Item(ItemIdentifiers.COINS, 25), new Item(ItemIdentifiers.HAM_GLOVES), new Item(ItemIdentifiers.HAM_CLOAK), new Item(ItemIdentifiers.HAM_BOOTS), new Item(ItemIdentifiers.HAM_SHIRT), new Item(ItemIdentifiers.HAM_ROBE), new Item(ItemIdentifiers.HAM_LOGO), new Item(ItemIdentifiers.HAM_HOOD), new Item(ItemIdentifiers.GRIMY_GUAM_LEAF), new Item(ItemIdentifiers.GRIMY_MARRENTILL), new Item(ItemIdentifiers.GRIMY_TARROMIN), new Item(ItemIdentifiers.GRIMY_HARRALANDER)])
    public static readonly AL_KHARID_WARRIOR = new Pickpocketable(25, 26, 5, 2, [new Item(ItemIdentifiers.COINS, 18)], [3100])
    public static readonly ROGUE = new Pickpocketable(32, 36, 5, 2, [new Item(ItemIdentifiers.COINS, 34), new Item(ItemIdentifiers.LOCKPICK), new Item(ItemIdentifiers.IRON_DAGGER_P_), new Item(ItemIdentifiers.JUG_OF_WINE), new Item(ItemIdentifiers.AIR_RUNE, 8)], [2884])
    public static readonly CAVE_GOBLIN = new Pickpocketable(36, 40, 5, 1, [new Item(ItemIdentifiers.COINS, 10), new Item(ItemIdentifiers.IRON_ORE), new Item(ItemIdentifiers.TINDERBOX), new Item(ItemIdentifiers.SWAMP_TAR), new Item(ItemIdentifiers.OIL_LANTERN), new Item(ItemIdentifiers.TORCH), new Item(ItemIdentifiers.GREEN_GLOOP_SOUP), new Item(ItemIdentifiers.FROGSPAWN_GUMBO), new Item(ItemIdentifiers.FROGBURGER), new Item(ItemIdentifiers.COATED_FROGS_LEGS), new Item(ItemIdentifiers.BAT_SHISH), new Item(ItemIdentifiers.FINGERS), new Item(ItemIdentifiers.BULLSEYE_LANTERN), new Item(ItemIdentifiers.CAVE_GOBLIN_WIRE)], [2268, 2269, 2270, 2271, 2272, 2273, 2274, 2275, 2276, 2277, 2278, 2279, 2280, 2281, 2282, 2283, 2284, 2285])
    public static readonly MASTER_FARMER = new Pickpocketable(38, 43, 5, 3, [new Item(ItemIdentifiers.POTATO_SEED, 12), new Item(ItemIdentifiers.ONION_SEED, 8), new Item(ItemIdentifiers.CABBAGE_SEED, 5), new Item(ItemIdentifiers.TOMATO_SEED, 4), new Item(ItemIdentifiers.HAMMERSTONE_SEED, 4), new Item(ItemIdentifiers.BARLEY_SEED, 4), new Item(ItemIdentifiers.MARIGOLD_SEED, 4), new Item(ItemIdentifiers.ASGARNIAN_SEED, 4), new Item(ItemIdentifiers.JUTE_SEED, 4), new Item(ItemIdentifiers.REDBERRY_SEED, 4), new Item(ItemIdentifiers.NASTURTIUM_SEED, 4), new Item(ItemIdentifiers.YANILLIAN_SEED, 4), new Item(ItemIdentifiers.CADAVABERRY_SEED, 4), new Item(ItemIdentifiers.SWEETCORN_SEED, 4), new Item(ItemIdentifiers.ROSEMARY_SEED, 4), new Item(ItemIdentifiers.DWELLBERRY_SEED, 3), new Item(ItemIdentifiers.GUAM_SEED, 3), new Item(ItemIdentifiers.WOAD_SEED, 3), new Item(ItemIdentifiers.KRANDORIAN_SEED, 3), new Item(ItemIdentifiers.STRAWBERRY_SEED, 3), new Item(ItemIdentifiers.LIMPWURT_SEED, 3), new Item(ItemIdentifiers.MARRENTILL_SEED, 3), new Item(ItemIdentifiers.JANGERBERRY_SEED, 3), new Item(ItemIdentifiers.TARROMIN_SEED, 2), new Item(ItemIdentifiers.WILDBLOOD_SEED, 2), new Item(ItemIdentifiers.WATERMELON_SEED, 2), new Item(ItemIdentifiers.HARRALANDER_SEED, 2), new Item(ItemIdentifiers.RANARR_SEED, 1), new Item(ItemIdentifiers.WHITEBERRY_SEED, 2), new Item(ItemIdentifiers.TOADFLAX_SEED, 2), new Item(ItemIdentifiers.MUSHROOM_SPORE, 2), new Item(ItemIdentifiers.IRIT_SEED, 2), new Item(ItemIdentifiers.BELLADONNA_SEED, 2), new Item(ItemIdentifiers.POISON_IVY_SEED, 2), new Item(ItemIdentifiers.AVANTOE_SEED, 1), new Item(ItemIdentifiers.CACTUS_SEED, 1), new Item(ItemIdentifiers.KWUARM_SEED, 1), new Item(ItemIdentifiers.SNAPDRAGON_SEED, 1), new Item(ItemIdentifiers.CADANTINE_SEED, 1), new Item(ItemIdentifiers.LANTADYME_SEED, 1), new Item(ItemIdentifiers.DWARF_WEED_SEED, 1), new Item(ItemIdentifiers.TORSTOL_SEED, 1),], [3257, 3258, 5832])
    public static readonly GUARD = new Pickpocketable(40, 47, 5, 2, [new Item(ItemIdentifiers.COINS, 30)], [1546, 1547, 1548, 1549, 1550, 3010, 3011, 3094, 3245, 3267, 3268, 3269, 3270, 3271, 3272, 3273, 3274, 3283])
    public static readonly FREMENNIK_CITIZEN = new Pickpocketable(45, 65, 5, 2, [new Item(ItemIdentifiers.COINS, 40)], [2462])
    public static readonly BEARDED_POLLNIVNIAN_BANDIT = new Pickpocketable(45, 65, 5, 5, [new Item(ItemIdentifiers.COINS, 40)], [1880])
    public static readonly YANILLE_WATCHMAN = new Pickpocketable(65, 137, 5, 3, [new Item(ItemIdentifiers.COINS, 60), new Item(ItemIdentifiers.BREAD)], [3251])
    public static readonly MENAPHITE_THUG = new Pickpocketable(65, 137, 5, 5, [new Item(ItemIdentifiers.COINS, 60)], [3549, 3550])
    public static readonly PALADIN = new Pickpocketable(70, 152, 5, 3, [new Item(ItemIdentifiers.COINS, 80), new Item(ItemIdentifiers.CHAOS_RUNE, 2)], [3104, 3105])
    public static readonly GNOME = new Pickpocketable(75, 199, 5, 1, [new Item(ItemIdentifiers.COINS, 300), new Item(ItemIdentifiers.EARTH_RUNE), new Item(ItemIdentifiers.GOLD_ORE), new Item(ItemIdentifiers.FIRE_ORB), new Item(ItemIdentifiers.SWAMP_TOAD), new Item(ItemIdentifiers.KING_WORM)], [6086, 6087, 6094, 6095, 6096])






    constructor(level: number, exp: number, stunTime: number, stunDamage: number, rewards: Item[], npcs?: number[]) {
        level = level;
        exp = exp;
        stunTime = stunTime;
        stunDamage = stunDamage;
        rewards = rewards;
        npcs = npcs;
    }

    public static get(npcId: number): Pickpocketable {
        return Pickpocketable.pickpockets.get(npcId);
    }

    public getLevel(): number {
        return Pickpocketable.level;
    }

    public getExp(): number {
        return Pickpocketable.exp;
    }

    public getStunTime(): number {
        return Pickpocketable.stunTime;
    }

    public getStunDamage(): number {
        return Pickpocketable.stunDamage;
    }

    public getRewards(): Item[] {
        return Pickpocketable.rewards;
    }

    public getNpcs(): number[] {
        return Pickpocketable.npcs;
    }


    static {
        for (const p of Object.values(Pickpocketable)) {
            for (const i of p.getNpcs()) {
                Pickpocketable.pickpockets.set(i, p);
            }
        }

    }

    private static level: number;
    private static exp: number;
    private static stunTime: number;
    private static stunDamage: number;
    private static rewards: Item[];
    private static npcs: number[];
    private static pickpockets: Map<number, Pickpocketable> = new Map<number, Pickpocketable>();
}

export class StallThieving {
    /**
 * Checks if we're attempting to steal from a stall based on the clicked object.
 *
 * @param player
 * @param object
 * @return
 */
    public static init(player: Player, object: GameObject): boolean {
        const stall = Stall.get(object.getId());
        if (stall) {

            // Make sure we have the required thieving level..
            if (player.getSkillManager().getCurrentLevel(Skill.THIEVING) >= Stall.get(object.getId()).getReqLevel()) {

                // Make sure we aren't spam clicking..
                if (player.getClickDelay().elapsedTime(1000)) {

                    // Reset click delay..
                    player.getClickDelay().reset();

                    // Face stall..
                    player.setPositionToFace(object.getLocation());

                    // Perform animation..
                    player.performAnimation(THIEVING_ANIMATION);

                    // Add items..
                    const item = Stall.get(object.getId()).getRewards()[Misc.getRandom(Stall.get(object.getId()).getRewards().length - 1)];
                    player.getInventory().adds(item.getId(),
                        item.getAmount() > 1 ? Misc.getRandom(item.getAmount()) : 1);


                    // Add pet..
                    PetHandler.onSkill(player, Skill.THIEVING);

                    // Respawn stall..
                    for (const stallDef of Stall.get(object.getId()).getStalls()) {
                        if (stallDef.getObjectId() == object.getId()) {
                            const replacementId = stallDef.getReplacement();
                            if (replacementId) {
                                TaskManager.submit(new TimedObjectReplacementTask(object,
                                    new GameObject(replacementId, object.getLocation(),
                                        object.getType(), object.getFace(), player.getPrivateArea()),
                                    Stall.get(object.getId()).getRespawnTicks()));
                            }


                            break;
                        }


                    }
                }
            } else {
                //DialogueManager.sendStatement(player, "You need a Thieving level of at least "
                //		+ Integer.toString(stall.get().getReqLevel()) + " to do this.");
            }
            return true;
        }
        return false;
    }

}

export class StallDefinition {
    /**
     * The stall's object id.
     */
    private readonly objectId: number;

    /**
     * The replacement object for when this stall temporarily despawns.
     */
    private readonly replacement: number;

    constructor(objectId: number, replacement: number) {
        this.objectId = objectId;
        this.replacement = replacement;
    }

    public getObjectId(): number {
        return this.objectId;
    }

    public getReplacement(): number {
        return this.replacement;
    }
}

export class Stall {

    /**
         * Represents a stall which can be stolen from using the Thieving skill.
         *
         * @author Professor Oak
         */
    public static readonly BAKERS_STALL = new Stall([new StallDefinition(11730, 634)], 5, 16, 3, [new Item(ItemIdentifiers.CAKE), new Item(ItemIdentifiers.CHOCOLATE_SLICE), new Item(ItemIdentifiers.BREAD)])
    public static readonly CRAFTING_STALL = new Stall([new StallDefinition(4874, null), new StallDefinition(6166, null)], 5, 16, 12, [new Item(ItemIdentifiers.CHISEL), new Item(ItemIdentifiers.RING_MOULD), new Item(ItemIdentifiers.NECKLACE_MOULD)])
    public static readonly MONKEY_STALL = new Stall([new StallDefinition(4875, null)], 5, 16, 12, [new Item(ItemIdentifiers.BANANA)])
    public static readonly MONKEY_GENERAL_STALL = new Stall([new StallDefinition(4876, null)], 5, 16, 12, [new Item(ItemIdentifiers.POT), new Item(ItemIdentifiers.TINDERBOX), new Item(ItemIdentifiers.HAMMER)])
    public static readonly TEA_STALL = new Stall([new StallDefinition(635, 634), new StallDefinition(6574, 6573), new StallDefinition(20350, 20349)], 5, 16, 12, [new Item(ItemIdentifiers.CUP_OF_TEA)])
    public static readonly SILK_STALL = new Stall([new StallDefinition(11729, 634)], 20, 24, 8, [new Item(ItemIdentifiers.SILK)])
    public static readonly WINE_STALL = new Stall([new StallDefinition(14011, 634)], 22, 27, 27, [new Item(ItemIdentifiers.JUG_OF_WATER), new Item(ItemIdentifiers.JUG_OF_WINE), new Item(ItemIdentifiers.GRAPES), new Item(ItemIdentifiers.EMPTY_JUG), new Item(ItemIdentifiers.BOTTLE_OF_WINE)])
    public static readonly SEED_STALL = new Stall([new StallDefinition(7053, 634),], 27, 10, 30, [new Item(ItemIdentifiers.POTATO_SEED, 12), new Item(ItemIdentifiers.ONION_SEED, 11), new Item(ItemIdentifiers.CABBAGE_SEED, 10), new Item(ItemIdentifiers.TOMATO_SEED, 9), new Item(ItemIdentifiers.SWEETCORN_SEED, 7), new Item(ItemIdentifiers.STRAWBERRY_SEED, 5), new Item(ItemIdentifiers.WATERMELON_SEED, 3), new Item(ItemIdentifiers.BARLEY_SEED, 5), new Item(ItemIdentifiers.HAMMERSTONE_SEED, 5), new Item(ItemIdentifiers.ASGARNIAN_SEED, 5), new Item(ItemIdentifiers.JUTE_SEED, 5), new Item(ItemIdentifiers.YANILLIAN_SEED, 5), new Item(ItemIdentifiers.KRANDORIAN_SEED, 5), new Item(ItemIdentifiers.WILDBLOOD_SEED, 3), new Item(ItemIdentifiers.MARIGOLD_SEED, 4), new Item(ItemIdentifiers.ROSEMARY_SEED, 4), new Item(ItemIdentifiers.NASTURTIUM_SEED, 4)])
    public static readonly FUR_STALL = new Stall([new StallDefinition(11732, 634), new StallDefinition(4278, 634)], 35, 36, 17, [new Item(ItemIdentifiers.GREY_WOLF_FUR)])
    public static readonly FISH_STALL = new Stall([new StallDefinition(4277, 4276), new StallDefinition(4707, 4276), new StallDefinition(4705, 4276)], 42, 42, 17, [new Item(ItemIdentifiers.RAW_SALMON), new Item(ItemIdentifiers.RAW_TUNA)])
    public static readonly CROSSBOW_STALL = new Stall([new StallDefinition(17031, 6984)], 49, 52, 15, [new Item(ItemIdentifiers.BRONZE_BOLTS, 6), new Item(ItemIdentifiers.BRONZE_LIMBS), new Item(ItemIdentifiers.WOODEN_STOCK)])
    public static readonly SILVER_STALL = new Stall([new StallDefinition(11734, 634), new StallDefinition(6164, 6984),], 50, 54, 50, [new Item(ItemIdentifiers.SILVER_ORE)])
    public static readonly SPICE_STALL = new Stall([new StallDefinition(11733, 634), new StallDefinition(6572, 6573), new StallDefinition(20348, 20349)], 65, 81, 133, [new Item(ItemIdentifiers.SPICE)])
    public static readonly MAGIC_STALL = new Stall([new StallDefinition(4877, null),], 65, 100, 133, [new Item(ItemIdentifiers.AIR_RUNE, 20), new Item(ItemIdentifiers.WATER_RUNE, 20), new Item(ItemIdentifiers.EARTH_RUNE, 20), new Item(ItemIdentifiers.FIRE_RUNE, 20), new Item(ItemIdentifiers.LAW_RUNE, 6)])
    public static readonly SCIMITAR_STALL = new Stall([new StallDefinition(4878, null)], 65, 100, 133, [new Item(ItemIdentifiers.IRON_SCIMITAR)])
    public static readonly GEM_STALL = new Stall([new StallDefinition(11731, 634), new StallDefinition(6162, 6984),], 75, 160, 133, [new Item(ItemIdentifiers.UNCUT_SAPPHIRE), new Item(ItemIdentifiers.UNCUT_EMERALD), new Item(ItemIdentifiers.UNCUT_RUBY), new Item(ItemIdentifiers.UNCUT_DIAMOND)])


    constructor(stalls: StallDefinition[], reqLevel: number, exp: number, respawnTicks: number, rewards: Item[]) {
        this.stalls = stalls;
        this.reqLevel = reqLevel;
        this.exp = exp;
        this.respawnTicks = respawnTicks;
        this.rewards = rewards;
    }

    public static get(objectId: number): Stall {
        return Stall.map.get(objectId);
    }

    public getStalls(): StallDefinition[] {
        return this.stalls;
    }

    public getReqLevel(): number {
        return this.reqLevel;
    }

    public getExp(): number {
        return this.exp;
    }

    public getRespawnTicks(): number {
        return this.respawnTicks;
    }

    public getRewards(): Item[] {
        return this.rewards;
    }


    private static map: Map<number, Stall> = new Map<number, Stall>();

    static {
        for (const stall of Object.values(Stall)) {
            for (const def of stall.getStalls()) {
                Stall.map.set(def.getObjectId(), stall);
            }
        }
    }

    private stalls: StallDefinition[];
    private reqLevel: number;
    private exp: number;
    private respawnTicks: number;
    private rewards: Item[];

}