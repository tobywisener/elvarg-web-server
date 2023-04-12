"use strict";
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
exports.Edible = exports.Food = void 0;
var TimerKey_1 = require("../../util/timers/TimerKey");
var Sounds_1 = require("../Sounds");
var Sound_1 = require("../Sound");
var Skill_1 = require("../model/Skill");
var Item_1 = require("../model/Item");
var Animation_1 = require("../model/Animation");
var Food = exports.Food = /** @class */ (function () {
    function Food() {
    }
    Food.consume = function (player, item, slot) {
        var food = Edible.types.get(item);
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
        if (player.getTimers().has(TimerKey_1.TimerKey.STUN)) {
            player.getPacketSender().sendMessage("You're currently stunned!");
            return true;
        }
        if (food == Edible.KARAMBWAN) {
            if (player.getTimers().has(TimerKey_1.TimerKey.KARAMBWAN))
                return true;
        }
        else {
            if (player.getTimers().has(TimerKey_1.TimerKey.FOOD)) {
                return true;
            }
        }
        player.getTimers().extendOrRegister(TimerKey_1.TimerKey.FOOD, 3);
        player.getTimers().extendOrRegister(TimerKey_1.TimerKey.COMBAT_ATTACK, 5);
        if (food == Edible.KARAMBWAN) {
            player.getTimers().registers(TimerKey_1.TimerKey.KARAMBWAN, 3); // Register karambwan timer too
            player.getTimers().registers(TimerKey_1.TimerKey.POTION, 3); // Register the potion timer (karambwan blocks pots)
        }
        // Close interfaces..
        player.getPacketSender().sendInterfaceRemoval();
        // Stop skilling..
        player.getSkillManager().stopSkillable();
        // Send sound..
        Sounds_1.Sounds.sendSound(player, Sound_1.Sound.FOOD_EAT);
        player.performAnimation(Food.ANIMATION);
        // Delete food from inventory..
        player.getInventory().deleteItem(food.item, slot);
        // Heal the player..
        var currentHp = player.getSkillManager().getCurrentLevel(Skill_1.Skill.HITPOINTS);
        var maxHp = player.getSkillManager().getMaxLevel(Skill_1.Skill.HITPOINTS);
        var healAmount = food.heal;
        if (food == Edible.ANGLERFISH) {
            var c = 2;
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
        var e = food == Edible.BANDAGES ? "use" : "eat";
        player.getPacketSender().sendMessage("You " + e + " the " + food.name + ".");
        // Handle cake slices..
        if (food == Edible.CAKE || food == Edible.SECOND_CAKE_SLICE) {
            player.getInventory().deleteItem(new Item_1.Item(food.item.getId() + 2), 1);
        }
        return true;
    };
    /**
     * The {@link Animation} that will be played when consuming food.
     */
    Food.ANIMATION = new Animation_1.Animation(829);
    return Food;
}());
var Edible = exports.Edible = /** @class */ (function () {
    function Edible(item, heal, name) {
        this.item = item;
        this.heal = heal;
        this.name = name.toLowerCase().replace(/__/g, "-").replace(/_/g, " ");
    }
    Edible.prototype.getItem = function () {
        return this.item;
    };
    /**
     * Returns an array of all Edible item ids.
     *
     * @return {Integer[]} edibleTypes
     */
    Edible.getTypes = function () {
        return Object.keys(Edible.types).map(Number);
    };
    Edible.prototype.getHeal = function () {
        return this.heal;
    };
    Edible.KEBAB = new Edible(new Item_1.Item(1971), 4);
    Edible.CHEESE = new Edible(new Item_1.Item(1985), 4);
    Edible.CAKE = new Edible(new Item_1.Item(1891), 5);
    Edible.SECOND_CAKE_SLICE = new Edible(new Item_1.Item(1893), 5);
    Edible.THIRD_CAKE_SLICE = new Edible(new Item_1.Item(1895), 5);
    Edible.BANDAGES = new Edible(new Item_1.Item(14640), 12);
    Edible.JANGERBERRIES = new Edible(new Item_1.Item(247), 2);
    Edible.WORM_CRUNCHIES = new Edible(new Item_1.Item(2205), 7);
    Edible.EDIBLE_SEAWEED = new Edible(new Item_1.Item(403), 4);
    Edible.ANCHOVIES = new Edible(new Item_1.Item(319), 1);
    Edible.SHRIMPS = new Edible(new Item_1.Item(315), 3);
    Edible.SARDINE = new Edible(new Item_1.Item(325), 4);
    Edible.COD = new Edible(new Item_1.Item(339), 7);
    Edible.TROUT = new Edible(new Item_1.Item(333), 7);
    Edible.PIKE = new Edible(new Item_1.Item(351), 8);
    Edible.SALMON = new Edible(new Item_1.Item(329), 9);
    Edible.TUNA = new Edible(new Item_1.Item(361), 10);
    Edible.LOBSTER = new Edible(new Item_1.Item(379), 12);
    Edible.BASS = new Edible(new Item_1.Item(365), 13);
    Edible.SWORDFISH = new Edible(new Item_1.Item(373), 14);
    Edible.MEAT_PIZZA = new Edible(new Item_1.Item(2293), 14);
    Edible.MONKFISH = new Edible(new Item_1.Item(7946), 16);
    Edible.SHARK = new Edible(new Item_1.Item(385), 20);
    Edible.SEA_TURTLE = new Edible(new Item_1.Item(397), 21);
    Edible.DARK_CRAB = new Edible(new Item_1.Item(11936), 22);
    Edible.MANTA_RAY = new Edible(new Item_1.Item(391), 22);
    Edible.KARAMBWAN = new Edible(new Item_1.Item(3144), 18);
    Edible.ANGLERFISH = new Edible(new Item_1.Item(13441), 22);
    /*
    * Baked goods food types a player can make with the cooking skill.
    */
    Edible.POTATO = (new Item_1.Item(1942), 1);
    Edible.BAKED_POTATO = (new Item_1.Item(6701), 4);
    Edible.POTATO_WITH_BUTTER = (new Item_1.Item(6703), 14);
    Edible.CHILLI_POTATO = (new Item_1.Item(7054), 14);
    Edible.EGG_POTATO = (new Item_1.Item(7056), 16);
    Edible.POTATO_WITH_CHEESE = (new Item_1.Item(6705), 16);
    Edible.MUSHROOM_POTATO = (new Item_1.Item(7058), 20);
    Edible.TUNA_POTATO = (new Item_1.Item(7060), 20);
    Edible.SPINACH_ROLL = (new Item_1.Item(1969), 2);
    Edible.BANANA = (new Item_1.Item(1963), 2);
    Edible.BANANA_ = (new Item_1.Item(18199), 2);
    Edible.CABBAGE = (new Item_1.Item(1965), 2);
    Edible.ORANGE = (new Item_1.Item(2108), 2);
    Edible.PINEAPPLE_CHUNKS = (new Item_1.Item(2116), 2);
    Edible.PINEAPPLE_RINGS = (new Item_1.Item(2118), 2);
    Edible.PEACH = (new Item_1.Item(6883), 8);
    Edible.PURPLE_SWEETS = (new Item_1.Item(4561), 3);
    Edible.types = new Map();
    (function () {
        var e_1, _a;
        try {
            for (var _b = __values(Object.values(Edible)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var type = _c.value;
                Edible.types.set(type.item.getId(), type);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    })();
    return Edible;
}());
//# sourceMappingURL=Food.js.map