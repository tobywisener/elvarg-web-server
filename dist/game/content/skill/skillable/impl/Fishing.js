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
exports.FishingTool = exports.AttackToolRandomEvent = exports.Fishing = void 0;
var Skill_1 = require("../../../../model/Skill");
var Item_1 = require("../../../../model/Item");
var TaskManager_1 = require("../../../../task/TaskManager");
var PetHandler_1 = require("../../../PetHandler");
var ItemDefinition_1 = require("../../../../definition/ItemDefinition");
var Task_1 = require("../../../../task/Task");
var Misc_1 = require("../../../../../util/Misc");
var DefaultSkillable_1 = require("./DefaultSkillable");
var Chance_1 = require("../../../../../util/Chance");
var Animation_1 = require("../../../../model/Animation");
var ItemOnGroundManager_1 = require("../../../../entity/impl/grounditem/ItemOnGroundManager");
var Projectile_1 = require("../../../../model/Projectile");
var FishingTask = /** @class */ (function (_super) {
    __extends(FishingTask, _super);
    function FishingTask(n, player, b) {
        return _super.call(this, n, b) || this;
    }
    FishingTask.prototype.execute = function () {
    };
    return FishingTask;
}(Task_1.Task));
var Fishing = exports.Fishing = /** @class */ (function (_super) {
    __extends(Fishing, _super);
    function Fishing(fishSpot, tool) {
        var _this = _super.call(this) || this;
        _this.fishSpot = fishSpot;
        _this.tool = tool;
        return _this;
    }
    Fishing.prototype.loopRequirements = function () {
        return true;
    };
    Fishing.prototype.allowFullInventory = function () {
        return false;
    };
    Fishing.prototype.hasRequirements = function (player) {
        if (!player.getInventory().contains(this.tool.getId())) {
            player.getPacketSender().sendMessage("You need a " + ItemDefinition_1.ItemDefinition.forId(this.tool.getId()).getName().toLowerCase() + " to do this.");
            return false;
        }
        if (player.getSkillManager().getCurrentLevel(Skill_1.Skill.FISHING) < this.tool.getLevel()) {
            player.getPacketSender().sendMessage("You need a Fishing level of at least " + this.tool.getLevel() + " to do this.");
            return false;
        }
        if (this.tool.getNeeded() > 0) {
            if (!player.getInventory().contains(this.tool.getNeeded())) {
                player.getPacketSender().sendMessage("You do not have any " + ItemDefinition_1.ItemDefinition.forId(this.tool.getNeeded()).getName().toLowerCase() + "(s).");
                return false;
            }
        }
        return _super.prototype.hasRequirements.call(this, player);
    };
    Fishing.prototype.start = function (player) {
        player.getPacketSender().sendMessage("You begin to fish..");
        _super.prototype.start.call(this, player);
    };
    Fishing.prototype.startAnimationLoop = function (player) {
        var animLoop = new FishingTask(4, player, true);
        TaskManager_1.TaskManager.submit(animLoop);
        this.getTasks().push(animLoop);
    };
    Fishing.prototype.onCycle = function (player) {
        PetHandler_1.PetHandler.onSkill(player, Skill_1.Skill.FISHING);
        //Handle random event..
        if (Misc_1.Misc.getRandom(1400) == 1) {
            var attackTool = new AttackToolRandomEvent(player, this.tool, this.fishSpot);
            TaskManager_1.TaskManager.submit(attackTool);
            this.cancel(player);
        }
    };
    Fishing.prototype.finishedCycle = function (player) {
        /** Random stop for that 'old school' rs feel :) */
        if (Misc_1.Misc.getRandom(90) == 0) {
            this.cancel(player);
        }
        /** Catch multiple fish with a big net. */
        var amount = 1;
        if (this.tool == FishingTool.BIG_NET) {
            amount = Math.min(Misc_1.Misc.getRandom(4) + 1, player.getInventory().getFreeSlots());
        }
        var fishingLevel = player.getSkillManager().getCurrentLevel(Skill_1.Skill.FISHING);
        for (var i = 0; i < amount; i++) {
            var caught = Fishing.determineFish(player, this.tool);
            var levelDiff = fishingLevel - caught.getLevel();
            var chance = Chance_1.Chance.SOMETIMES;
            if (levelDiff >= 15)
                chance = Chance_1.Chance.COMMON;
            if (levelDiff >= 25)
                chance = Chance_1.Chance.VERY_COMMON;
            if (chance.success()) {
                player.getPacketSender().sendMessage("You catch a " + caught.getName().toLowerCase().replace("_", " ") + ".");
                player.getInventory().addItem(new Item_1.Item(caught.getId()));
                player.getSkillManager().addExperiences(Skill_1.Skill.FISHING, caught.getExperience());
            }
            if (chance.success()) {
                player.getPacketSender().sendMessage("You catch a " + caught.getName().toLowerCase().replace("_", " ") + ".");
                player.getInventory().addItem(new Item_1.Item(caught.getId()));
                player.getSkillManager().addExperiences(Skill_1.Skill.FISHING, caught.getExperience());
            }
            if (this.tool.getNeeded() > 0) {
                player.getInventory().deletes(new Item_1.Item(this.tool.getNeeded()));
            }
        }
    };
    Fishing.cyclesRequired = function (player) {
        var cycles = 4 + Misc_1.Misc.getRandom(2);
        cycles -= player.getSkillManager().getCurrentLevel(Skill_1.Skill.FISHING) * 0.03;
        return Math.max(3, cycles);
    };
    /**
     * Gets a random fish to be caught for the player based on fishing level and
     * rarity.
     *
     * @param player the player that needs a fish.
     * @param tool   the tool this player is fishing with.
     */
    Fishing.determineFish = function (player, tool) {
        var e_1, _a;
        var fishList = [];
        try {
            /** Determine which fish are able to be caught. */
            for (var _b = __values(tool.getFish()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var fish = _c.value;
                if (fish.getLevel() <= player.getSkillManager().getCurrentLevel(Skill_1.Skill.FISHING)) {
                    fishList.push(fish);
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
        /** Filter the fish based on rarity. */
        fishList = fishList.filter(function (fish) { return fish.getChance().success(); });
        /** Return a random fish from the list. */
        return Misc_1.Misc.randomElement(fishList);
    };
    Fishing.CASKET_ITEMS = [new Item_1.Item(1061), new Item_1.Item(592), new Item_1.Item(1059), new Item_1.Item(995, 100000), new Item_1.Item(4212), new Item_1.Item(995, 50000), new Item_1.Item(401), new Item_1.Item(995, 150000), new Item_1.Item(407)];
    return Fishing;
}(DefaultSkillable_1.DefaultSkillable));
var Fish = /** @class */ (function () {
    function Fish(id, level, chance, experience, name) {
        this.id = id;
        this.level = level;
        this.chance = chance;
        this.experience = experience;
        this.name = name;
    }
    Fish.prototype.getId = function () {
        return this.id;
    };
    Fish.prototype.getLevel = function () {
        return this.level;
    };
    Fish.prototype.getChance = function () {
        return this.chance;
    };
    Fish.prototype.getExperience = function () {
        return this.experience;
    };
    Fish.prototype.getName = function () {
        return this.name;
    };
    Fish.SHRIMP = new Fish(317, 1, Chance_1.Chance.VERY_COMMON, 10, "SHRIMP");
    Fish.SARDINE = new Fish(327, 5, Chance_1.Chance.VERY_COMMON, 20, "SARDINE");
    Fish.HERRING = new Fish(345, 10, Chance_1.Chance.VERY_COMMON, 30, "HERRING");
    Fish.ANCHOVY = new Fish(321, 15, Chance_1.Chance.SOMETIMES, 40, "ANCHOVY");
    Fish.MACKEREL = new Fish(353, 16, Chance_1.Chance.VERY_COMMON, 20, "MACKEREL");
    Fish.CASKET = new Fish(405, 16, Chance_1.Chance.ALMOST_IMPOSSIBLE, 100, "CASKET");
    Fish.OYSTER = new Fish(407, 16, Chance_1.Chance.EXTREMELY_RARE, 80, "OYSTER");
    Fish.TROUT = new Fish(335, 20, Chance_1.Chance.VERY_COMMON, 50, "TROUT");
    Fish.COD = new Fish(341, 23, Chance_1.Chance.VERY_COMMON, 45, "COD");
    Fish.PIKE = new Fish(349, 25, Chance_1.Chance.VERY_COMMON, 60, "PIKE");
    Fish.SLIMY_EEL = new Fish(3379, 28, Chance_1.Chance.EXTREMELY_RARE, 65, "SLIMY_EEL");
    Fish.SALMON = new Fish(331, 30, Chance_1.Chance.VERY_COMMON, 70, "SALMON");
    Fish.TUNA = new Fish(359, 35, Chance_1.Chance.VERY_COMMON, 80, "TUNA");
    Fish.CAVE_EEL = new Fish(5001, 38, Chance_1.Chance.SOMETIMES, 80, "CAVE_EEL");
    Fish.LOBSTER = new Fish(377, 40, Chance_1.Chance.VERY_COMMON, 90, "LOBSTER");
    Fish.BASS = new Fish(363, 46, Chance_1.Chance.SOMETIMES, 100, "BASS");
    Fish.SWORDFISH = new Fish(371, 50, Chance_1.Chance.COMMON, 100, "SWORDFISH");
    Fish.LAVA_EEL = new Fish(2148, 53, Chance_1.Chance.VERY_COMMON, 60, "LAVA_EEL");
    Fish.SHARK = new Fish(383, 76, Chance_1.Chance.COMMON, 110, "SHARK");
    return Fish;
}());
var AttackToolRandomEvent = exports.AttackToolRandomEvent = /** @class */ (function (_super) {
    __extends(AttackToolRandomEvent, _super);
    function AttackToolRandomEvent(player, tool, fishSpot) {
        var _this = _super.call(this) || this;
        _this.player = player;
        _this.tool = tool;
        _this.fishSpot = fishSpot;
        _this.ticks = 0;
        _this.deletedTool = false;
        return _this;
    }
    AttackToolRandomEvent.prototype.execute = function () {
        switch (this.ticks) {
            case 0:
                // Fire projectile at player.
                Projectile_1.Projectile.createProjectile(this.fishSpot, this.player, AttackToolRandomEvent.PROJECTILE_ID, 40, 70, 31, 33).sendProjectile();
                break;
            case 2:
                // Defence animation..
                this.player.performAnimation(AttackToolRandomEvent.DEFENCE_ANIM);
                break;
            case 3:
                // Delete tool from inventory and put on ground..
                if (this.player.getInventory().contains(this.tool.getId())) {
                    this.player.getInventory().deleteNumber(this.tool.getId(), 1);
                    this.deletedTool = true;
                }
                break;
            case 4:
                // Spawn tool on ground if it was deleted from inventory..
                if (this.deletedTool) {
                    ItemOnGroundManager_1.ItemOnGroundManager.registers(this.player, new Item_1.Item(this.tool.getId()));
                    this.player
                        .getPacketSender()
                        .sendMessage("A big fish attacked and you were forced to drop your " +
                        ItemDefinition_1.ItemDefinition.forId(this.tool.getId()).getName().toLowerCase() +
                        ".");
                }
                this.stop();
                break;
        }
        this.ticks++;
    };
    AttackToolRandomEvent.DEFENCE_ANIM = new Animation_1.Animation(404);
    AttackToolRandomEvent.PROJECTILE_ID = 94;
    return AttackToolRandomEvent;
}(Task_1.Task));
var FishingTool = exports.FishingTool = /** @class */ (function () {
    function FishingTool(id, level, needed, speed, animation, fish) {
        this.id = id;
        this.level = level;
        this.needed = needed;
        this.speed = speed;
        this.animation = animation;
        this.fish = fish;
    }
    FishingTool.prototype.getId = function () {
        return this.id;
    };
    FishingTool.prototype.getLevel = function () {
        return this.level;
    };
    FishingTool.prototype.getNeeded = function () {
        return this.needed;
    };
    FishingTool.prototype.getSpeed = function () {
        return this.speed;
    };
    FishingTool.prototype.getAnimation = function () {
        return this.animation;
    };
    FishingTool.prototype.getFish = function () {
        return this.fish;
    };
    FishingTool.NET = new FishingTool(303, 1, -1, 3, 621, [Fish.SHRIMP, Fish.ANCHOVY]);
    FishingTool.BIG_NET = new FishingTool(305, 16, -1, 3, 620, [Fish.MACKEREL, Fish.OYSTER, Fish.COD, Fish.BASS, Fish.CASKET]);
    FishingTool.FISHING_ROD = new FishingTool(307, 5, 313, 1, 622, [Fish.SARDINE, Fish.HERRING, Fish.PIKE, Fish.SLIMY_EEL, Fish.CAVE_EEL, Fish.LAVA_EEL]);
    FishingTool.FLY_FISHING_ROD = new FishingTool(309, 20, 314, 1, 622, [Fish.TROUT, Fish.SALMON]);
    FishingTool.HARPOON = new FishingTool(311, 35, -1, 4, 618, [Fish.TUNA, Fish.SWORDFISH]);
    FishingTool.SHARK_HARPOON = new FishingTool(311, 35, -1, 6, 618, [Fish.SHARK]);
    FishingTool.LOBSTER_POT = new FishingTool(301, 40, -1, 4, 619, [Fish.LOBSTER]);
    return FishingTool;
}());
//# sourceMappingURL=Fishing.js.map