"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RDT = exports.DropTable = exports.NPCDrop = exports.NpcDropDefinition = void 0;
var Item_1 = require("../model/Item");
var NpcDropDefinition = exports.NpcDropDefinition = /** @class */ (function () {
    function NpcDropDefinition() {
    }
    NpcDropDefinition.get = function (npcId) {
        return this.definitions.get(npcId);
    };
    NpcDropDefinition.prototype.getNpcIds = function () {
        return this.npcIds;
    };
    NpcDropDefinition.prototype.getRdtChance = function () {
        return this.rdtChance;
    };
    NpcDropDefinition.prototype.getAlwaysDrops = function () {
        return this.alwaysDrops;
    };
    NpcDropDefinition.prototype.getCommonDrops = function () {
        return this.commonDrops;
    };
    NpcDropDefinition.prototype.getUncommonDrops = function () {
        return this.uncommonDrops;
    };
    NpcDropDefinition.prototype.getRareDrops = function () {
        return this.rareDrops;
    };
    NpcDropDefinition.prototype.getVeryRareDrops = function () {
        return this.veryRareDrops;
    };
    NpcDropDefinition.prototype.getSpecialDrops = function () {
        return this.specialDrops;
    };
    NpcDropDefinition.definitions = new Map();
    return NpcDropDefinition;
}());
var NPCDrop = /** @class */ (function () {
    function NPCDrop(itemId, minAmount, maxAmount, chance) {
        this.itemId = itemId;
        this.minAmount = minAmount;
        this.maxAmount = maxAmount;
        if (chance === null) {
            this.chance = chance;
        }
        else {
            this.chance = -1;
        }
    }
    NPCDrop.prototype.getItemId = function () {
        return this.itemId;
    };
    NPCDrop.prototype.getMinAmount = function () {
        return this.minAmount;
    };
    NPCDrop.prototype.getMaxAmount = function () {
        return this.maxAmount;
    };
    NPCDrop.prototype.toItem = function (random) {
        return new Item_1.Item(this.itemId, random.getInclusive(this.minAmount, this.maxAmount));
    };
    NPCDrop.prototype.getChance = function () {
        return this.chance;
    };
    return NPCDrop;
}());
exports.NPCDrop = NPCDrop;
var DropTable = exports.DropTable = /** @class */ (function () {
    function DropTable(randomRequired) {
        this.randomRequired = randomRequired;
    }
    DropTable.prototype.getRandomRequired = function () {
        return this.randomRequired;
    };
    DropTable.COMMON = new DropTable(90);
    DropTable.UNCOMMON = new DropTable(40);
    DropTable.RARE = new DropTable(6);
    DropTable.VERY_RARE = new DropTable(0.6);
    DropTable.SPECIAL = new DropTable(-1);
    return DropTable;
}());
var RDT = exports.RDT = /** @class */ (function () {
    function RDT(itemId, amount, chance) {
        this.itemId = itemId;
        this.amount = amount;
        this.chance = chance;
    }
    RDT.prototype.getItemId = function () {
        return this.itemId;
    };
    RDT.prototype.getAmount = function () {
        return this.amount;
    };
    RDT.prototype.getChance = function () {
        return this.chance;
    };
    RDT.LAW_RUNE = new RDT(563, 45, 64);
    RDT.DEATH_RUNE = new RDT(560, 45, 64);
    RDT.NATURE_RUNE = new RDT(561, 67, 43);
    RDT.STEEL_ARROW = new RDT(886, 150, 64);
    RDT.RUNE_ARROW = new RDT(886, 42, 64);
    RDT.UNCUT_SAPPHIRE = new RDT(1623, 1, 1);
    RDT.UNCUT_EMERALD = new RDT(1621, 1, 20);
    RDT.UNCUT_RUBY = new RDT(1619, 1, 20);
    RDT.UNCUT_DIAMOND = new RDT(1617, 1, 64);
    RDT.DRAGONSTONE = new RDT(1631, 1, 64);
    RDT.RUNITE_BAR = new RDT(2363, 1, 20);
    RDT.SILVER_ORE = new RDT(443, 100, 64);
    RDT.COINS = new RDT(995, 3000, 1);
    RDT.CHAOS_TALISMAN = new RDT(1452, 1, 1);
    RDT.NATURE_TALISMAN = new RDT(1462, 1, 20);
    RDT.LOOP_HALF_OF_KEY = new RDT(987, 6, 1);
    RDT.TOOTH_HALF_OF_KEY = new RDT(985, 6, 1);
    RDT.ADAMANT_JAVELIN = new RDT(829, 20, 64);
    RDT.RUNE_JAVELIN = new RDT(830, 5, 33);
    RDT.RUNE_2H_SWORD = new RDT(1319, 1, 43);
    RDT.RUNE_BATTLEAXE = new RDT(1373, 1, 43);
    RDT.RUNE_SQUARE_SHIELD = new RDT(1185, 1, 64);
    RDT.RUNE_KITE_SHIELD = new RDT(1201, 1, 128);
    RDT.DRAGON_MED_HELM = new RDT(1149, 1, 128);
    RDT.RUNE_SPEAR = new RDT(1247, 1, 137);
    RDT.SHIELD_LEFT_HALF = new RDT(2366, 1, 273);
    RDT.DRAGON_SPEAR = new RDT(1249, 1, 364);
    return RDT;
}());
//# sourceMappingURL=NpcDropDefinition.js.map