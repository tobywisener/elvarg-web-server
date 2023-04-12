"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stall = exports.StallDefinition = exports.StallThieving = exports.Pickpocketable = void 0;
var PetHandler_1 = require("../../../PetHandler");
var CombatFactory_1 = require("../../../combat/CombatFactory");
var HitDamage_1 = require("../../../combat/hit/HitDamage");
var HitMask_1 = require("../../../combat/hit/HitMask");
var GameObject_1 = require("../../../../entity/impl/object/GameObject");
var Animation_1 = require("../../../../model/Animation");
var Graphic_1 = require("../../../../model/Graphic");
var GraphicHeight_1 = require("../../../../model/GraphicHeight");
var Item_1 = require("../../../../model/Item");
var Skill_1 = require("../../../../model/Skill");
var Task_1 = require("../../../../task/Task");
var TaskManager_1 = require("../../../../task/TaskManager");
var TimedObjectReplacementTask_1 = require("../../../../task/impl/TimedObjectReplacementTask");
var ItemIdentifiers_1 = require("../../../../../util/ItemIdentifiers");
var Misc_1 = require("../../../../../util/Misc");
var TimerKey_1 = require("../../../../../util/timers/TimerKey");
var ThievingTask = /** @class */ (function (_super) {
    __extends(ThievingTask, _super);
    function ThievingTask(execFunction, player) {
        var _this = _super.call(this, 2, false, undefined) || this;
        _this.execFunction = execFunction;
        return _this;
    }
    ThievingTask.prototype.execute = function () {
        this.execFunction();
    };
    return ThievingTask;
}(Task_1.Task));
/**

The {@link Animation} a player will perform when thieving.
*/
var THIEVING_ANIMATION = new Animation_1.Animation(881);
/**

The {@link Graphic} a player will perform when being stunned.
*/
var STUNNED_GFX = new Graphic_1.Graphic(254, GraphicHeight_1.GraphicHeight.HIGH);
/**

The {@link Animation} an npc will perform when attacking a pickpocket.
*/
var NPC_ATTACK_ANIMATION = new Animation_1.Animation(401);
/**

The {@link Animation} the player will perform when blocking an attacking
{@link NPC}.
*/
var PLAYER_BLOCK_ANIMATION = new Animation_1.Animation(404);
/**

Handles Pickpocketing.
*/
var Thieving = /** @class */ (function (_super) {
    __extends(Thieving, _super);
    function Thieving() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
    
    Attempts to pickpocket an npc.
    */
    Thieving.Pickpocketing = /** @class */ (function () {
        function class_1() {
        }
        /**
        scss
        Copy code
         * Attempts to pickpocket an npc.
         *
         * @param player
         * @param npc
         * @return
         */
        class_1.init = function (player, npc) {
            var _this = this;
            var pickpocket = Pickpocketable.get(npc.getId());
            if (pickpocket) {
                if (this.hasRequirements(player, npc, Pickpocketable.get(npc.getId()))) {
                    // Stop movement..
                    player.getMovementQueue().reset();
                    // Start animation..
                    player.performAnimation(THIEVING_ANIMATION);
                    // Send message..
                    var name_1 = npc.getCurrentDefinition().getName().toLowerCase();
                    if (!name_1.endsWith("s")) {
                        name_1 += "'s";
                    }
                    player.getPacketSender().sendMessage("You attempt to pick the ".concat(name_1, " pocket.."));
                    // Face npc..
                    player.setPositionToFace(npc.getLocation());
                    // Reset click delay..
                    player.getClickDelay().reset();
                    // Mark npc as immune for 5 seconds..
                    // This makes it so other players can't attack it.
                    npc.getTimers().registers(TimerKey_1.TimerKey.ATTACK_IMMUNITY, Misc_1.Misc.getTicks(5));
                    // Submit new task..
                    TaskManager_1.TaskManager.submit(new ThievingTask(function () {
                        if (_this.isSuccessful(player, Pickpocketable.get(npc.getId()))) {
                            // Get the loot..
                            var loot = Pickpocketable.get(npc.getId()).getRewards()[Misc_1.Misc.getRandom(Pickpocketable.get(npc.getId()).getRewards().length - 1)].clone();
                            // If we're pickpocketing the Master farmer and the required chance
                            // isn't hit, make sure to reward the default item.
                            // This is to make sure the other seeds remain semi-rare.
                            if (Pickpocketable.get(npc.getId()) === Pickpocketable.MASTER_FARMER) {
                                if (Misc_1.Misc.getRandom(100) > 18) {
                                    var loot_1 = Pickpocketable.get(npc.getId()).getRewards()[0];
                                }
                                // Mix up loot amounts aswell for seeds..
                                if (loot.getAmount() > 1) {
                                    loot.setAmount(1 + Misc_1.Misc.getRandom(loot.getAmount()));
                                }
                            }
                            // Reward loot
                            if (!player.getInventory().isFull()) {
                                player.getInventory().addItem(loot);
                            }
                            // Send second item loot message..
                            var name_2 = loot.getDefinition().getName().toLowerCase();
                            if (!name_2.endsWith("s") && loot.getAmount() > 1) {
                                name_2 += "s";
                            }
                            player.getPacketSender().sendMessage("You steal ".concat(loot.getAmount() > 1 ? loot.getAmount().toString() : Misc_1.Misc.anOrA(name_2), " ").concat(name_2, "."));
                            // Add experience..
                            player.getSkillManager().addExperiences(Skill_1.Skill.THIEVING, Math.floor(Pickpocketable.get(npc.getId()).getExp()));
                        }
                        else {
                            // Make npc hit the player..
                            npc.setPositionToFace(player.getLocation());
                            npc.forceChat((Pickpocketable.get(npc.getId()) === Pickpocketable.MASTER_FARMER ? "Cor blimey, mate! What are ye doing in me pockets?" : "What do you think you're doing?"));
                            npc.performAnimation(NPC_ATTACK_ANIMATION);
                            player.getPacketSender().sendMessage("You fail to pick the pocket.");
                            CombatFactory_1.CombatFactory.stun(player, Pickpocketable.get(npc.getId()).getStunTime(), true);
                            player.getCombat().getHitQueue().addPendingDamage([new HitDamage_1.HitDamage(Pickpocketable.get(npc.getId()).getStunDamage(), HitMask_1.HitMask.RED)]);
                            player.getMovementQueue().reset();
                        }
                        // Add pet..
                        PetHandler_1.PetHandler.onSkill(player, Skill_1.Skill.THIEVING);
                    }, player));
                    return true;
                }
            }
        };
        /**
 * Checks if a player has the requirements to thieve the given
 * {@link Pickpocketable}.
 *
 * @param player
 * @param npc
 * @param pickpocketable
 * @return
 */
        class_1.hasRequirements = function (player, npc, pickpocketable) {
            // Make sure they aren't spam clicking..
            if (!player.getClickDelay().elapsedTime(1500)) {
                return false;
            }
            // Check thieving level..
            if (player.getSkillManager().getCurrentLevel(Skill_1.Skill.THIEVING) < pickpocketable.getLevel()) {
                // DialogueManager.sendStatement(player, "You need a Thieving level of at least " + Integer.toString(pickpocketable.getLevel()) + " to do this.");
                return false;
            }
            // Check stun..
            if (player.getTimers().has(TimerKey_1.TimerKey.STUN)) {
                return false;
            }
            // Make sure we aren't in combat..
            if (CombatFactory_1.CombatFactory.inCombat(player)) {
                player.getPacketSender().sendMessage("You must wait a few seconds after being in combat to do this.");
                return false;
            }
            // Make sure they aren't in combat..
            if (CombatFactory_1.CombatFactory.inCombat(npc)) {
                player.getPacketSender().sendMessage("That npc is currently in combat and cannot be pickpocketed.");
                return false;
            }
            // Make sure we have inventory space..
            if (player.getInventory().isFull()) {
                player.getInventory().full();
                return false;
            }
            return true;
        };
        /**
         * Determines the chance of failure. method.
         *
         * @param player The entity who is urging to reach for the pocket.
         * @return the result of chance.
         */
        class_1.isSuccessful = function (player, p) {
            var base = 4;
            if (p === Pickpocketable.FEMALE_HAM_MEMBER || p === Pickpocketable.MALE_HAM_MEMBER) {
                // TODO: Handle ham clothing bonus chance of success
            }
            var factor = Misc_1.Misc.getRandom(player.getSkillManager().getCurrentLevel(Skill_1.Skill.THIEVING) + base);
            var fluke = Misc_1.Misc.getRandom(p.getLevel());
            return factor > fluke;
        };
        return class_1;
    }());
    return Thieving;
}(ItemIdentifiers_1.ItemIdentifiers));
exports.default = Thieving;
var Pickpocketable = exports.Pickpocketable = /** @class */ (function () {
    function Pickpocketable(level, exp, stunTime, stunDamage, rewards, npcs) {
        level = level;
        exp = exp;
        stunTime = stunTime;
        stunDamage = stunDamage;
        rewards = rewards;
        npcs = npcs;
    }
    Pickpocketable.get = function (npcId) {
        return Pickpocketable.pickpockets.get(npcId);
    };
    Pickpocketable.prototype.getLevel = function () {
        return Pickpocketable.level;
    };
    Pickpocketable.prototype.getExp = function () {
        return Pickpocketable.exp;
    };
    Pickpocketable.prototype.getStunTime = function () {
        return Pickpocketable.stunTime;
    };
    Pickpocketable.prototype.getStunDamage = function () {
        return Pickpocketable.stunDamage;
    };
    Pickpocketable.prototype.getRewards = function () {
        return Pickpocketable.rewards;
    };
    Pickpocketable.prototype.getNpcs = function () {
        return Pickpocketable.npcs;
    };
    Pickpocketable.MAN_WOMAN = new Pickpocketable(1, 8, 5, 1, [new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COINS, 3)], [3014, 3015, 3078, 3079, 3080, 3081, 3082, 3083, 3084, 3085, 3267, 3268, 3260, 3264, 3265, 3266, 3267, 3268]);
    Pickpocketable.FARMER = new Pickpocketable(10, 15, 5, 1, [new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COINS, 9), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.POTATO_SEED)], [3086, 3087, 3088, 3089, 3090, 3091]);
    Pickpocketable.FEMALE_HAM_MEMBER = new Pickpocketable(15, 19, 4, 3, [new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.BUTTONS), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.RUSTY_SWORD), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.DAMAGED_ARMOUR), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.FEATHER, 5), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.BRONZE_ARROW), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.BRONZE_AXE), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.BRONZE_DAGGER), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.BRONZE_PICKAXE), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COWHIDE), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.IRON_AXE), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.IRON_PICKAXE), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.LEATHER_BOOTS), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.LEATHER_GLOVES), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.LEATHER_BODY), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.LOGS), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.THREAD), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.RAW_ANCHOVIES), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.LOGS), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.RAW_CHICKEN), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.IRON_ORE), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COAL), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.STEEL_ARROW, 2), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.STEEL_AXE), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.STEEL_PICKAXE), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.KNIFE), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.NEEDLE), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.STEEL_DAGGER), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.TINDERBOX), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.UNCUT_JADE), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.UNCUT_OPAL), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COINS, 25), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.HAM_GLOVES), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.HAM_CLOAK), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.HAM_BOOTS), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.HAM_SHIRT), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.HAM_ROBE), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.HAM_LOGO), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.HAM_HOOD), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.GRIMY_GUAM_LEAF), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.GRIMY_MARRENTILL), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.GRIMY_TARROMIN), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.GRIMY_HARRALANDER)], [2540, 2541]);
    Pickpocketable.MALE_HAM_MEMBER = new Pickpocketable(20, 23, 4, 3, [new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.BUTTONS), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.RUSTY_SWORD), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.DAMAGED_ARMOUR), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.FEATHER, 5), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.BRONZE_ARROW), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.BRONZE_AXE), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.BRONZE_DAGGER), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.BRONZE_PICKAXE), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COWHIDE), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.IRON_AXE), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.IRON_PICKAXE), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.LEATHER_BOOTS), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.LEATHER_GLOVES), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.LEATHER_BODY), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.LOGS), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.THREAD), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.RAW_ANCHOVIES), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.LOGS), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.RAW_CHICKEN), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.IRON_ORE), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COAL), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.STEEL_ARROW, 2), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.STEEL_AXE), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.STEEL_PICKAXE), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.KNIFE), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.NEEDLE), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.STEEL_DAGGER), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.TINDERBOX), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.UNCUT_JADE), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.UNCUT_OPAL), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COINS, 25), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.HAM_GLOVES), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.HAM_CLOAK), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.HAM_BOOTS), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.HAM_SHIRT), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.HAM_ROBE), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.HAM_LOGO), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.HAM_HOOD), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.GRIMY_GUAM_LEAF), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.GRIMY_MARRENTILL), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.GRIMY_TARROMIN), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.GRIMY_HARRALANDER)]);
    Pickpocketable.AL_KHARID_WARRIOR = new Pickpocketable(25, 26, 5, 2, [new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COINS, 18)], [3100]);
    Pickpocketable.ROGUE = new Pickpocketable(32, 36, 5, 2, [new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COINS, 34), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.LOCKPICK), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.IRON_DAGGER_P_), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.JUG_OF_WINE), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.AIR_RUNE, 8)], [2884]);
    Pickpocketable.CAVE_GOBLIN = new Pickpocketable(36, 40, 5, 1, [new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COINS, 10), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.IRON_ORE), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.TINDERBOX), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SWAMP_TAR), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.OIL_LANTERN), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.TORCH), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.GREEN_GLOOP_SOUP), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.FROGSPAWN_GUMBO), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.FROGBURGER), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COATED_FROGS_LEGS), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.BAT_SHISH), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.FINGERS), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.BULLSEYE_LANTERN), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.CAVE_GOBLIN_WIRE)], [2268, 2269, 2270, 2271, 2272, 2273, 2274, 2275, 2276, 2277, 2278, 2279, 2280, 2281, 2282, 2283, 2284, 2285]);
    Pickpocketable.MASTER_FARMER = new Pickpocketable(38, 43, 5, 3, [new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.POTATO_SEED, 12), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.ONION_SEED, 8), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.CABBAGE_SEED, 5), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.TOMATO_SEED, 4), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.HAMMERSTONE_SEED, 4), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.BARLEY_SEED, 4), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MARIGOLD_SEED, 4), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.ASGARNIAN_SEED, 4), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.JUTE_SEED, 4), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.REDBERRY_SEED, 4), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.NASTURTIUM_SEED, 4), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.YANILLIAN_SEED, 4), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.CADAVABERRY_SEED, 4), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SWEETCORN_SEED, 4), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.ROSEMARY_SEED, 4), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.DWELLBERRY_SEED, 3), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.GUAM_SEED, 3), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.WOAD_SEED, 3), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.KRANDORIAN_SEED, 3), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.STRAWBERRY_SEED, 3), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.LIMPWURT_SEED, 3), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MARRENTILL_SEED, 3), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.JANGERBERRY_SEED, 3), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.TARROMIN_SEED, 2), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.WILDBLOOD_SEED, 2), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.WATERMELON_SEED, 2), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.HARRALANDER_SEED, 2), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.RANARR_SEED, 1), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.WHITEBERRY_SEED, 2), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.TOADFLAX_SEED, 2), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MUSHROOM_SPORE, 2), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.IRIT_SEED, 2), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.BELLADONNA_SEED, 2), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.POISON_IVY_SEED, 2), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.AVANTOE_SEED, 1), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.CACTUS_SEED, 1), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.KWUARM_SEED, 1), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SNAPDRAGON_SEED, 1), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.CADANTINE_SEED, 1), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.LANTADYME_SEED, 1), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.DWARF_WEED_SEED, 1), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.TORSTOL_SEED, 1),], [3257, 3258, 5832]);
    Pickpocketable.GUARD = new Pickpocketable(40, 47, 5, 2, [new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COINS, 30)], [1546, 1547, 1548, 1549, 1550, 3010, 3011, 3094, 3245, 3267, 3268, 3269, 3270, 3271, 3272, 3273, 3274, 3283]);
    Pickpocketable.FREMENNIK_CITIZEN = new Pickpocketable(45, 65, 5, 2, [new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COINS, 40)], [2462]);
    Pickpocketable.BEARDED_POLLNIVNIAN_BANDIT = new Pickpocketable(45, 65, 5, 5, [new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COINS, 40)], [1880]);
    Pickpocketable.YANILLE_WATCHMAN = new Pickpocketable(65, 137, 5, 3, [new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COINS, 60), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.BREAD)], [3251]);
    Pickpocketable.MENAPHITE_THUG = new Pickpocketable(65, 137, 5, 5, [new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COINS, 60)], [3549, 3550]);
    Pickpocketable.PALADIN = new Pickpocketable(70, 152, 5, 3, [new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COINS, 80), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.CHAOS_RUNE, 2)], [3104, 3105]);
    Pickpocketable.GNOME = new Pickpocketable(75, 199, 5, 1, [new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.COINS, 300), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.EARTH_RUNE), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.GOLD_ORE), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.FIRE_ORB), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SWAMP_TOAD), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.KING_WORM)], [6086, 6087, 6094, 6095, 6096]);
    (function () {
        var e_1, _a, e_2, _b;
        try {
            for (var _c = __values(Object.values(Pickpocketable)), _d = _c.next(); !_d.done; _d = _c.next()) {
                var p = _d.value;
                try {
                    for (var _e = (e_2 = void 0, __values(p.getNpcs())), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var i = _f.value;
                        Pickpocketable.pickpockets.set(i, p);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
    })();
    Pickpocketable.pickpockets = new Map();
    return Pickpocketable;
}());
var StallThieving = /** @class */ (function () {
    function StallThieving() {
    }
    /**
 * Checks if we're attempting to steal from a stall based on the clicked object.
 *
 * @param player
 * @param object
 * @return
 */
    StallThieving.init = function (player, object) {
        var e_3, _a;
        var stall = Stall.get(object.getId());
        if (stall) {
            // Make sure we have the required thieving level..
            if (player.getSkillManager().getCurrentLevel(Skill_1.Skill.THIEVING) >= Stall.get(object.getId()).getReqLevel()) {
                // Make sure we aren't spam clicking..
                if (player.getClickDelay().elapsedTime(1000)) {
                    // Reset click delay..
                    player.getClickDelay().reset();
                    // Face stall..
                    player.setPositionToFace(object.getLocation());
                    // Perform animation..
                    player.performAnimation(THIEVING_ANIMATION);
                    // Add items..
                    var item = Stall.get(object.getId()).getRewards()[Misc_1.Misc.getRandom(Stall.get(object.getId()).getRewards().length - 1)];
                    player.getInventory().adds(item.getId(), item.getAmount() > 1 ? Misc_1.Misc.getRandom(item.getAmount()) : 1);
                    // Add pet..
                    PetHandler_1.PetHandler.onSkill(player, Skill_1.Skill.THIEVING);
                    try {
                        // Respawn stall..
                        for (var _b = __values(Stall.get(object.getId()).getStalls()), _c = _b.next(); !_c.done; _c = _b.next()) {
                            var stallDef = _c.value;
                            if (stallDef.getObjectId() == object.getId()) {
                                var replacementId = stallDef.getReplacement();
                                if (replacementId) {
                                    TaskManager_1.TaskManager.submit(new TimedObjectReplacementTask_1.TimedObjectReplacementTask(object, new GameObject_1.GameObject(replacementId, object.getLocation(), object.getType(), object.getFace(), player.getPrivateArea()), Stall.get(object.getId()).getRespawnTicks()));
                                }
                                break;
                            }
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                }
            }
            else {
                //DialogueManager.sendStatement(player, "You need a Thieving level of at least "
                //		+ Integer.toString(stall.get().getReqLevel()) + " to do this.");
            }
            return true;
        }
        return false;
    };
    return StallThieving;
}());
exports.StallThieving = StallThieving;
var StallDefinition = /** @class */ (function () {
    function StallDefinition(objectId, replacement) {
        this.objectId = objectId;
        this.replacement = replacement;
    }
    StallDefinition.prototype.getObjectId = function () {
        return this.objectId;
    };
    StallDefinition.prototype.getReplacement = function () {
        return this.replacement;
    };
    return StallDefinition;
}());
exports.StallDefinition = StallDefinition;
var Stall = exports.Stall = /** @class */ (function () {
    function Stall(stalls, reqLevel, exp, respawnTicks, rewards) {
        this.stalls = stalls;
        this.reqLevel = reqLevel;
        this.exp = exp;
        this.respawnTicks = respawnTicks;
        this.rewards = rewards;
    }
    Stall.get = function (objectId) {
        return Stall.map.get(objectId);
    };
    Stall.prototype.getStalls = function () {
        return this.stalls;
    };
    Stall.prototype.getReqLevel = function () {
        return this.reqLevel;
    };
    Stall.prototype.getExp = function () {
        return this.exp;
    };
    Stall.prototype.getRespawnTicks = function () {
        return this.respawnTicks;
    };
    Stall.prototype.getRewards = function () {
        return this.rewards;
    };
    /**
         * Represents a stall which can be stolen from using the Thieving skill.
         *
         * @author Professor Oak
         */
    Stall.BAKERS_STALL = new Stall([new StallDefinition(11730, 634)], 5, 16, 3, [new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.CAKE), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.CHOCOLATE_SLICE), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.BREAD)]);
    Stall.CRAFTING_STALL = new Stall([new StallDefinition(4874, null), new StallDefinition(6166, null)], 5, 16, 12, [new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.CHISEL), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.RING_MOULD), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.NECKLACE_MOULD)]);
    Stall.MONKEY_STALL = new Stall([new StallDefinition(4875, null)], 5, 16, 12, [new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.BANANA)]);
    Stall.MONKEY_GENERAL_STALL = new Stall([new StallDefinition(4876, null)], 5, 16, 12, [new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.POT), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.TINDERBOX), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.HAMMER)]);
    Stall.TEA_STALL = new Stall([new StallDefinition(635, 634), new StallDefinition(6574, 6573), new StallDefinition(20350, 20349)], 5, 16, 12, [new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.CUP_OF_TEA)]);
    Stall.SILK_STALL = new Stall([new StallDefinition(11729, 634)], 20, 24, 8, [new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SILK)]);
    Stall.WINE_STALL = new Stall([new StallDefinition(14011, 634)], 22, 27, 27, [new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.JUG_OF_WATER), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.JUG_OF_WINE), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.GRAPES), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.EMPTY_JUG), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.BOTTLE_OF_WINE)]);
    Stall.SEED_STALL = new Stall([new StallDefinition(7053, 634),], 27, 10, 30, [new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.POTATO_SEED, 12), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.ONION_SEED, 11), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.CABBAGE_SEED, 10), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.TOMATO_SEED, 9), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SWEETCORN_SEED, 7), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.STRAWBERRY_SEED, 5), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.WATERMELON_SEED, 3), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.BARLEY_SEED, 5), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.HAMMERSTONE_SEED, 5), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.ASGARNIAN_SEED, 5), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.JUTE_SEED, 5), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.YANILLIAN_SEED, 5), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.KRANDORIAN_SEED, 5), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.WILDBLOOD_SEED, 3), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.MARIGOLD_SEED, 4), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.ROSEMARY_SEED, 4), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.NASTURTIUM_SEED, 4)]);
    Stall.FUR_STALL = new Stall([new StallDefinition(11732, 634), new StallDefinition(4278, 634)], 35, 36, 17, [new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.GREY_WOLF_FUR)]);
    Stall.FISH_STALL = new Stall([new StallDefinition(4277, 4276), new StallDefinition(4707, 4276), new StallDefinition(4705, 4276)], 42, 42, 17, [new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.RAW_SALMON), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.RAW_TUNA)]);
    Stall.CROSSBOW_STALL = new Stall([new StallDefinition(17031, 6984)], 49, 52, 15, [new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.BRONZE_BOLTS, 6), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.BRONZE_LIMBS), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.WOODEN_STOCK)]);
    Stall.SILVER_STALL = new Stall([new StallDefinition(11734, 634), new StallDefinition(6164, 6984),], 50, 54, 50, [new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SILVER_ORE)]);
    Stall.SPICE_STALL = new Stall([new StallDefinition(11733, 634), new StallDefinition(6572, 6573), new StallDefinition(20348, 20349)], 65, 81, 133, [new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SPICE)]);
    Stall.MAGIC_STALL = new Stall([new StallDefinition(4877, null),], 65, 100, 133, [new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.AIR_RUNE, 20), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.WATER_RUNE, 20), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.EARTH_RUNE, 20), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.FIRE_RUNE, 20), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.LAW_RUNE, 6)]);
    Stall.SCIMITAR_STALL = new Stall([new StallDefinition(4878, null)], 65, 100, 133, [new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.IRON_SCIMITAR)]);
    Stall.GEM_STALL = new Stall([new StallDefinition(11731, 634), new StallDefinition(6162, 6984),], 75, 160, 133, [new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.UNCUT_SAPPHIRE), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.UNCUT_EMERALD), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.UNCUT_RUBY), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.UNCUT_DIAMOND)]);
    Stall.map = new Map();
    (function () {
        var e_4, _a, e_5, _b;
        try {
            for (var _c = __values(Object.values(Stall)), _d = _c.next(); !_d.done; _d = _c.next()) {
                var stall = _d.value;
                try {
                    for (var _e = (e_5 = void 0, __values(stall.getStalls())), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var def = _f.value;
                        Stall.map.set(def.getObjectId(), stall);
                    }
                }
                catch (e_5_1) { e_5 = { error: e_5_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                    }
                    finally { if (e_5) throw e_5.error; }
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_4) throw e_4.error; }
        }
    })();
    return Stall;
}());
//# sourceMappingURL=Thieving.js.map