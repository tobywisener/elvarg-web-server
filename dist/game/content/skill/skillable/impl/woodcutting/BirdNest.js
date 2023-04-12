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
exports.Nest = exports.Seed = exports.Ring = exports.BirdNest = void 0;
var Misc_1 = require("../../../../../../util/Misc");
var ItemOnGroundManager_1 = require("../../../../../entity/impl/grounditem/ItemOnGroundManager");
var ItemIdentifiers_1 = require("../../../../../../util/ItemIdentifiers");
var Item_1 = require("../../../../../model/Item");
var BirdNest = exports.BirdNest = /** @class */ (function () {
    function BirdNest() {
    }
    BirdNest.getById = function (id) {
        var ring;
        for (var nest in Nest) {
            if (ring.getId() === id) {
                return nest;
            }
        }
        return null;
    };
    BirdNest.getSeedById = function (id) {
        for (var seed in Seed) {
            if (Seed[seed].id === id) {
                return Seed[seed];
            }
        }
    };
    BirdNest.getSeedByName = function (name) {
        for (var seed in Seed) {
            if (Seed[seed].name === name) {
                return Seed[seed];
            }
        }
    };
    BirdNest.handleDropNest = function (player) {
        if (player.getLocation().getZ() > 0) {
            return;
        }
        var random = Math.random();
        var nest;
        if (random < BirdNest.SEEDS_NEST_CHANCE) {
            nest = Nest.SEEDS_NEST;
        }
        else if (random < BirdNest.SEEDS_NEST_CHANCE + BirdNest.GOLD_NEST_CHANCE) {
            nest = Nest.GOLD_BIRD_NEST;
        }
        else {
            var color = Misc_1.Misc.getRandom(2);
            switch (color) {
                case 1:
                    nest = Nest.RED_BIRD_NEST;
                    break;
                case 2:
                    nest = Nest.GREEN_BIRD_NEST;
                    break;
                default:
                    nest = Nest.BLUE_BIRD_NEST;
                    break;
            }
        }
        if (nest != null) {
            ItemOnGroundManager_1.ItemOnGroundManager.registers(player, new Item_1.Item(nest.getId(), 1));
            player.getPacketSender().sendMessage("@red@A bird's nest falls out of the tree.");
        }
    };
    BirdNest.handleSearchNest = function (p, itemId) {
        var nest = Nest.getById(itemId);
        if (!nest) {
            return;
        }
        if (p.getInventory().getFreeSlots() <= 0) {
            p.getPacketSender().sendMessage("Your inventory is too full to take anything out of the bird's nest.");
            return;
        }
        p.getInventory().deleteNumber(itemId, 1);
        p.getInventory().adds(Nest.EMPTY.getId(), 1);
        if (nest == Nest.GOLD_BIRD_NEST) {
            this.searchRingNest(p, itemId);
        }
        else if (nest == Nest.SEEDS_NEST) {
            this.searchSeedNest(p, itemId);
        }
        else {
            this.searchEggNest(p, itemId);
        }
    };
    BirdNest.searchEggNest = function (player, itemId) {
        var eggId = 0;
        if (itemId == ItemIdentifiers_1.ItemIdentifiers.BIRD_NEST) {
            eggId = ItemIdentifiers_1.ItemIdentifiers.BIRDS_EGG;
        }
        else if (itemId == ItemIdentifiers_1.ItemIdentifiers.BIRD_NEST_3) {
            eggId = ItemIdentifiers_1.ItemIdentifiers.BIRDS_EGG_2;
        }
        else if (itemId == ItemIdentifiers_1.ItemIdentifiers.BIRD_NEST_2) {
            eggId = ItemIdentifiers_1.ItemIdentifiers.BIRDS_EGG_3;
        }
        if (eggId != 0) {
            player.getInventory().adds(eggId, BirdNest.AMOUNT);
            player.getPacketSender().sendMessage("You take the bird's egg out of the bird's nest.");
        }
    };
    BirdNest.searchSeedNest = function (player, itemId) {
        if (itemId != ItemIdentifiers_1.ItemIdentifiers.BIRD_NEST_4) {
            return;
        }
        var random = Misc_1.Misc.getRandom(1000);
        var seed = null;
        if (random <= 220) {
            seed = Seed.ACORN;
        }
        else if (random <= 350) {
            seed = Seed.WILLOW;
        }
        else if (random <= 400) {
            seed = Seed.MAPLE;
        }
        else if (random <= 430) {
            seed = Seed.YEW;
        }
        else if (random <= 440) {
            seed = Seed.MAGIC;
        }
        else if (random <= 600) {
            seed = Seed.APPLE;
        }
        else if (random <= 700) {
            seed = Seed.BANANA;
        }
        else if (random <= 790) {
            seed = Seed.ORANGE;
        }
        else if (random <= 850) {
            seed = Seed.CURRY;
        }
        else if (random <= 900) {
            seed = Seed.PINEAPPLE;
        }
        else if (random <= 930) {
            seed = Seed.PAPAYA;
        }
        else if (random <= 960) {
            seed = Seed.PALM;
        }
        else if (random <= 980) {
            seed = Seed.CALQUAT;
        }
        else if (random <= 1000) {
            seed = Seed.SPIRIT;
        }
        if (seed != null) {
            var ring = void 0;
            player.getInventory().adds(ring.getId(), BirdNest.AMOUNT);
            if (seed == Seed.ACORN) {
                player.getPacketSender().sendMessage("You take an ".concat(Ring.getName(), " out of the bird's nest."));
            }
            else if (seed == Seed.APPLE || seed == Seed.ORANGE) {
                player.getPacketSender().sendMessage("You take an ".concat(Ring.getName(), " tree seed out of the bird's nest."));
            }
            else {
                player.getPacketSender().sendMessage("You take a " + Ring.getName() + " tree seed out of the bird's nest.");
            }
        }
    };
    BirdNest.searchRingNest = function (player, itemId) {
        if (itemId != ItemIdentifiers_1.ItemIdentifiers.BIRD_NEST_5) {
            return;
        }
        var random = Misc_1.Misc.getRandom(100);
        var ring = null;
        if (random <= 35) {
            ring = Ring.GOLD;
        }
        else if (random <= 75) {
            ring = Ring.SAPPHIRE;
        }
        else if (random <= 90) {
            ring = Ring.EMERALD;
        }
        else if (random <= 98) {
            ring = Ring.RUBY;
        }
        else if (random <= 100) {
            ring = Ring.DIAMOND;
        }
        if (ring != null) {
            var ring_1;
            player.getInventory().adds(ring_1.getId(), BirdNest.AMOUNT);
            if (ring_1 == Ring.EMERALD) {
                player.getPacketSender().sendMessage("You take an ".concat(Ring.getName(), " ring out of the bird's nest."));
            }
            else {
                player.getPacketSender().sendMessage("You take a ".concat(Ring.getName(), " ring out of the bird's nest."));
            }
        }
    };
    BirdNest.AMOUNT = 1;
    BirdNest.SEEDS_NEST_CHANCE = 0.64;
    BirdNest.GOLD_NEST_CHANCE = 0.32;
    BirdNest.NEST_DROP_CHANCE = 256;
    return BirdNest;
}());
var Ring = exports.Ring = /** @class */ (function () {
    function Ring(id, name) {
        this.id = id;
        this.name = name;
    }
    Ring.prototype.getId = function () {
        return this.id;
    };
    Ring.getName = function () {
        return this.name;
    };
    Ring.GOLD = new Ring(1635, "gold");
    Ring.SAPPHIRE = new Ring(1637, "sapphire");
    Ring.EMERALD = new Ring(1639, "emerald");
    Ring.RUBY = new Ring(1641, "ruby");
    Ring.DIAMOND = new Ring(1643, "diamond");
    return Ring;
}());
var Seed = exports.Seed = /** @class */ (function () {
    function Seed(id, name) {
        this.id = id;
        this.name = name;
    }
    Seed.prototype.getId = function () {
        return this.id;
    };
    Seed.getName = function () {
        return this.name;
    };
    Seed.ACORN = new Seed(5312, "acorn");
    Seed.WILLOW = new Seed(5313, "willow");
    Seed.MAPLE = new Seed(5314, "maple");
    Seed.YEW = new Seed(5315, "yew");
    Seed.MAGIC = new Seed(5316, "magic");
    Seed.SPIRIT = new Seed(5317, "spirit");
    Seed.APPLE = new Seed(5283, "apple");
    Seed.BANANA = new Seed(5284, "banana");
    Seed.ORANGE = new Seed(5285, "orange");
    Seed.CURRY = new Seed(5286, "curry");
    Seed.PINEAPPLE = new Seed(5287, "pineapple");
    Seed.PAPAYA = new Seed(5288, "papaya");
    Seed.PALM = new Seed(5289, "palm");
    Seed.CALQUAT = new Seed(5290, "calquat");
    return Seed;
}());
var Nest = exports.Nest = /** @class */ (function () {
    function Nest(id) {
        this.id = id;
    }
    Nest.prototype.getId = function () {
        return this.id;
    };
    Nest.getById = function (id) {
        var e_1, _a;
        try {
            for (var _b = __values(Object.values(Nest)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var nest = _c.value;
                if (nest.getId() === id) {
                    return nest;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return null;
    };
    Nest.RED_BIRD_NEST = new Nest(ItemIdentifiers_1.ItemIdentifiers.BIRD_NEST);
    Nest.GREEN_BIRD_NEST = new Nest(ItemIdentifiers_1.ItemIdentifiers.BIRD_NEST_2);
    Nest.BLUE_BIRD_NEST = new Nest(ItemIdentifiers_1.ItemIdentifiers.BIRD_NEST_3);
    Nest.SEEDS_NEST = new Nest(ItemIdentifiers_1.ItemIdentifiers.BIRD_NEST_4);
    Nest.GOLD_BIRD_NEST = new Nest(ItemIdentifiers_1.ItemIdentifiers.BIRD_NEST_5);
    Nest.EMPTY = new Nest(ItemIdentifiers_1.ItemIdentifiers.BIRD_NEST_6);
    return Nest;
}());
//# sourceMappingURL=BirdNest.js.map