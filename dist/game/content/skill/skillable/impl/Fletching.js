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
exports.Fletching = void 0;
var ItemDefinition_1 = require("../../../../definition/ItemDefinition");
var Skill_1 = require("../../../../model/Skill");
var Item_1 = require("../../../../model/Item");
var ItemIdentifiers_1 = require("../../../../../util/ItemIdentifiers");
var CreationMenu_1 = require("../../../../model/menu/CreationMenu");
var ItemCreationSkillable_1 = require("./ItemCreationSkillable");
var RequiredItem_1 = require("../../../../model/RequiredItem");
var Animation_1 = require("../../../../model/Animation");
var AnimationLoop_1 = require("../../../../model/AnimationLoop");
var FlecthingMenu = /** @class */ (function () {
    function FlecthingMenu(execFunc) {
        this.execFunc = execFunc;
    }
    FlecthingMenu.prototype.execute = function (item, amount) {
        this.execFunc();
    };
    return FlecthingMenu;
}());
var Fletching = exports.Fletching = /** @class */ (function (_super) {
    __extends(Fletching, _super);
    function Fletching() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
 * Attempts to fletch ammo.
 *
 * @param player
 * @param itemUsed
 * @param itemUsedWith
 * @return
 */
    Fletching.fletchAmmo = function (player, itemUsed, itemUsedWith) {
        var e_1, _b;
        try {
            //Making ammo such as bolts and arrows..
            for (var _c = __values(Object.values(FletchableAmmo)), _d = _c.next(); !_d.done; _d = _c.next()) {
                var ammo = _d.value;
                if ((ammo.getItem1() == itemUsed || ammo.getItem1() == itemUsedWith)
                    && (ammo.getItem2() == itemUsed || ammo.getItem2() == itemUsedWith)) {
                    if (player.getSkillManager().getCurrentLevel(Skill_1.Skill.FLETCHING) >= ammo.getLevelReq()) {
                        if (player.getInventory().getAmount(ammo.getItem1()) >= 10 && player.getInventory().getAmount(ammo.getItem2()) >= 10) {
                            player.getInventory().delete(ammo.getItem1(), 10);
                            player.getInventory().delete(ammo.getItem2(), 10);
                            player.getInventory().adds(ammo.getOutcome(), 10);
                            player.getSkillManager().addExperiences(Skill_1.Skill.FLETCHING, ammo.getXp());
                            var name_1 = ItemDefinition_1.ItemDefinition.forId(ammo.getOutcome()).getName();
                            if (!name_1.endsWith("s"))
                                name_1 += "s";
                            player.getPacketSender().sendMessage("You make some " + name_1 + ".");
                        }
                        else {
                            player.getPacketSender().sendMessage("You must have at least 10 of each supply when fletching a set.");
                        }
                    }
                    else {
                        player.getPacketSender().sendMessage("You need a Fletching level of at least " + ammo.getLevelReq() + " to fletch this.");
                    }
                    return true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return false;
    };
    var _a;
    _a = Fletching;
    Fletching.CUTTING_LOGS_ANIM = new Animation_1.Animation(1248);
    Fletching.fletchCrossbow = function (player, itemUsed, itemUsedWith) {
        var e_2, _b;
        var _loop_1 = function (c) {
            if ((c.getStock() === itemUsed || c.getStock() === itemUsedWith)
                && (c.getLimbs() === itemUsed || c.getLimbs() === itemUsedWith)) {
                player.getPacketSender().sendCreationMenu(new CreationMenu_1.CreationMenu("How many would you like to make?", [c.getUnstrung()], new FlecthingMenu(function (itemId, amount) {
                    player.getSkillManager().startSkillable(new ItemCreationSkillable_1.ItemCreationSkillable([new RequiredItem_1.RequiredItem(new Item_1.Item(c.getStock()), true), new RequiredItem_1.RequiredItem(new Item_1.Item(c.getLimbs()), true)], new Item_1.Item(c.getUnstrung()), amount, null, c.getLevel(), c.getLimbsExp(), Skill_1.Skill.FLETCHING));
                })));
                return { value: true };
            }
        };
        try {
            for (var _c = __values(Object.values(FletchableCrossbow)), _d = _c.next(); !_d.done; _d = _c.next()) {
                var c = _d.value;
                var state_1 = _loop_1(c);
                if (typeof state_1 === "object")
                    return state_1.value;
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return false;
    };
    Fletching.stringBow = function (player, itemUsed, itemUsedWith) {
        if (itemUsed === _a.BOW_STRING || itemUsedWith === _a.BOW_STRING || itemUsed === _a.CROSSBOW_STRING || itemUsedWith === _a.CROSSBOW_STRING) {
            var string = itemUsed === _a.BOW_STRING || itemUsed === _a.CROSSBOW_STRING ? itemUsed : itemUsedWith;
            var unstrung = itemUsed === _a.BOW_STRING || itemUsed === _a.CROSSBOW_STRING ? itemUsedWith : itemUsed;
            var bow_1 = StringableBow.unstrungBows.get(unstrung);
            if (bow_1) {
                if (bow_1.getBowStringId() === string) {
                    player.getPacketSender().sendCreationMenu(new CreationMenu_1.CreationMenu("How many would you like to make?", [bow_1.getResult()], new FlecthingMenu(function (itemId, amount) {
                        player.getSkillManager().startSkillable(new ItemCreationSkillable_1.ItemCreationSkillable([new RequiredItem_1.RequiredItem(new Item_1.Item(bow_1.getItemId()), true), new RequiredItem_1.RequiredItem(new Item_1.Item(bow_1.getBowStringId()), true)], new Item_1.Item(bow_1.getResult()), amount, new AnimationLoop_1.AnimationLoop(bow_1.getAnimation(), 3), bow_1.getLevelReq(), bow_1.getExp(), Skill_1.Skill.FLETCHING));
                    })));
                    return true;
                }
                else {
                    player.getPacketSender().sendMessage("This bow cannot be strung with that.");
                    return false;
                }
            }
        }
        return false;
    };
    Fletching.fletchLog = function (player, itemUsed, itemUsedWith) {
        if (itemUsed === ItemIdentifiers_1.ItemIdentifiers.KNIFE || itemUsedWith === ItemIdentifiers_1.ItemIdentifiers.KNIFE) {
            var logId = itemUsed === ItemIdentifiers_1.ItemIdentifiers.KNIFE ? itemUsedWith : itemUsed;
            var list_1 = FletchableLog.logs.get(logId);
            if (list_1) {
                var products = [];
                for (var i = 0; i < list_1.getFletchable().length; i++) {
                    products.push(list_1.getFletchable()[i].getProduct().getId());
                }
                var menu = new CreationMenu_1.CreationMenu("What would you like to make?", products, new FlecthingMenu(function (itemId, amount) {
                    var e_3, _b;
                    try {
                        for (var _c = __values(list_1.getFletchable()), _d = _c.next(); !_d.done; _d = _c.next()) {
                            var fl = _d.value;
                            if (fl.getProduct().getId() === itemId) {
                                player.getSkillManager().startSkillable(new ItemCreationSkillable_1.ItemCreationSkillable([new RequiredItem_1.RequiredItem(new Item_1.Item(_a.KNIFE), false), new RequiredItem_1.RequiredItem(new Item_1.Item(list_1.getLogId()), true)], fl.getProduct(), amount, new AnimationLoop_1.AnimationLoop(fl.getAnimation(), 3), fl.getLevelRequired(), fl.getExperience(), Skill_1.Skill.FLETCHING));
                            }
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                }));
                player.getPacketSender().sendCreationMenu(menu);
                return true;
            }
        }
        return false;
    };
    return Fletching;
}(ItemIdentifiers_1.ItemIdentifiers));
var FletchableAmmo = /** @class */ (function () {
    function FletchableAmmo(item1, item2, outcome, xp, levelReq) {
        this.item1 = item1;
        this.item2 = item2;
        this.outcome = outcome;
        this.xp = xp;
        this.levelReq = levelReq;
        this.HEADLESS_ARROWS = { id: 52, arrowHead: 314, product: 53, level: 15, exp: 1 };
        this.BRONZE_ARROWS = { id: 53, arrowHead: 39, product: 882, level: 20, exp: 1 };
        this.IRON_ARROWS = { id: 53, arrowHead: 40, product: 884, level: 38, exp: 15 };
        this.STEEL_ARROWS = { id: 53, arrowHead: 41, product: 886, level: 75, exp: 30 };
        this.MITHRIL_ARROWS = { id: 53, arrowHead: 42, product: 888, level: 113, exp: 45 };
        this.ADAMANT_ARROWS = { id: 53, arrowHead: 43, product: 890, level: 150, exp: 60 };
        this.RUNE_ARROWS = { id: 53, arrowHead: 44, product: 892, level: 188, exp: 75 };
        this.DRAGON_ARROWS = { id: 53, arrowHead: 11237, product: 11212, level: 225, exp: 90 };
        this.BRONZE_DARTS = { id: 314, arrowHead: 819, product: 806, level: 2, exp: 10 };
        this.IRON_DARTS = { id: 314, arrowHead: 820, product: 807, level: 4, exp: 22 };
        this.STEEL_DARTS = { id: 314, arrowHead: 821, product: 808, level: 8, exp: 37 };
        this.MITHRIL_DARTS = { id: 314, arrowHead: 822, product: 809, level: 12, exp: 52 };
        this.ADAMANT_DARTS = { id: 314, arrowHead: 823, product: 810, level: 15, exp: 67 };
        this.RUNE_DARTS = { id: 314, arrowHead: 824, product: 811, level: 20, exp: 81 };
        this.DRAGON_DARTS = { id: 314, arrowHead: 11232, product: 11230, level: 25, exp: 95 };
        this.BRONZE_BOLTS = { id: 314, arrowHead: 9375, product: 877, level: 5, exp: 9 };
        this.OPAL_BOLTS = { id: 877, arrowHead: 45, product: 879, level: 16, exp: 11 };
        this.IRON_BOLTS = { id: 314, arrowHead: 9377, product: 9140, level: 15, exp: 39 };
        this.PEARL_BOLTS = { id: 9140, arrowHead: 46, product: 880, level: 32, exp: 41 };
        this.SILVER_BOLTS = { id: 314, arrowHead: 9382, product: 9145, level: 25, exp: 43 };
        this.STEEL_BOLTS = { id: 314, arrowHead: 9378, product: 9141, level: 35, exp: 46 };
        this.RED_TOPAZ_BOLTS = { id: 9141, arrowHead: 9188, product: 9336, level: 39, exp: 48 };
        this.BARBED_BOLTS = { id: 877, arrowHead: 47, product: 881, level: 30, exp: 55 };
        this.MITHRIL_BOLTS = { id: 314, arrowHead: 9379, product: 9142, level: 50, exp: 54 };
        this.BROAD_BOLTS = { id: 314, arrowHead: 11876, product: 11875, level: 30, exp: 55 };
        this.SAPPHIRE_BOLTS = { id: 9142, arrowHead: 9189, product: 9337, level: 47, exp: 56 };
        this.EMERALD_BOLTS = { id: 9142, arrowHead: 9190, product: 9338, level: 58, exp: 55 };
        this.ADAMANTITE_BOLTS = { id: 314, arrowHead: 9380, product: 9143, level: 70, exp: 61 };
        this.RUBY_BOLTS = { id: 9143, arrowHead: 9191, product: 9339, level: 63, exp: 63 };
        this.DIAMOND_BOLTS = { id: 9143, arrowHead: 9192, product: 9340, level: 70, exp: 65 };
        this.RUNITE_BOLTS = { id: 314, arrowHead: 9381, product: 9144, level: 100, exp: 69 };
        this.DRAGONSTONE_BOLTS = { id: 9144, arrowHead: 9193, product: 9341, level: 82, exp: 71 };
        this.ONYX_BOLTS = { id: 9144, arrowHead: 9194, product: 9342, level: 94, exp: 73 };
    }
    FletchableAmmo.prototype.getItem1 = function () {
        return this.item1;
    };
    FletchableAmmo.prototype.getItem2 = function () {
        return this.item2;
    };
    FletchableAmmo.prototype.getOutcome = function () {
        return this.outcome;
    };
    FletchableAmmo.prototype.getXp = function () {
        return this.xp;
    };
    FletchableAmmo.prototype.getLevelReq = function () {
        return this.levelReq;
    };
    return FletchableAmmo;
}());
var FletchableCrossbow = /** @class */ (function () {
    function FletchableCrossbow(stock, limbs, unstrung, level, limbsExp) {
        this.BRONZE_CROSSBOW = { stock: Fletching.WOODEN_STOCK, limbs: Fletching.BRONZE_LIMBS, unstrung: Fletching.BRONZE_CROSSBOW_U_, level: 9, limbsExp: 12 };
        this.IRON_CROSSBOW = { stock: Fletching.OAK_STOCK, limbs: Fletching.IRON_LIMBS, unstrung: Fletching.IRON_CROSSBOW_U_, level: 39, limbsExp: 44 };
        this.STEEL_CROSSBOW = { stock: Fletching.WILLOW_STOCK, limbs: Fletching.STEEL_LIMBS, unstrung: Fletching.STEEL_CROSSBOW_U_, level: 46, limbsExp: 54 };
        this.MITHRIL_CROSSBOW = { stock: Fletching.MAPLE_STOCK, limbs: Fletching.MITHRIL_LIMBS, unstrung: Fletching.MITHRIL_CROSSBOW_U_, level: 54, limbsExp: 64 };
        this.ADAMANT_CROSSBOW = { stock: Fletching.MAHOGANY_STOCK, limbs: Fletching.ADAMANTITE_LIMBS, unstrung: Fletching.ADAMANT_CROSSBOW_U_, level: 61, limbsExp: 82 };
        this.RUNE_CROSSBOW = { stock: Fletching.YEW_STOCK, limbs: Fletching.RUNITE_LIMBS, unstrung: Fletching.RUNITE_CROSSBOW_U_, level: 69, limbsExp: 100 };
        this.stock = stock;
        this.limbs = limbs;
        this.unstrung = unstrung;
        this.level = level;
        this.limbsExp = limbsExp;
    }
    FletchableCrossbow.prototype.getStock = function () {
        return this.stock;
    };
    FletchableCrossbow.prototype.getUnstrung = function () {
        return this.unstrung;
    };
    FletchableCrossbow.prototype.getLimbs = function () {
        return this.limbs;
    };
    FletchableCrossbow.prototype.getLevel = function () {
        return this.level;
    };
    FletchableCrossbow.prototype.getLimbsExp = function () {
        return this.limbsExp;
    };
    return FletchableCrossbow;
}());
var StringableBow = /** @class */ (function () {
    function StringableBow(itemId, bowStringId, result, levelReq, exp, animation) {
        //Regular bows
        this.SB = [Fletching.SHORTBOW_U_, Fletching.BOW_STRING, Fletching.SHORTBOW, 5, 10, new Animation_1.Animation(6678)];
        this.SL = [Fletching.LONGBOW_U_, Fletching.BOW_STRING, Fletching.LONGBOW, 10, 20, new Animation_1.Animation(6684)];
        this.OSB = [Fletching.OAK_SHORTBOW_U_, Fletching.BOW_STRING, Fletching.OAK_SHORTBOW, 20, 33, new Animation_1.Animation(6679)];
        this.OSL = [Fletching.OAK_LONGBOW_U_, Fletching.BOW_STRING, Fletching.OAK_LONGBOW, 25, 50, new Animation_1.Animation(6685)];
        this.WSB = [Fletching.WILLOW_SHORTBOW_U_, Fletching.BOW_STRING, Fletching.WILLOW_SHORTBOW, 35, 66, new Animation_1.Animation(6680)];
        this.WLB = [Fletching.WILLOW_LONGBOW_U_, Fletching.BOW_STRING, Fletching.WILLOW_LONGBOW, 40, 83, new Animation_1.Animation(6686)];
        this.MASB = [Fletching.MAPLE_SHORTBOW_U_, Fletching.BOW_STRING, Fletching.MAPLE_SHORTBOW, 50, 100, new Animation_1.Animation(6681)];
        this.MASL = [Fletching.MAPLE_LONGBOW_U_, Fletching.BOW_STRING, Fletching.MAPLE_LONGBOW, 55, 116, new Animation_1.Animation(6687)];
        this.YSB = [Fletching.YEW_SHORTBOW_U_, Fletching.BOW_STRING, Fletching.YEW_SHORTBOW, 65, 135, new Animation_1.Animation(6682)];
        this.YLB = [Fletching.YEW_LONGBOW_U_, Fletching.BOW_STRING, Fletching.YEW_LONGBOW, 70, 150, new Animation_1.Animation(6688)];
        this.MSB = [Fletching.MAGIC_SHORTBOW_U_, Fletching.BOW_STRING, Fletching.MAGIC_SHORTBOW, 80, 166, new Animation_1.Animation(6683)];
        this.MSL = [Fletching.MAGIC_LONGBOW_U_, Fletching.BOW_STRING, Fletching.MAGIC_LONGBOW, 85, 183, new Animation_1.Animation(6689)];
        //Crossbows
        this.BCBOW = [Fletching.BRONZE_CROSSBOW_U_, Fletching.CROSSBOW_STRING, Fletching.BRONZE_CROSSBOW, 9, 12, new Animation_1.Animation(6671)];
        this.ICBOW = [Fletching.IRON_CROSSBOW_U_, Fletching.CROSSBOW_STRING, Fletching.IRON_CROSSBOW, 39, 44, new Animation_1.Animation(6673)];
        this.SCBOW = [Fletching.STEEL_CROSSBOW_U_, Fletching.CROSSBOW_STRING, Fletching.STEEL_CROSSBOW, 46, 54, new Animation_1.Animation(6674)];
        this.MCBOW = [Fletching.MITHRIL_CROSSBOW_U_, Fletching.CROSSBOW_STRING, Fletching.MITH_CROSSBOW, 54, 64, new Animation_1.Animation(6675)];
        this.ACBOW = [Fletching.ADAMANT_CROSSBOW_U_, Fletching.CROSSBOW_STRING, Fletching.ADAMANT_CROSSBOW, 61, 82, new Animation_1.Animation(6676)];
        this.RCBOW = [Fletching.RUNITE_CROSSBOW_U_, Fletching.CROSSBOW_STRING, Fletching.RUNE_CROSSBOW, 69, 100, new Animation_1.Animation(6677)];
        this.itemId = itemId;
        this.bowStringId = bowStringId;
        this.result = result;
        this.levelReq = levelReq;
        this.exp = exp;
        this.animation = animation;
    }
    StringableBow.init = function () {
        var e_4, _b;
        try {
            for (var _c = __values(Object.values(StringableBow)), _d = _c.next(); !_d.done; _d = _c.next()) {
                var l = _d.value;
                this.unstrungBows.set(l.getItemId(), l);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
            }
            finally { if (e_4) throw e_4.error; }
        }
    };
    StringableBow.prototype.getItemId = function () {
        return this.itemId;
    };
    StringableBow.prototype.getBowStringId = function () {
        return this.bowStringId;
    };
    StringableBow.prototype.getResult = function () {
        return this.result;
    };
    StringableBow.prototype.getLevelReq = function () {
        return this.levelReq;
    };
    StringableBow.prototype.getExp = function () {
        return this.exp;
    };
    StringableBow.prototype.getAnimation = function () {
        return this.animation;
    };
    StringableBow.unstrungBows = new Map();
    return StringableBow;
}());
var FletchableLog = /** @class */ (function () {
    function FletchableLog(logId) {
        var fletchable = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            fletchable[_i - 1] = arguments[_i];
        }
        this.REGULAR = [Fletching.LOGS,
            new FletchableItem(new Item_1.Item(Fletching.ARROW_SHAFT, 15), 1, 5, Fletching.CUTTING_LOGS_ANIM),
            new FletchableItem(new Item_1.Item(Fletching.WOODEN_STOCK), 9, 6, Fletching.CUTTING_LOGS_ANIM),
            new FletchableItem(new Item_1.Item(Fletching.SHORTBOW_U_), 5, 10, Fletching.CUTTING_LOGS_ANIM),
            new FletchableItem(new Item_1.Item(Fletching.LONGBOW_U_), 10, 20, Fletching.CUTTING_LOGS_ANIM)];
        this.OAK = [Fletching.OAK_LOGS,
            new FletchableItem(new Item_1.Item(Fletching.ARROW_SHAFT, 30), 15, 10, Fletching.CUTTING_LOGS_ANIM),
            new FletchableItem(new Item_1.Item(Fletching.OAK_STOCK), 24, 16, Fletching.CUTTING_LOGS_ANIM),
            new FletchableItem(new Item_1.Item(Fletching.OAK_SHORTBOW_U_), 20, 33, Fletching.CUTTING_LOGS_ANIM),
            new FletchableItem(new Item_1.Item(Fletching.OAK_LONGBOW_U_), 25, 50, Fletching.CUTTING_LOGS_ANIM)];
        this.WILLOW = [Fletching.WILLOW_LOGS,
            new FletchableItem(new Item_1.Item(Fletching.ARROW_SHAFT, 45), 30, 15, Fletching.CUTTING_LOGS_ANIM),
            new FletchableItem(new Item_1.Item(Fletching.WILLOW_STOCK), 39, 22, Fletching.CUTTING_LOGS_ANIM),
            new FletchableItem(new Item_1.Item(Fletching.WILLOW_SHORTBOW_U_), 35, 66, Fletching.CUTTING_LOGS_ANIM),
            new FletchableItem(new Item_1.Item(Fletching.WILLOW_LONGBOW_U_), 40, 83, Fletching.CUTTING_LOGS_ANIM)];
        this.MAPLE = [Fletching.MAPLE_LOGS,
            new FletchableItem(new Item_1.Item(Fletching.ARROW_SHAFT, 60), 45, 20, Fletching.CUTTING_LOGS_ANIM),
            new FletchableItem(new Item_1.Item(Fletching.MAPLE_STOCK), 54, 32, Fletching.CUTTING_LOGS_ANIM),
            new FletchableItem(new Item_1.Item(Fletching.MAPLE_SHORTBOW_U_), 50, 100, Fletching.CUTTING_LOGS_ANIM),
            new FletchableItem(new Item_1.Item(Fletching.MAPLE_LONGBOW_U_), 55, 116, Fletching.CUTTING_LOGS_ANIM)];
        this.YEW = [Fletching.YEW_LOGS,
            new FletchableItem(new Item_1.Item(Fletching.ARROW_SHAFT, 75), 60, 25, Fletching.CUTTING_LOGS_ANIM),
            new FletchableItem(new Item_1.Item(Fletching.YEW_STOCK), 69, 50, Fletching.CUTTING_LOGS_ANIM),
            new FletchableItem(new Item_1.Item(Fletching.YEW_SHORTBOW_U_), 65, 135, Fletching.CUTTING_LOGS_ANIM),
            new FletchableItem(new Item_1.Item(Fletching.YEW_LONGBOW_U_), 70, 150, Fletching.CUTTING_LOGS_ANIM)];
        this.MAGIC = [Fletching.MAGIC_LOGS,
            new FletchableItem(new Item_1.Item(Fletching.ARROW_SHAFT, 90), 75, 30, Fletching.CUTTING_LOGS_ANIM),
            new FletchableItem(new Item_1.Item(Fletching.MAGIC_SHORTBOW_U_), 80, 166, Fletching.CUTTING_LOGS_ANIM),
            new FletchableItem(new Item_1.Item(Fletching.MAGIC_LONGBOW_U_), 85, 183, Fletching.CUTTING_LOGS_ANIM)];
        this.logId = logId;
        this.fletchable = fletchable;
    }
    FletchableLog.init = function () {
        var e_5, _b;
        try {
            for (var _c = __values(Object.values(FletchableLog)), _d = _c.next(); !_d.done; _d = _c.next()) {
                var l = _d.value;
                this.logs.set(l.getLogId(), l);
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
            }
            finally { if (e_5) throw e_5.error; }
        }
    };
    FletchableLog.prototype.getLogId = function () {
        return this.logId;
    };
    FletchableLog.prototype.getFletchable = function () {
        return this.fletchable;
    };
    FletchableLog.logs = new Map();
    return FletchableLog;
}());
var FletchableItem = /** @class */ (function () {
    function FletchableItem(product, levelRequired, experience, animation) {
        this.product = product;
        this.levelRequired = levelRequired;
        this.experience = experience;
        this.animation = animation;
    }
    FletchableItem.prototype.getProduct = function () {
        return this.product;
    };
    FletchableItem.prototype.getLevelRequired = function () {
        return this.levelRequired;
    };
    FletchableItem.prototype.getExperience = function () {
        return this.experience;
    };
    FletchableItem.prototype.getAnimation = function () {
        return this.animation;
    };
    return FletchableItem;
}());
//# sourceMappingURL=Fletching.js.map