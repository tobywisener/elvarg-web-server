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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rune = exports.PouchContainer = exports.Pouch = exports.Runecrafting = void 0;
var ItemIdentifiers_1 = require("../../../../../util/ItemIdentifiers");
var Skill_1 = require("../../../../model/Skill");
var PetHandler_1 = require("../../../PetHandler");
var Graphic_1 = require("../../../../model/Graphic");
var Animation_1 = require("../../../../model/Animation");
var TeleportHandler_1 = require("../../../../model/teleportation/TeleportHandler");
var Location_1 = require("../../../../model/Location");
var Runecrafting = exports.Runecrafting = /** @class */ (function () {
    function Runecrafting() {
    }
    Runecrafting.initialize = function (player, objectId) {
        var rune = Rune.forId(objectId);
        if (rune) {
            if (player.getSkillManager().getCurrentLevel(Skill_1.Skill.RUNECRAFTING) < rune.getLevelRequirement()) {
                player.getPacketSender().sendMessage("You need a Runecrafting level of at least "
                    + rune.getLevelRequirement() + " to craft this.");
                return false;
            }
            var essence = void 0;
            if (rune.isPureRequired()) {
                if (!player.getInventory().contains(ItemIdentifiers_1.ItemIdentifiers.PURE_ESSENCE)) {
                    player.getPacketSender().sendMessage("You need Pure essence to craft runes using this altar.");
                    return true;
                }
                essence = ItemIdentifiers_1.ItemIdentifiers.PURE_ESSENCE;
            }
            else {
                if (player.getInventory().contains(ItemIdentifiers_1.ItemIdentifiers.RUNE_ESSENCE)) {
                    essence = ItemIdentifiers_1.ItemIdentifiers.RUNE_ESSENCE;
                }
                else if (player.getInventory().contains(ItemIdentifiers_1.ItemIdentifiers.PURE_ESSENCE)) {
                    essence = ItemIdentifiers_1.ItemIdentifiers.PURE_ESSENCE;
                }
                else {
                    player.getPacketSender().sendMessage("You don't have any essence in your inventory.");
                    return true;
                }
            }
            player.performGraphic(Runecrafting.CRAFT_RUNES_GRAPHIC);
            player.performAnimation(Runecrafting.CRAFT_RUNES_ANIMATION);
            var craftAmount = this.craftAmount(Rune.forId(0), player);
            var xpGain = 0;
            for (var i = 0; i < 28; i++) {
                if (!player.getInventory().contains(essence)) {
                    break;
                }
                player.getInventory().deleteNumber(essence, 1);
                player.getInventory().adds(rune.getRuneID(), craftAmount);
                xpGain += rune.getXP();
            }
            // Finally add the total experience they gained..
            player.getSkillManager().addExperiences(Skill_1.Skill.RUNECRAFTING, xpGain);
            // Pets..
            PetHandler_1.PetHandler.onSkill(player, Skill_1.Skill.RUNECRAFTING);
        }
        return false;
    };
    Runecrafting.handleTalisman = function (player, itemId) {
        var talisman = Talisman.forId(itemId);
        if (talisman) {
            if (player.getSkillManager().getMaxLevel(Skill_1.Skill.RUNECRAFTING) < talisman.getLevelRequirement()) {
                player.getPacketSender().sendMessage("You need a Runecrafting level of at least ".concat(talisman.getLevelRequirement(), " to use this Talisman's teleport function."));
            }
            else {
                if (TeleportHandler_1.TeleportHandler.checkReqs(player, talisman.getPosition())) {
                    TeleportHandler_1.TeleportHandler.teleport(player, talisman.getPosition(), player.getSpellbook().getTeleportType(), true);
                }
            }
            return true;
        }
        return false;
    };
    Runecrafting.handlePouch = function (player, itemId, actionType) {
        var e_1, _a;
        var pouch = Pouch.forItemId(itemId);
        if (pouch) {
            var container = void 0;
            try {
                for (var _b = __values(player.getPouches()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var pC = _c.value;
                    if (pC.getPouch() == pouch) {
                        container = pC;
                        break;
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
            if (container) {
                switch (actionType) {
                    case 1:
                        container.store(player);
                        break;
                    case 2:
                        container.check(player);
                        break;
                    case 3:
                        container.withdraw(player);
                        break;
                }
                return true;
            }
        }
        return false;
    };
    Runecrafting.craftAmount = function (rune, player) {
        var amount = 1;
        switch (rune) {
            case Rune.AIR_RUNE:
                if (player.getSkillManager().getMaxLevel(Skill_1.Skill.RUNECRAFTING) >= 11)
                    amount = 2;
                if (player.getSkillManager().getMaxLevel(Skill_1.Skill.RUNECRAFTING) >= 22)
                    amount = 3;
                if (player.getSkillManager().getMaxLevel(Skill_1.Skill.RUNECRAFTING) >= 33)
                    amount = 4;
                if (player.getSkillManager().getMaxLevel(Skill_1.Skill.RUNECRAFTING) >= 44)
                    amount = 5;
                if (player.getSkillManager().getMaxLevel(Skill_1.Skill.RUNECRAFTING) >= 55)
                    amount = 6;
                if (player.getSkillManager().getMaxLevel(Skill_1.Skill.RUNECRAFTING) >= 66)
                    amount = 7;
                if (player.getSkillManager().getMaxLevel(Skill_1.Skill.RUNECRAFTING) >= 77)
                    amount = 8;
                if (player.getSkillManager().getMaxLevel(Skill_1.Skill.RUNECRAFTING) >= 88)
                    amount = 9;
                if (player.getSkillManager().getMaxLevel(Skill_1.Skill.RUNECRAFTING) >= 99)
                    if (player.getSkillManager().getMaxLevel(Skill_1.Skill.RUNECRAFTING) >= 99)
                        amount = 10;
                break;
            case Rune.ASTRAL_RUNE:
                if (player.getSkillManager().getMaxLevel(Skill_1.Skill.RUNECRAFTING) >= 82)
                    amount = 2;
                break;
            case Rune.BLOOD_RUNE:
                break;
            case Rune.BODY_RUNE:
                if (player.getSkillManager().getMaxLevel(Skill_1.Skill.RUNECRAFTING) >= 46)
                    amount = 2;
                if (player.getSkillManager().getMaxLevel(Skill_1.Skill.RUNECRAFTING) >= 92)
                    amount = 3;
                break;
            case Rune.CHAOS_RUNE:
                if (player.getSkillManager().getMaxLevel(Skill_1.Skill.RUNECRAFTING) >= 74)
                    amount = 2;
                break;
            case Rune.COSMIC_RUNE:
                if (player.getSkillManager().getMaxLevel(Skill_1.Skill.RUNECRAFTING) >= 59)
                    amount = 2;
                break;
            case Rune.DEATH_RUNE:
                break;
            case Rune.EARTH_RUNE:
                if (player.getSkillManager().getMaxLevel(Skill_1.Skill.RUNECRAFTING) >= 26)
                    amount = 2;
                if (player.getSkillManager().getMaxLevel(Skill_1.Skill.RUNECRAFTING) >= 52)
                    amount = 3;
                if (player.getSkillManager().getMaxLevel(Skill_1.Skill.RUNECRAFTING) >= 78)
                    amount = 4;
                break;
            case Rune.FIRE_RUNE:
                if (player.getSkillManager().getMaxLevel(Skill_1.Skill.RUNECRAFTING) >= 35)
                    amount = 2;
                if (player.getSkillManager().getMaxLevel(Skill_1.Skill.RUNECRAFTING) >= 70)
                    amount = 3;
                break;
            case Rune.LAW_RUNE:
                break;
            case Rune.MIND_RUNE:
                if (player.getSkillManager().getMaxLevel(Skill_1.Skill.RUNECRAFTING) >= 14)
                    amount = 2;
                if (player.getSkillManager().getMaxLevel(Skill_1.Skill.RUNECRAFTING) >= 28)
                    amount = 3;
                if (player.getSkillManager().getMaxLevel(Skill_1.Skill.RUNECRAFTING) >= 42)
                    amount = 4;
                if (player.getSkillManager().getMaxLevel(Skill_1.Skill.RUNECRAFTING) >= 56)
                    amount = 5;
                if (player.getSkillManager().getMaxLevel(Skill_1.Skill.RUNECRAFTING) >= 70)
                    amount = 6;
                if (player.getSkillManager().getMaxLevel(Skill_1.Skill.RUNECRAFTING) >= 84)
                    amount = 7;
                if (player.getSkillManager().getMaxLevel(Skill_1.Skill.RUNECRAFTING) >= 98)
                    amount = 8;
                break;
            case Rune.NATURE_RUNE:
                if (player.getSkillManager().getMaxLevel(Skill_1.Skill.RUNECRAFTING) >= 91)
                    amount = 2;
                break;
            case Rune.WATER_RUNE:
                if (player.getSkillManager().getMaxLevel(Skill_1.Skill.RUNECRAFTING) >= 19)
                    amount = 2;
                if (player.getSkillManager().getMaxLevel(Skill_1.Skill.RUNECRAFTING) >= 38)
                    amount = 3;
                if (player.getSkillManager().getMaxLevel(Skill_1.Skill.RUNECRAFTING) >= 57)
                    amount = 4;
                if (player.getSkillManager().getMaxLevel(Skill_1.Skill.RUNECRAFTING) >= 76)
                    amount = 5;
                if (player.getSkillManager().getMaxLevel(Skill_1.Skill.RUNECRAFTING) >= 95)
                    amount = 6;
                break;
            default:
                break;
        }
        return amount;
    };
    Runecrafting.CRAFT_RUNES_GRAPHIC = new Graphic_1.Graphic(186);
    Runecrafting.CRAFT_RUNES_ANIMATION = new Animation_1.Animation(791);
    return Runecrafting;
}());
var Talisman = /** @class */ (function () {
    function Talisman(talismanId, levelReq, location) {
        this.talismanId = talismanId;
        this.levelReq = levelReq;
        this.location = location;
    }
    Talisman.initialize = function () {
        var _this = this;
        Object.values(Talisman).forEach(function (t) {
            _this.talismans.set(t.talismanId, t);
        });
    };
    Talisman.forId = function (itemId) {
        return this.talismans.get(itemId);
    };
    Talisman.prototype.getItemId = function () {
        return this.talismanId;
    };
    Talisman.prototype.getLevelRequirement = function () {
        return this.levelReq;
    };
    Talisman.prototype.getPosition = function () {
        return this.location.clone();
    };
    Talisman.AIR_TALISMAN = new Talisman(1438, 1, new Location_1.Location(2841, 4828));
    Talisman.MIND_TALISMAN = new Talisman(1448, 2, new Location_1.Location(2793, 4827));
    Talisman.WATER_TALISMAN = new Talisman(1444, 5, new Location_1.Location(2720, 4831));
    Talisman.EARTH_TALISMAN = new Talisman(1440, 9, new Location_1.Location(2655, 4829));
    Talisman.FIRE_TALISMAN = new Talisman(1442, 14, new Location_1.Location(2576, 4846));
    Talisman.BODY_TALISMAN = new Talisman(1446, 20, new Location_1.Location(2522, 4833));
    Talisman.COSMIC_TALISMAN = new Talisman(1454, 27, new Location_1.Location(2163, 4833));
    Talisman.CHAOS_TALISMAN = new Talisman(1452, 35, new Location_1.Location(2282, 4837));
    Talisman.NATURE_TALISMAN = new Talisman(1462, 44, new Location_1.Location(2400, 4834));
    Talisman.LAW_TALISMAN = new Talisman(1458, 54, new Location_1.Location(2464, 4817));
    Talisman.DEATH_TALISMAN = new Talisman(1456, 65, new Location_1.Location(2208, 4829));
    Talisman.BLOOD_TALISMAN = new Talisman(1450, 77, new Location_1.Location(1722, 3826));
    Talisman.talismans = new Map();
    return Talisman;
}());
var Pouch = exports.Pouch = /** @class */ (function () {
    function Pouch(itemId, requiredLevel, capacity, decayChance) {
        this.itemId = itemId;
        this.requiredLevel = requiredLevel;
        this.capacity = capacity;
        this.decayChance = decayChance;
    }
    Pouch.initialize = function () {
        var e_2, _a;
        try {
            for (var _b = __values(Object.values(Pouch)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var p = _c.value;
                Pouch.pouches.set(p.itemId, p);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    Pouch.forItemId = function (itemId) {
        return Pouch.pouches.get(itemId);
    };
    Pouch.prototype.getitemId = function () {
        return this.itemId;
    };
    Pouch.prototype.getrequiredLevel = function () {
        return this.requiredLevel;
    };
    Pouch.prototype.getcapacity = function () {
        return this.capacity;
    };
    Pouch.prototype.getdecayChance = function () {
        return this.decayChance;
    };
    Pouch.pouches = new Map();
    Pouch.SMALL_POUCH = new Pouch(5509, 1, 3, -1);
    Pouch.MEDIUM_POUCH = new Pouch(5510, 25, 6, 45);
    Pouch.LARGE_POUCH = new Pouch(5512, 50, 9, 29);
    Pouch.GIANT_POUCH = new Pouch(5514, 75, 12, 10);
    return Pouch;
}());
var PouchContainer = /** @class */ (function () {
    function PouchContainer(pouch, runeEssence, pureEssence) {
        this.pouch = pouch;
        this.runeEssenceAmt = runeEssence;
        this.pureEssenceAmt = pureEssence;
    }
    PouchContainer.prototype.store = function (player) {
        if (this.getStoredAmount() >= this.pouch.capacity) {
            player.sendMessage("Your pouch is already full.");
            return;
        }
        if (player.getSkillManager().getMaxLevel(Skill_1.Skill.RUNECRAFTING) < this.pouch.requiredLevel) {
            player.sendMessage("You need a Runecrafting level of at least " +
                this.pouch.requiredLevel +
                " to use this.");
            return;
        }
        for (var i = this.getStoredAmount(); i < this.pouch.capacity; i++) {
            if (player.getInventory().contains(ItemIdentifiers_1.ItemIdentifiers.PURE_ESSENCE)) {
                player.getInventory().deleteNumber(ItemIdentifiers_1.ItemIdentifiers.PURE_ESSENCE, 1);
                this.pureEssenceAmt++;
            }
            else if (player.getInventory().contains(ItemIdentifiers_1.ItemIdentifiers.RUNE_ESSENCE)) {
                player.getInventory().deleteNumber(ItemIdentifiers_1.ItemIdentifiers.RUNE_ESSENCE, 1);
                this.runeEssenceAmt++;
            }
            else {
                player.getPacketSender().sendMessage("You don't have any more essence to store.");
                break;
            }
        }
    };
    PouchContainer.prototype.withdraw = function (player) {
        var total = this.getStoredAmount();
        if (total === 0) {
            player.sendMessage("Your pouch is already empty.");
            return;
        }
        for (var i = 0; i < total; i++) {
            if (player.getInventory().isFull()) {
                player.getInventory().full();
                break;
            }
            if (this.pureEssenceAmt > 0) {
                player.getInventory().adds(ItemIdentifiers_1.ItemIdentifiers.PURE_ESSENCE, 1);
                this.pureEssenceAmt--;
            }
            else if (this.runeEssenceAmt > 0) {
                player.getInventory().adds(ItemIdentifiers_1.ItemIdentifiers.RUNE_ESSENCE, 1);
                this.runeEssenceAmt--;
            }
            else {
                player.getPacketSender().sendMessage("You don't have any more essence to withdraw.");
                break;
            }
        }
    };
    PouchContainer.prototype.check = function (player) {
        player.sendMessage("Your " +
            this.pouch.toString().replace("_", " ") +
            " contains " +
            this.runeEssenceAmt +
            " Rune essence and " +
            this.pureEssenceAmt +
            " Pure essence.");
    };
    PouchContainer.prototype.getStoredAmount = function () {
        return this.runeEssenceAmt + this.pureEssenceAmt;
    };
    PouchContainer.prototype.getStoredRuneEssence = function () {
        return this.runeEssenceAmt;
    };
    PouchContainer.prototype.getStoredPureEssence = function () {
        return this.pureEssenceAmt;
    };
    PouchContainer.prototype.getPouch = function () {
        return this.pouch;
    };
    return PouchContainer;
}());
exports.PouchContainer = PouchContainer;
var Rune = exports.Rune = /** @class */ (function () {
    function Rune(rune, levelReq, xpReward, altarObjectID, pureRequired) {
        this.runeID = rune;
        this.levelReq = levelReq;
        this.xpReward = xpReward;
        this.objectId = altarObjectID;
        this.pureRequired = pureRequired;
    }
    Rune.forId = function (objectId) {
        return this.runes.get(objectId);
    };
    Rune.prototype.getRuneID = function () {
        return this.runeID;
    };
    Rune.prototype.getLevelRequirement = function () {
        return this.levelReq;
    };
    Rune.prototype.getXP = function () {
        return this.xpReward;
    };
    Rune.prototype.getObjectId = function () {
        return this.objectId;
    };
    Rune.prototype.isPureRequired = function () {
        return this.pureRequired;
    };
    var _a;
    _a = Rune;
    Rune.AIR_RUNE = new Rune(556, 1, 5, 14897, false);
    Rune.MIND_RUNE = new Rune(558, 2, 6, 14898, false);
    Rune.WATER_RUNE = new Rune(555, 5, 7, 14899, false);
    Rune.EARTH_RUNE = new Rune(557, 9, 8, 14900, false);
    Rune.FIRE_RUNE = new Rune(554, 14, 9, 14901, false);
    Rune.BODY_RUNE = new Rune(559, 20, 10, 14902, false);
    Rune.COSMIC_RUNE = new Rune(564, 27, 11, 14903, true);
    Rune.CHAOS_RUNE = new Rune(562, 35, 12, 14906, true);
    Rune.ASTRAL_RUNE = new Rune(9075, 40, 13, 14911, true);
    Rune.NATURE_RUNE = new Rune(561, 44, 14, 14905, true);
    Rune.LAW_RUNE = new Rune(563, 54, 15, 14904, true);
    Rune.DEATH_RUNE = new Rune(560, 65, 16, 14907, true);
    Rune.BLOOD_RUNE = new Rune(565, 75, 27, 27978, true);
    Rune.runes = new Map();
    (function () {
        var e_3, _b;
        try {
            for (var _c = __values(Object.values(Rune)), _d = _c.next(); !_d.done; _d = _c.next()) {
                var rune = _d.value;
                _a.runes.set(rune.getObjectId(), rune);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
            }
            finally { if (e_3) throw e_3.error; }
        }
    })();
    return Rune;
}());
//# sourceMappingURL=Runecrafting.js.map