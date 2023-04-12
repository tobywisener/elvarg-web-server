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
exports.CombatInteraction = void 0;
var Food_1 = require("../../../../content/Food");
var PotionConsumable_1 = require("../../../../content/PotionConsumable");
var PrayerHandler_1 = require("../../../../content/PrayerHandler");
var CombatFactory_1 = require("../../../../content/combat/CombatFactory");
var Presetables_1 = require("../../../../content/presets/Presetables");
var ItemInSlot_1 = require("../../../../model/ItemInSlot");
var Skill_1 = require("../../../../model/Skill");
var TeleportHandler_1 = require("../../../../model/teleportation/TeleportHandler");
var TeleportType_1 = require("../../../../model/teleportation/TeleportType");
var Task_1 = require("../../../../task/Task");
var TaskManager_1 = require("../../../../task/TaskManager");
var ItemIdentifiers_1 = require("../../../../../util/ItemIdentifiers");
var Misc_1 = require("../../../../../util/Misc");
var CombatInteraction = /** @class */ (function () {
    function CombatInteraction(playerBot) {
        this.playerBot = playerBot;
    }
    CombatInteraction.prototype.process = function () {
        var e_1, _a;
        var _this = this;
        var fighterPreset = this.playerBot.getDefinition().getFighterPreset();
        var combatAttacker = this.playerBot.getCombat().getAttacker();
        if (combatAttacker != null) {
            this.attackTarget = combatAttacker;
        }
        var combatMethod = CombatFactory_1.CombatFactory.getMethod(this.playerBot);
        if (this.attackTarget != null) {
            if (CombatFactory_1.CombatFactory.canAttack(this.playerBot, combatMethod, this.attackTarget) != CombatFactory_1.CanAttackResponse.CAN_ATTACK) {
                this.attackTarget = null;
                this.playerBot.getCombat().setUnderAttack(null);
                return;
            }
            try {
                for (var _b = __values(fighterPreset.getCombatActions()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var combatAction = _c.value;
                    if (!combatAction.shouldPerform(this.playerBot, this.attackTarget)) {
                        continue;
                    }
                    combatAction.perform(this.playerBot, this.attackTarget);
                    if (combatAction.stopAfter()) {
                        break; // No need to process any more weapon switches
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
        }
        else {
            PrayerHandler_1.PrayerHandler.resetAll(this.playerBot);
        }
        if (this.playerBot.getHitpoints() <= 0) {
            return;
        }
        if (this.playerBot.getHitpoints() < 30) {
            this.handleEating(this.playerBot.getHitpoints());
        }
        var area = this.playerBot.getArea();
        if (area != null && area.getPlayers().some(function (p) { return CombatFactory_1.CombatFactory.canAttack(_this.playerBot, combatMethod, p) == CombatFactory_1.CanAttackResponse.CAN_ATTACK; })) {
            this.potUp();
        }
        if (this.attackTarget == null && this.playerBot.getHitpoints() > 0) {
            var shouldReset = (this.playerBot.getInventory().getFreeSlots() > 2
                || this.playerBot.getSpecialPercentage() < 76)
                && this.playerBot.getWildernessLevel() > 0;
            if (shouldReset) {
                this.reset();
            }
        }
    };
    CombatInteraction.prototype.potUp = function () {
        var _this = this;
        //Boost health
        if (!this.playerBot.getSkillManager().isBoosted(Skill_1.Skill.HITPOINTS)) {
            var fish = ItemInSlot_1.ItemInSlot.getFromInventory(ItemIdentifiers_1.ItemIdentifiers.ANGLERFISH, this.playerBot.getInventory());
            if (fish != null) {
                Food_1.Food.consume(this.playerBot, fish.getId(), fish.getSlot());
                return;
            }
        }
        // Boost range
        if (!this.playerBot.getSkillManager().isBoosted(Skill_1.Skill.RANGED)) {
            var pot = PotionConsumable_1.PotionConsumable.RANGE_POTIONS.getIds().map(function (id) { return ItemInSlot_1.ItemInSlot.getFromInventory(id, _this.playerBot.getInventory()); })
                .filter(function (item) { return item != null; })
                .find(function (p) { return p; });
            if (pot) {
                PotionConsumable_1.PotionConsumable.drink(this.playerBot, pot.getId(), pot.getSlot());
                return;
            }
        }
        // Boost all
        if (!this.playerBot.getSkillManager().isBoosted(Skill_1.Skill.STRENGTH)) {
            var pot = PotionConsumable_1.PotionConsumable.SUPER_COMBAT_POTIONS.getIds().map(function (id) { return ItemInSlot_1.ItemInSlot.getFromInventory(id, _this.playerBot.getInventory()); })
                .filter(function (item) { return item != null; })
                .find(function (p) { return p; });
            if (pot) {
                PotionConsumable_1.PotionConsumable.drink(this.playerBot, pot.getId(), pot.getSlot());
                return;
            }
        }
        // Boost strength
        if (!this.playerBot.getSkillManager().isBoosted(Skill_1.Skill.STRENGTH)) {
            var pot = PotionConsumable_1.PotionConsumable.SUPER_STRENGTH_POTIONS.getIds().map(function (id) { return ItemInSlot_1.ItemInSlot.getFromInventory(id, _this.playerBot.getInventory()); })
                .filter(function (item) { return item !== null; })
                .find(function (p) { return p; });
            if (pot) {
                PotionConsumable_1.PotionConsumable.drink(this.playerBot, pot.getId(), pot.getSlot());
                return;
            }
        }
        //Boost attack
        if (!this.playerBot.getSkillManager().isBoosted(Skill_1.Skill.ATTACK)) {
            var pot = PotionConsumable_1.PotionConsumable.SUPER_ATTACK_POTIONS.getIds()
                .map(function (id) { return ItemInSlot_1.ItemInSlot.getFromInventory(id, _this.playerBot.getInventory()); })
                .filter(Boolean)
                .find(function () { return true; });
            if (pot) {
                PotionConsumable_1.PotionConsumable.drink(this.playerBot, pot.getId(), pot.getSlot());
                return;
            }
        }
    };
    // Called when the PlayerBot takes damage
    CombatInteraction.prototype.takenDamage = function (damage, attacker) {
        var finalHitpoints = this.playerBot.getHitpoints() - damage;
        if (finalHitpoints <= 0 || attacker == null) {
            // We're already gonna be dead XD
            return;
        }
        this.handleEating(finalHitpoints);
    };
    CombatInteraction.prototype.handleEating = function (finalHitpoints) {
        var fighterPreset = this.playerBot.getDefinition().getFighterPreset();
        var max = this.playerBot.getSkillManager().getMaxLevel(Skill_1.Skill.HITPOINTS);
        if (finalHitpoints <= (max * fighterPreset.eatAtPercent()) / 100) {
            // Player Bot needs to eat
            var edible = this.edibleItemSlot();
            if (edible == null) {
                return;
            }
            Food_1.Food.consume(this.playerBot, edible.getId(), edible.getSlot());
            if (edible.getId() != ItemIdentifiers_1.ItemIdentifiers.COOKED_KARAMBWAN) {
                var karambwan = ItemInSlot_1.ItemInSlot.getFromInventory(ItemIdentifiers_1.ItemIdentifiers.COOKED_KARAMBWAN, this.playerBot.getInventory());
                if (karambwan != null) {
                    Food_1.Food.consume(this.playerBot, karambwan.getId(), karambwan.getSlot());
                }
            }
        }
    };
    CombatInteraction.prototype.edibleItemSlot = function () {
        var _this = this;
        var edible = Array.from(Object.values(Food_1.Edible))
            .map(function (food) { return ItemInSlot_1.ItemInSlot.getFromInventory(food.getItem().getId(), _this.playerBot.getInventory()); })
            .filter(function (item) { return item != null; })
            .find(function (x) { return x; });
        return edible;
    };
    // Called when the Player Bot is just about to die
    CombatInteraction.prototype.handleDying = function (killer) {
        if (killer) {
            this.playerBot.sendChat("Gf " + killer.getUsername());
        }
    };
    // Called when the Player Bot has died
    CombatInteraction.prototype.handleDeath = function (killer) {
        this.playerBot.setFollowing(null);
        this.playerBot.getCombat().setUnderAttack(null);
        TaskManager_1.TaskManager.submit(new MyTask(Misc_1.Misc.randomInclusive(10, 20), this.playerBot, false));
    };
    // Called when this bot is assigned a Player target in the wilderness
    CombatInteraction.prototype.targetAssigned = function (target) {
        if (this.playerBot.getArea() == null || this.playerBot.getArea().getPlayers().length > 1 || Misc_1.Misc.randomInclusive(1, 3) != 1) {
            // Don't attack if there's another real player in the same area, and attack 1/3 times
            return;
        }
        this.playerBot.getCombat().attack(target);
    };
    CombatInteraction.prototype.reset = function () {
        // Reset bot's auto retaliate
        this.playerBot.setAutoRetaliate(true);
        // Load this Bot's preset
        Presetables_1.Presetables.load(this.playerBot, this.playerBot.getDefinition().getFighterPreset().getItemPreset());
        // Teleport this bot back to their home location after some time
        TeleportHandler_1.TeleportHandler.teleport(this.playerBot, this.playerBot.getDefinition().getSpawnLocation(), TeleportType_1.TeleportType.NORMAL, false);
    };
    return CombatInteraction;
}());
exports.CombatInteraction = CombatInteraction;
var MyTask = /** @class */ (function (_super) {
    __extends(MyTask, _super);
    function MyTask(delay, playerBot, isImmediate) {
        return _super.call(this, delay, isImmediate) || this;
    }
    MyTask.prototype.execute = function () {
        this.reset();
        this.stop();
    };
    MyTask.prototype.reset = function () {
    };
    return MyTask;
}(Task_1.Task));
//# sourceMappingURL=CombatInteraction.js.map