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
exports.CraftableGem = void 0;
var ItemIdentifiers_1 = require("../../../../../util/ItemIdentifiers");
var AnimationLoop_1 = require("../../../../model/AnimationLoop");
var Animation_1 = require("../../../../model/Animation");
var CreationMenu_1 = require("../../../../model/menu/CreationMenu");
var ItemCreationSkillable_1 = require("./ItemCreationSkillable");
var RequiredItem_1 = require("../../../../model/RequiredItem");
var Item_1 = require("../../../../model/Item");
var Skill_1 = require("../../../../model/Skill");
var CraftingCreationMenuAction = /** @class */ (function () {
    function CraftingCreationMenuAction(func) {
        this.func = func;
    }
    CraftingCreationMenuAction.prototype.execute = function (item, amount) {
        this.func(item, amount);
    };
    return CraftingCreationMenuAction;
}());
var Crafting = /** @class */ (function (_super) {
    __extends(Crafting, _super);
    function Crafting() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Crafting.craftGem = function (player, itemUsed, itemUsedWith) {
        if (itemUsed == ItemIdentifiers_1.ItemIdentifiers.CHISEL || itemUsedWith == ItemIdentifiers_1.ItemIdentifiers.CHISEL) {
            var gem_1 = CraftableGem.map.get(itemUsed == ItemIdentifiers_1.ItemIdentifiers.CHISEL ? itemUsedWith : itemUsed);
            if (gem_1) {
                player.getPacketSender().sendCreationMenu(new CreationMenu_1.CreationMenu("How many would you like to cut?", [gem_1.getCut().getId()], new CraftingCreationMenuAction(function (itemId, amount) {
                    player.getSkillManager().startSkillable(new ItemCreationSkillable_1.ItemCreationSkillable([new RequiredItem_1.RequiredItem(new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.CHISEL), false), new RequiredItem_1.RequiredItem(gem_1.getUncut(), true)], gem_1.getCut(), amount, gem_1.getAnimationLoop(), gem_1.getLevel(), gem_1.getExp(), Skill_1.Skill.CRAFTING));
                })));
                return true;
            }
        }
        return false;
    };
    return Crafting;
}(ItemIdentifiers_1.ItemIdentifiers));
var CraftableGem = exports.CraftableGem = /** @class */ (function () {
    function CraftableGem(cut, uncut, level, exp, animLoop) {
        this.cut = cut;
        this.uncut = uncut;
        this.exp = exp;
        this.animLoop = animLoop;
    }
    CraftableGem.prototype.getCut = function () {
        return this.cut;
    };
    CraftableGem.prototype.getUncut = function () {
        return this.uncut;
    };
    CraftableGem.prototype.getLevel = function () {
        return this.level;
    };
    CraftableGem.prototype.getExp = function () {
        return this.exp;
    };
    CraftableGem.prototype.getAnimationLoop = function () {
        return this.animLoop;
    };
    CraftableGem.G1 = new CraftableGem(new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.OPAL), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.UNCUT_OPAL), 1, 15, new AnimationLoop_1.AnimationLoop(new Animation_1.Animation(890), 3));
    CraftableGem.G2 = new CraftableGem(new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.JADE), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.UNCUT_JADE), 13, 20, new AnimationLoop_1.AnimationLoop(new Animation_1.Animation(891), 3));
    CraftableGem.G3 = new CraftableGem(new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.RED_TOPAZ), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.UNCUT_RED_TOPAZ), 16, 25, new AnimationLoop_1.AnimationLoop(new Animation_1.Animation(892), 3));
    CraftableGem.G4 = new CraftableGem(new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.SAPPHIRE), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.UNCUT_SAPPHIRE), 20, 50, new AnimationLoop_1.AnimationLoop(new Animation_1.Animation(888), 3));
    CraftableGem.G5 = new CraftableGem(new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.EMERALD), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.UNCUT_EMERALD), 27, 68, new AnimationLoop_1.AnimationLoop(new Animation_1.Animation(889), 3));
    CraftableGem.G6 = new CraftableGem(new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.RUBY), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.UNCUT_RUBY), 34, 85, new AnimationLoop_1.AnimationLoop(new Animation_1.Animation(887), 3));
    CraftableGem.G7 = new CraftableGem(new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.DIAMOND), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.UNCUT_DIAMOND), 43, 108, new AnimationLoop_1.AnimationLoop(new Animation_1.Animation(886), 3));
    CraftableGem.G8 = new CraftableGem(new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.DRAGONSTONE), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.UNCUT_DRAGONSTONE), 55, 138, new AnimationLoop_1.AnimationLoop(new Animation_1.Animation(885), 3));
    CraftableGem.G9 = new CraftableGem(new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.ONYX), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.UNCUT_ONYX), 67, 168, new AnimationLoop_1.AnimationLoop(new Animation_1.Animation(885), 3));
    CraftableGem.G10 = new CraftableGem(new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.ZENYTE), new Item_1.Item(ItemIdentifiers_1.ItemIdentifiers.UNCUT_ZENYTE), 89, 200, new AnimationLoop_1.AnimationLoop(new Animation_1.Animation(885), 3));
    CraftableGem.map = new Map();
    (function () {
        var e_1, _a;
        try {
            for (var _b = __values(Object.values(CraftableGem)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var c = _c.value;
                CraftableGem.map.set(c.getUncut().getId(), c);
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
    return CraftableGem;
}());
//# sourceMappingURL=Crafting.js.map