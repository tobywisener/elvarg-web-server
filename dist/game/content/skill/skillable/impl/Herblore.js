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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Herblore = void 0;
var Item_1 = require("../../../../model/Item");
var ItemIdentifiers_1 = require("../../../../../util/ItemIdentifiers");
var ItemCreationSkillable_1 = require("./ItemCreationSkillable");
var CreationMenu_1 = require("../../../../model/menu/CreationMenu");
var RequiredItem_1 = require("../../../../model/RequiredItem");
var AnimationLoop_1 = require("../../../../model/AnimationLoop");
var Skill_1 = require("../../../../model/Skill");
var Animation_1 = require("../../../../model/Animation");
var HerbloreAction = /** @class */ (function () {
    function HerbloreAction(execFunc) {
        this.execFunc = execFunc;
    }
    HerbloreAction.prototype.execute = function (item, amount) {
        this.execFunc();
    };
    return HerbloreAction;
}());
var Herblore = exports.Herblore = /** @class */ (function (_super) {
    __extends(Herblore, _super);
    function Herblore() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Herblore.concatenate = function (player, itemUsed, usedOn) {
        if (!(itemUsed.getDefinition().getName().includes("(") && usedOn.getDefinition().getName().includes(")"))) {
            return false;
        }
        var dose = PotionDose.forId(itemUsed.getId());
        if (dose) {
            if (dose.getDoseForID(usedOn.getId()) > 0) {
                var firstPotAmount = dose.getDoseForID(itemUsed.getId());
                var secondPotAmount = dose.getDoseForID(usedOn.getId());
                if (firstPotAmount + secondPotAmount <= 4) {
                    player.getInventory().deleteItem(itemUsed, 1);
                    player.getInventory().deleteItem(usedOn, 1);
                    player.getInventory().adds(dose.getIDForDose(firstPotAmount + secondPotAmount), 1);
                    player.getInventory().adds(Herblore.EMPTY_VIAL, 1);
                }
                else {
                    var overflow = (firstPotAmount + secondPotAmount) - 4;
                    player.getInventory().deleteItem(itemUsed, 1);
                    player.getInventory().deleteItem(usedOn, 1);
                    player.getInventory().adds(dose.getIDForDose(4), 1);
                    player.getInventory().adds(dose.getIDForDose(overflow), 1);
                }
                return true;
            }
        }
        return false;
    };
    Herblore.makeUnfinishedPotion = function (player, itemUsed, usedWith) {
        if (itemUsed == ItemIdentifiers_1.ItemIdentifiers.VIAL_OF_WATER || usedWith == ItemIdentifiers_1.ItemIdentifiers.VIAL_OF_WATER) {
            var herb = itemUsed == ItemIdentifiers_1.ItemIdentifiers.VIAL_OF_WATER ? usedWith : itemUsed;
            var unfinished_1 = UnfinishedPotion.potions.get(herb);
            if (unfinished_1 != null) {
                player.getPacketSender().sendCreationMenu(new CreationMenu_1.CreationMenu("How many potions would you like to make?", [unfinished_1.getUnfPotion()], new HerbloreAction(function (itemId, amount) {
                    var skillable = new ItemCreationSkillable_1.ItemCreationSkillable([new RequiredItem_1.RequiredItem(new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.VIAL_OF_WATER), true), new RequiredItem_1.RequiredItem(new Item_1.Item(unfinished_1.getHerbNeeded()), true)], new Item_1.Item(unfinished_1.getUnfPotion()), amount, new AnimationLoop_1.AnimationLoop(Herblore.ANIMATION, 4), unfinished_1.getLevelReq(), 10, Skill_1.Skill.HERBLORE);
                    player.getSkillManager().startSkillable(skillable);
                })));
                return true;
            }
        }
        return false;
    };
    Herblore.finishPotion = function (player, itemUsed, usedWith) {
        var finished = FinishedPotion.forId(itemUsed, usedWith);
        if (finished != null) {
            player.getPacketSender().sendCreationMenu(new CreationMenu_1.CreationMenu("How many potions would you like to make?", [finished.getFinishedPotion()], new HerbloreAction(function (itemId, amount) {
                var skillable = new ItemCreationSkillable_1.ItemCreationSkillable([new RequiredItem_1.RequiredItem(new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.VIAL_OF_WATER), true), new RequiredItem_1.RequiredItem(new Item_1.Item(finished.getItemNeeded()), true)], new Item_1.Item(finished.getFinishedPotion()), amount, new AnimationLoop_1.AnimationLoop(Herblore.ANIMATION, 4), finished.getLevelReq(), 10, Skill_1.Skill.HERBLORE);
                player.getSkillManager().startSkillable(skillable);
            })));
            return true;
        }
        return false;
    };
    Herblore.cleanHerb = function (player, itemId) {
        var herb = CleanableHerb.herbs.get(itemId);
        if (herb != null) {
            if (player.getInventory().contains(herb.getGrimyHerb())) {
                if (player.getSkillManager().getCurrentLevel(Skill_1.Skill.HERBLORE) < herb.getLevelReq()) {
                    player.getPacketSender().sendMessage("You need a Herblore level of at least ".concat(herb.getLevelReq(), " to clean this leaf."));
                }
                else {
                    if (player.getClickDelay().elapsedTime(150)) {
                        player.getInventory().deleteNumber(herb.getGrimyHerb(), 1);
                        player.getInventory().adds(herb.getCleanHerb(), 1);
                        player.getSkillManager().addExperiences(Skill_1.Skill.HERBLORE, herb.getExp());
                        player.getPacketSender().sendMessage("You clean the dirt off the leaf.");
                        player.getClickDelay().reset();
                    }
                }
            }
            return true;
        }
        return false;
    };
    Herblore.ANIMATION = new Animation_1.Animation(363);
    return Herblore;
}(ItemIdentifiers_1.ItemIdentifiers));
var CleanableHerb = /** @class */ (function () {
    function CleanableHerb(grimyHerb, cleanHerb, levelReq, cleaningExp) {
        this.GUAM = new CleanableHerb(199, 249, 1, 2);
        this.MARRENTILL = new CleanableHerb(201, 251, 5, 4);
        this.TARROMIN = new CleanableHerb(203, 253, 11, 5);
        this.HARRALANDER = new CleanableHerb(205, 255, 20, 6);
        this.RANARR = new CleanableHerb(207, 257, 25, 7);
        this.TOADFLAX = new CleanableHerb(3049, 2998, 30, 8);
        this.SPIRITWEED = new CleanableHerb(12174, 12172, 35, 9);
        this.IRIT = new CleanableHerb(209, 259, 40, 10);
        this.WERGALI = new CleanableHerb(14836, 14854, 30, 11);
        this.AVANTOE = new CleanableHerb(211, 261, 48, 12);
        this.KWUARM = new CleanableHerb(213, 263, 54, 13);
        this.SNAPDRAGON = new CleanableHerb(3051, 3000, 59, 13);
        this.CADANTINE = new CleanableHerb(215, 265, 65, 14);
        this.LANTADYME = new CleanableHerb(2485, 2481, 67, 16);
        this.DWARFWEED = new CleanableHerb(217, 267, 70, 18);
        this.TORSTOL = new CleanableHerb(219, 269, 75, 21);
        this.grimyHerb = grimyHerb;
        this.cleanHerb = cleanHerb;
        this.levelReq = levelReq;
        this.cleaningExp = cleaningExp;
    }
    CleanableHerb.initialize = function () {
        var e_1, _a;
        try {
            for (var _b = __values(Object.values(CleanableHerb)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var herb = _c.value;
                CleanableHerb.herbs.set(herb.grimyHerb, herb);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    CleanableHerb.prototype.getGrimyHerb = function () {
        return this.grimyHerb;
    };
    CleanableHerb.prototype.getCleanHerb = function () {
        return this.cleanHerb;
    };
    CleanableHerb.prototype.getLevelReq = function () {
        return this.levelReq;
    };
    CleanableHerb.prototype.getExp = function () {
        return this.cleaningExp;
    };
    CleanableHerb.herbs = new Map();
    return CleanableHerb;
}());
var UnfinishedPotion = /** @class */ (function () {
    function UnfinishedPotion(unfinishedPotion, herbNeeded, levelReq) {
        this.GUAM_POTION = new UnfinishedPotion(91, 249, 1);
        this.MARRENTILL_POTION = new UnfinishedPotion(93, 251, 5);
        this.TARROMIN_POTION = new UnfinishedPotion(95, 253, 12);
        this.HARRALANDER_POTION = new UnfinishedPotion(97, 255, 22);
        this.RANARR_POTION = new UnfinishedPotion(99, 257, 30);
        this.TOADFLAX_POTION = new UnfinishedPotion(3002, 2998, 34);
        this.SPIRIT_WEED_POTION = new UnfinishedPotion(12181, 12172, 40);
        this.IRIT_POTION = new UnfinishedPotion(101, 259, 45);
        this.WERGALI_POTION = new UnfinishedPotion(14856, 14854, 1);
        this.AVANTOE_POTION = new UnfinishedPotion(103, 261, 50);
        this.KWUARM_POTION = new UnfinishedPotion(105, 263, 55);
        this.SNAPDRAGON_POTION = new UnfinishedPotion(3004, 3000, 63);
        this.CADANTINE_POTION = new UnfinishedPotion(107, 265, 66);
        this.LANTADYME = new UnfinishedPotion(2483, 2481, 69);
        this.DWARF_WEED_POTION = new UnfinishedPotion(109, 267, 72);
        this.TORSTOL_POTION = new UnfinishedPotion(111, 269, 78);
        this.unfinishedPotion = unfinishedPotion;
        this.herbNeeded = herbNeeded;
        this.levelReq = levelReq;
    }
    UnfinishedPotion.initialize = function () {
        var e_2, _a;
        try {
            for (var _b = __values(Object.values(UnfinishedPotion)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var potion = _c.value;
                this.potions.set(potion.herbNeeded, potion);
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
    UnfinishedPotion.prototype.getUnfPotion = function () {
        return this.unfinishedPotion;
    };
    UnfinishedPotion.prototype.getHerbNeeded = function () {
        return this.herbNeeded;
    };
    UnfinishedPotion.prototype.getLevelReq = function () {
        return this.levelReq;
    };
    UnfinishedPotion.potions = new Map();
    return UnfinishedPotion;
}());
var FinishedPotion = /** @class */ (function () {
    function FinishedPotion(finishedPotion, unfinishedPotion, itemNeeded, levelReq, expGained) {
        this.ATTACK_POTION = new FinishedPotion(121, 91, 221, 1, 25);
        this.ANTIPOISON = new FinishedPotion(175, 93, 235, 5, 38);
        this.STRENGTH_POTION = new FinishedPotion(115, 95, 225, 12, 50);
        this.RESTORE_POTION = new FinishedPotion(127, 97, 223, 22, 63);
        this.ENERGY_POTION = new FinishedPotion(3010, 97, 1975, 26, 68);
        this.DEFENCE_POTION = new FinishedPotion(133, 99, 239, 30, 75);
        this.AGILITY_POTION = new FinishedPotion(3034, 3002, 2152, 34, 80);
        this.COMBAT_POTION = new FinishedPotion(9741, 97, 9736, 36, 84);
        this.PRAYER_POTION = new FinishedPotion(139, 99, 231, 38, 88);
        this.SUMMONING_POTION = new FinishedPotion(12142, 12181, 12109, 40, 92);
        this.CRAFTING_POTION = new FinishedPotion(14840, 14856, 5004, 42, 92);
        this.SUPER_ATTACK = new FinishedPotion(145, 101, 221, 45, 100);
        this.VIAL_OF_STENCH = new FinishedPotion(18661, 101, 1871, 46, 0);
        this.FISHING_POTION = new FinishedPotion(181, 101, 231, 48, 106);
        this.SUPER_ENERGY = new FinishedPotion(3018, 103, 2970, 52, 118);
        this.SUPER_STRENGTH = new FinishedPotion(157, 105, 225, 55, 125);
        this.WEAPON_POISON = new FinishedPotion(187, 105, 241, 60, 138);
        this.SUPER_RESTORE = new FinishedPotion(3026, 3004, 223, 63, 143);
        this.SUPER_DEFENCE = new FinishedPotion(163, 107, 239, 66, 150);
        this.ANTIFIRE = new FinishedPotion(2454, 2483, 241, 69, 158);
        this.RANGING_POTION = new FinishedPotion(169, 109, 245, 72, 163);
        this.MAGIC_POTION = new FinishedPotion(3042, 2483, 3138, 76, 173);
        this.ZAMORAK_BREW = new FinishedPotion(189, 111, 247, 78, 175);
        this.SARADOMIN_BREW = new FinishedPotion(6687, 3002, 6693, 81, 180);
        this.RECOVER_SPECIAL = new FinishedPotion(15301, 3018, 5972, 84, 200);
        this.SUPER_ANTIFIRE = new FinishedPotion(15305, 2454, 4621, 85, 210);
        this.SUPER_PRAYER = new FinishedPotion(15329, 139, 4255, 94, 270);
        this.SUPER_ANTIPOISON = new FinishedPotion(181, 101, 235, 48, 103);
        this.HUNTER_POTION = new FinishedPotion(10000, 103, 10111, 53, 110);
        this.FLETCHING_POTION = new FinishedPotion(14848, 103, 11525, 58, 105);
        this.ANTIPOISON_PLUS = new FinishedPotion(5945, 3002, 6049, 68, 15);
        this.finishedPotion = finishedPotion;
        this.unfinishedPotion = unfinishedPotion;
        this.itemNeeded = itemNeeded;
        this.levelReq = levelReq;
        this.expGained = expGained;
    }
    FinishedPotion.requiredItems = function (potion, usedItem, usedOn) {
        return ((potion.itemNeeded === usedItem || potion.itemNeeded === usedOn) && (potion.unfinishedPotion === usedItem
            || potion.unfinishedPotion == usedOn));
    };
    FinishedPotion.prototype.getFinishedPotion = function () {
        return this.finishedPotion;
    };
    FinishedPotion.prototype.getUnfinishedPotion = function () {
        return this.unfinishedPotion;
    };
    FinishedPotion.prototype.getItemNeeded = function () {
        return this.itemNeeded;
    };
    FinishedPotion.prototype.getLevelReq = function () {
        return this.levelReq;
    };
    FinishedPotion.prototype.getExpGained = function () {
        return this.expGained;
    };
    var _a;
    _a = FinishedPotion;
    FinishedPotion.potions = new Map();
    (function () {
        var e_3, _b;
        try {
            for (var _c = __values(Object.values(FinishedPotion)), _d = _c.next(); !_d.done; _d = _c.next()) {
                var potion = _d.value;
                _a.potions.set(potion.finishedPotion, potion);
                _a.potions.set(potion.itemNeeded, potion);
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
    FinishedPotion.forId = function (usedItem, usedOn) {
        var potion = _a.potions.get(usedItem);
        if (potion != null) {
            if (_a.requiredItems(potion, usedItem, usedOn)) {
                return potion;
            }
        }
        potion = _a.potions.get(usedOn);
        if (potion != null) {
            if (_a.requiredItems(potion, usedItem, usedOn)) {
                return potion;
            }
        }
        return undefined;
    };
    return FinishedPotion;
}());
var PotionDose = /** @class */ (function () {
    function PotionDose(oneDosePotionID, twoDosePotionID, threeDosePotionID, fourDosePotionID, vial, potionName) {
        this.STRENGTH = new PotionDose(119, 117, 115, 113, ItemIdentifiers_1.ItemIdentifiers.VIAL_OF_WATER, "Strength");
        this.SUPER_STRENGTH = new PotionDose(161, 159, 157, 2440, ItemIdentifiers_1.ItemIdentifiers.VIAL_OF_WATER, "Super strength");
        this.SUPER_COMBAT = new PotionDose(12701, 12699, 12697, 12695, ItemIdentifiers_1.ItemIdentifiers.VIAL_OF_WATER, "Super combat");
        this.ATTACK = new PotionDose(125, 123, 121, 2428, ItemIdentifiers_1.ItemIdentifiers.VIAL_OF_WATER, "Attack");
        this.SUPER_ATTACK = new PotionDose(149, 147, 145, 2436, ItemIdentifiers_1.ItemIdentifiers.VIAL_OF_WATER, "Super attack");
        this.DEFENCE = new PotionDose(137, 135, 133, 2432, ItemIdentifiers_1.ItemIdentifiers.VIAL_OF_WATER, "Defence");
        this.SUPER_DEFENCE = new PotionDose(167, 165, 163, 2442, ItemIdentifiers_1.ItemIdentifiers.VIAL_OF_WATER, "Super defence");
        this.RANGING_POTION = new PotionDose(173, 171, 169, 2444, ItemIdentifiers_1.ItemIdentifiers.VIAL_OF_WATER, "Ranging");
        this.FISHING = new PotionDose(155, 153, 151, 2438, ItemIdentifiers_1.ItemIdentifiers.VIAL_OF_WATER, "Fishing");
        this.PRAYER = new PotionDose(143, 141, 139, 2434, ItemIdentifiers_1.ItemIdentifiers.VIAL_OF_WATER, "Prayer");
        this.ANTIFIRE = new PotionDose(458, 2456, 2454, 2452, ItemIdentifiers_1.ItemIdentifiers.VIAL_OF_WATER, "Antifire");
        this.ZAMORAK_BREW = new PotionDose(193, 191, 189, 2450, ItemIdentifiers_1.ItemIdentifiers.VIAL_OF_WATER, "Zamorakian brew");
        this.ANTIPOISON = new PotionDose(179, 177, 175, 2446, ItemIdentifiers_1.ItemIdentifiers.VIAL_OF_WATER, "Antipoison");
        this.RESTORE = new PotionDose(131, 129, 127, 2430, ItemIdentifiers_1.ItemIdentifiers.VIAL_OF_WATER, "Restoration");
        this.MAGIC_POTION = new PotionDose(3046, 3044, 3042, 3040, ItemIdentifiers_1.ItemIdentifiers.VIAL_OF_WATER, "Magic");
        this.SUPER_RESTORE = new PotionDose(3030, 3028, 3026, 3024, ItemIdentifiers_1.ItemIdentifiers.VIAL_OF_WATER, "Super Restoration");
        this.ENERGY = new PotionDose(3014, 3012, 3010, 3008, ItemIdentifiers_1.ItemIdentifiers.VIAL_OF_WATER, "Energy");
        this.SUPER_ENERGY = new PotionDose(3022, 3020, 3018, 3016, ItemIdentifiers_1.ItemIdentifiers.VIAL_OF_WATER, "Super Energy");
        this.AGILITY = new PotionDose(3038, 3036, 3034, 3032, ItemIdentifiers_1.ItemIdentifiers.VIAL_OF_WATER, "Agility");
        this.SARADOMIN_BREW = new PotionDose(6691, 6689, 6687, 6685, ItemIdentifiers_1.ItemIdentifiers.VIAL_OF_WATER, "Saradomin brew");
        this.ANTIPOISON1 = new PotionDose(5949, 5947, 5945, 5943, ItemIdentifiers_1.ItemIdentifiers.VIAL_OF_WATER, "Antipoison (+)");
        this.ANTIPOISON2 = new PotionDose(5958, 5956, 5954, 5952, ItemIdentifiers_1.ItemIdentifiers.VIAL_OF_WATER, "Antipoison (++)");
        this.SUPER_ANTIPOISON = new PotionDose(185, 183, 181, 2448, ItemIdentifiers_1.ItemIdentifiers.VIAL_OF_WATER, "Super Antipoison");
        this.RELICYMS_BALM = new PotionDose(4848, 4846, 4844, 4842, ItemIdentifiers_1.ItemIdentifiers.VIAL_OF_WATER, "Relicym's balm");
        this.SERUM_207 = new PotionDose(3414, 3412, 3410, 3408, ItemIdentifiers_1.ItemIdentifiers.VIAL_OF_WATER, "Serum 207");
        this.COMBAT = new PotionDose(9745, 9743, 9741, 9739, ItemIdentifiers_1.ItemIdentifiers.VIAL_OF_WATER, "Combat");
        this.oneDosePotionID = oneDosePotionID;
        this.twoDosePotionID = twoDosePotionID;
        this.threeDosePotionID = threeDosePotionID;
        this.fourDosePotionID = fourDosePotionID;
        this.vial = vial;
        this.potionName = potionName;
    }
    PotionDose.forId = function (itemId) {
        return this.potions[itemId];
    };
    PotionDose.prototype.getDoseID1 = function () {
        return this.oneDosePotionID;
    };
    PotionDose.prototype.getDoseID2 = function () {
        return this.twoDosePotionID;
    };
    PotionDose.prototype.getDoseID3 = function () {
        return this.threeDosePotionID;
    };
    PotionDose.prototype.getFourDosePotionID = function () {
        return this.fourDosePotionID;
    };
    PotionDose.prototype.getVial = function () {
        return this.vial;
    };
    PotionDose.prototype.getPotionName = function () {
        return this.potionName;
    };
    PotionDose.prototype.getDoseForID = function (id) {
        if (id == this.oneDosePotionID) {
            return 1;
        }
        if (id == this.twoDosePotionID) {
            return 2;
        }
        if (id == this.threeDosePotionID) {
            return 3;
        }
        if (id == this.fourDosePotionID) {
            return 4;
        }
        return -1;
    };
    PotionDose.prototype.getIDForDose = function (dose) {
        if (dose == 1) {
            return this.oneDosePotionID;
        }
        if (dose == 2) {
            return this.twoDosePotionID;
        }
        if (dose == 3) {
            return this.threeDosePotionID;
        }
        if (dose == 4) {
            return this.fourDosePotionID;
        }
        if (dose == 0) {
            return ItemIdentifiers_1.ItemIdentifiers.EMPTY_VIAL;
        }
        return -1;
    };
    var _b;
    _b = PotionDose;
    PotionDose.potions = new Map();
    (function () {
        var e_4, _c;
        try {
            for (var _d = __values(Object.values(PotionDose)), _e = _d.next(); !_e.done; _e = _d.next()) {
                var potion = _e.value;
                _b.potions.set(potion.oneDosePotionID, potion);
                _b.potions.set(potion.twoDosePotionID, potion);
                _b.potions.set(potion.threeDosePotionID, potion);
                _b.potions.set(potion.fourDosePotionID, potion);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_c = _d.return)) _c.call(_d);
            }
            finally { if (e_4) throw e_4.error; }
        }
    })();
    return PotionDose;
}());
//# sourceMappingURL=Herblore.js.map