"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlayerTask = void 0;
var SlayerMaster_1 = require("./SlayerMaster");
var SlayerTask = exports.SlayerTask = /** @class */ (function () {
    function SlayerTask(hint, minimumAmount, maximumAmount, slayerLevel, weight, masters, npcNames) {
        this.BANSHEES = new SlayerTask("in the Slayer Tower", 15, 50, 15, 8, [SlayerMaster_1.SlayerMaster.TURAEL, SlayerMaster_1.SlayerMaster.MAZCHNA], ["banshee", "twisted banshee"]);
        this.BATS = new SlayerTask("in the Taverly Dungeon", 15, 50, 1, 7, [SlayerMaster_1.SlayerMaster.TURAEL, SlayerMaster_1.SlayerMaster.MAZCHNA], ["bat", "giant bat"]);
        this.CHICKENS = new SlayerTask("in Lumbridge", 15, 50, 1, 6, [SlayerMaster_1.SlayerMaster.TURAEL], ["chicken", "mounted terrorbird gnome", "terrorbird", "rooster"]);
        this.BEARS = new SlayerTask("outside Varrock", 15, 50, 1, 7, [SlayerMaster_1.SlayerMaster.TURAEL, SlayerMaster_1.SlayerMaster.MAZCHNA], ["black bear", "grizzly bear", "grizzly bear cub", "bear cub", "callisto"]);
        this.CAVE_BUGS = new SlayerTask("Lumbridge dungeon", 10, 20, 7, 8, [SlayerMaster_1.SlayerMaster.TURAEL, SlayerMaster_1.SlayerMaster.MAZCHNA], ["cave bug"]);
        this.CAVE_CRAWLERS = new SlayerTask("Lumbridge dungeon", 15, 50, 10, 8, [SlayerMaster_1.SlayerMaster.TURAEL, SlayerMaster_1.SlayerMaster.MAZCHNA], ["cave crawler"]);
        this.CAVE_SLIME = new SlayerTask("Lumbridge dungeon", 10, 20, 17, 8, [SlayerMaster_1.SlayerMaster.TURAEL, SlayerMaster_1.SlayerMaster.MAZCHNA], ["cave slime"]);
        this.COWS = new SlayerTask("Lumbridge", 15, 50, 1, 8, [SlayerMaster_1.SlayerMaster.TURAEL], ["cow", "cow calf"]);
        this.CRAWLING_HANDS = new SlayerTask("in the Slayer Tower", 15, 50, 5, 8, [SlayerMaster_1.SlayerMaster.TURAEL, SlayerMaster_1.SlayerMaster.MAZCHNA], ["crawling hand"]);
        this.DESERT_LIZARDS = new SlayerTask("in the desert", 15, 50, 22, 8, [SlayerMaster_1.SlayerMaster.TURAEL, SlayerMaster_1.SlayerMaster.MAZCHNA], ["lizard", "small lizard", "desert lizard"]);
        this.DOGS = new SlayerTask("", 15, 50, 1, 7, [SlayerMaster_1.SlayerMaster.TURAEL, SlayerMaster_1.SlayerMaster.MAZCHNA], ["dog", "jackal", "guard dog", "wild dog"]);
        this.DWARVES = new SlayerTask("", 15, 50, 1, 7, [SlayerMaster_1.SlayerMaster.TURAEL], ["dwarf", "dwarf gang member", "chaos dwarf"]);
        this.GHOSTS = new SlayerTask("", 15, 50, 1, 7, [SlayerMaster_1.SlayerMaster.TURAEL, SlayerMaster_1.SlayerMaster.MAZCHNA], ["ghost", "tortured soul"]);
        this.GOBLINS = new SlayerTask("", 15, 50, 1, 7, [SlayerMaster_1.SlayerMaster.TURAEL], ["goblin", "cave goblin guard"]);
        this.ICEFIENDS = new SlayerTask("", 15, 50, 1, 8, [SlayerMaster_1.SlayerMaster.TURAEL], ["icefiend"]);
        this.KALPHITES = new SlayerTask("", 15, 50, 1, 6, [SlayerMaster_1.SlayerMaster.TURAEL, SlayerMaster_1.SlayerMaster.MAZCHNA], ["kalphite worker", "kalphite soldier", "kalphite guardian", "kalphite queen"]);
        this.MINOTAURS = new SlayerTask("", 10, 20, 1, 7, [SlayerMaster_1.SlayerMaster.TURAEL], ["minotaur"]);
        this.MONKEYS = new SlayerTask("", 10, 20, 1, 7, [SlayerMaster_1.SlayerMaster.TURAEL], ["monkey", "karmjan monkey", "monkey guard", "monkey archer", "zombie monkey"]);
        this.RATS = new SlayerTask("", 15, 50, 1, 7, [SlayerMaster_1.SlayerMaster.TURAEL], ["rat", "giant rat", "dungeon rat", "brine rat"]);
        this.SCORPIONS = new SlayerTask("", 15, 50, 1, 7, [SlayerMaster_1.SlayerMaster.TURAEL, SlayerMaster_1.SlayerMaster.MAZCHNA], ["scorpion", "king scorpion", "poison scorpion", "pit scorpion", "scorpia"]);
        this.SKELETONS = new SlayerTask("", 15, 50, 1, 7, [SlayerMaster_1.SlayerMaster.TURAEL, SlayerMaster_1.SlayerMaster.MAZCHNA], ["skeleton", "skeleton mage", "vet'ion"]);
        this.SPIDERS = new SlayerTask("", 15, 50, 1, 6, [SlayerMaster_1.SlayerMaster.TURAEL], ["spider", "giant spider", "shadow spider", "giant crypt spider", "venenatis"]);
        this.WOLVES = new SlayerTask("", 15, 50, 1, 7, [SlayerMaster_1.SlayerMaster.TURAEL, SlayerMaster_1.SlayerMaster.MAZCHNA], ["wolf", "white wolf", "big wolf"]);
        this.ZOMBIES = new SlayerTask("", 15, 50, 1, 7, [SlayerMaster_1.SlayerMaster.TURAEL, SlayerMaster_1.SlayerMaster.MAZCHNA], ["zombie", "undead one"]);
        this.CATABLEPONS = new SlayerTask("", 15, 50, 1, 8, [SlayerMaster_1.SlayerMaster.MAZCHNA], ["catablepon"]);
        this.COCKATRICES = new SlayerTask("", 15, 50, 25, 8, [SlayerMaster_1.SlayerMaster.MAZCHNA], ["cockatrice"]);
        this.EARTH_WARRIORS = new SlayerTask("", 15, 50, 1, 6, [SlayerMaster_1.SlayerMaster.MAZCHNA], ["earth warrior"]);
        this.FLESH_CRAWLERS = new SlayerTask("", 15, 50, 1, 7, [SlayerMaster_1.SlayerMaster.MAZCHNA], ["flesh crawler"]);
        this.GHOULS = new SlayerTask("", 15, 50, 1, 7, [SlayerMaster_1.SlayerMaster.MAZCHNA], ["ghoul"]);
        this.HILL_GIANTS = new SlayerTask("", 15, 50, 1, 7, [SlayerMaster_1.SlayerMaster.MAZCHNA], ["hill giant"]);
        this.HOBGOBLINS = new SlayerTask("", 15, 50, 1, 7, [SlayerMaster_1.SlayerMaster.MAZCHNA], ["hob goblin"]);
        this.ROCKSLUGS = new SlayerTask("", 15, 50, 1, 8, [SlayerMaster_1.SlayerMaster.MAZCHNA], ["rockslug"]);
        this.hint = hint;
        this.minimumAmount = minimumAmount;
        this.maximumAmount = maximumAmount;
        this.slayerLevel = slayerLevel;
        this.weight = weight;
        this.masters = masters;
        this.npcNames = npcNames;
    }
    SlayerTask.prototype.getHint = function () {
        return this.hint;
    };
    SlayerTask.prototype.getMinimumAmount = function () {
        return this.minimumAmount;
    };
    SlayerTask.prototype.getMaximumAmount = function () {
        return this.maximumAmount;
    };
    SlayerTask.prototype.getSlayerLevel = function () {
        return this.slayerLevel;
    };
    SlayerTask.prototype.getWeight = function () {
        return this.weight;
    };
    SlayerTask.prototype.getMasters = function () {
        return this.masters;
    };
    SlayerTask.prototype.getNpcNames = function () {
        return this.npcNames;
    };
    SlayerTask.prototype.isUnlocked = function (player) {
        return true;
    };
    SlayerTask.VALUES = Object.values(SlayerTask);
    return SlayerTask;
}());
//# sourceMappingURL=SlayerTask.js.map