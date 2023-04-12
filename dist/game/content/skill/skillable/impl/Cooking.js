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
exports.Cookable = exports.Cooking = void 0;
var Animation_1 = require("../../../../model/Animation");
var Skill_1 = require("../../../../model/Skill");
var ItemCreationSkillable_1 = require("./ItemCreationSkillable");
var RequiredItem_1 = require("../../../../model/RequiredItem");
var Item_1 = require("../../../../model/Item");
var AnimationLoop_1 = require("../../../../model/AnimationLoop");
var Misc_1 = require("../../../../../util/Misc");
var ItemDefinition_1 = require("../../../../definition/ItemDefinition");
var ObjectIdentifiers_1 = require("../../../../../util/ObjectIdentifiers");
var ObjectManager_1 = require("../../../../entity/impl/object/ObjectManager");
var Cooking = exports.Cooking = /** @class */ (function (_super) {
    __extends(Cooking, _super);
    function Cooking(object, cookable, amount) {
        var _this = _super.call(this, [new RequiredItem_1.RequiredItem(new Item_1.Item(cookable.getrawItem()), true)], new Item_1.Item(cookable.getcookedItem()), amount, new AnimationLoop_1.AnimationLoop(Cooking.ANIMATION, 4), cookable.getReqReq(), cookable.getxp(), Skill_1.Skill.COOKING) || this;
        _this.object = object;
        _this.cookable = cookable;
        return _this;
    }
    Cooking.success = function (player, burnBonus, ReqReq, stopBurn) {
        if (player.getSkillManager().getCurrentLevel(Skill_1.Skill.COOKING) >= stopBurn) {
            return true;
        }
        var burn_chance = (45.0 - burnBonus);
        var cook_Req = player.getSkillManager().getCurrentLevel(Skill_1.Skill.COOKING);
        var lev_needed = ReqReq;
        var burn_stop = stopBurn;
        var multi_a = (burn_stop - lev_needed);
        var burn_dec = (burn_chance / multi_a);
        var multi_b = (cook_Req - lev_needed);
        burn_chance -= (multi_b * burn_dec);
        var randNum = Misc_1.Misc.getRandomInt() * 100.0;
        return burn_chance <= randNum;
    };
    Cooking.prototype.finishedCycle = function (player) {
        // Decrement amount left to cook..
        this.decrementAmount();
        // Delete raw food..
        player.getInventory().deleteNumber(this.cookable.getrawItem(), 1);
        // Add burnt or cooked item..
        if (Cooking.success(player, 3, this.cookable.getReqReq(), this.cookable.getstopBurn())) {
            player.getInventory().adds(this.cookable.getcookedItem(), 1);
            player.getPacketSender()
                .sendMessage("You cook the " + ItemDefinition_1.ItemDefinition.forId(this.cookable.getrawItem()).getName() + ".");
            player.getSkillManager().addExperiences(Skill_1.Skill.COOKING, this.cookable.getxp());
        }
        else {
            player.getInventory().adds(this.cookable.getburntItem(), 1);
            player.getPacketSender()
                .sendMessage("You burn the " + ItemDefinition_1.ItemDefinition.forId(this.cookable.getrawItem()).getName() + ".");
        }
    };
    Cooking.prototype.hasRequirements = function (player) {
        // If we're using a fire, make sure to check it's still there.
        if (this.object.getId() == ObjectIdentifiers_1.ObjectIdentifiers.FIRE_5
            && !ObjectManager_1.ObjectManager.exists(ObjectIdentifiers_1.ObjectIdentifiers.FIRE_5, this.object.getLocation())) {
            return false;
        }
        return _super.prototype.hasRequirements.call(this, player);
    };
    Cooking.ANIMATION = new Animation_1.Animation(896);
    return Cooking;
}(ItemCreationSkillable_1.ItemCreationSkillable));
var Cookable = exports.Cookable = /** @class */ (function () {
    function Cookable(rawItem, cookedItem, burntItem, ReqReq, xp, stopBurn, name) {
        this.SHRIMP = {
            rawItem: 317,
            cookedItem: 315,
            Item: 7954,
            Req: 1,
            xp: 30,
            stopBurn: 33,
            name: "shrimp"
        };
        this.ANCHOVIES = {
            rawItem: 321,
            cookedItem: 319,
            Item: 323,
            Req: 1,
            xp: 30,
            stopBurn: 34,
            name: "anchovies"
        };
        this.TROUT = {
            rawItem: 335,
            cookedItem: 333,
            Item: 343,
            Req: 15,
            xp: 70,
            stopBurn: 50,
            name: "trout"
        };
        this.COD = {
            rawItem: 341,
            cookedItem: 339,
            Item: 343,
            Req: 18,
            xp: 75,
            stopBurn: 54,
            name: "cod"
        };
        this.SALMON = {
            rawItem: 331,
            cookedItem: 329,
            Item: 343,
            Req: 25,
            xp: 90,
            stopBurn: 58,
            name: "salmon"
        };
        this.TUNA = {
            rawItem: 359,
            cookedItem: 361,
            Item: 367,
            Req: 30,
            xp: 100,
            stopBurn: 58,
            name: "tuna"
        };
        this.LOBSTER = {
            rawItem: 377,
            cookedItem: 379,
            Item: 381,
            Req: 40,
            xp: 120,
            stopBurn: 74,
            name: "lobster"
        };
        this.BASS = {
            rawItem: 363,
            cookedItem: 365,
            Item: 367,
            Req: 40,
            xp: 130,
            stopBurn: 75,
            name: "bass"
        };
        this.SWORDFISH = {
            rawItem: 371,
            cookedItem: 373,
            Item: 375,
            Req: 45,
            xp: 140,
            stopBurn: 86,
            name: "swordfish"
        };
        this.MONKFISH = {
            rawItem: 7944,
            cookedItem: 7946,
            Item: 7948,
            Req: 62,
            xp: 150,
            stopBurn: 91,
            name: "monkfish"
        };
        this.SHARK = {
            rawItem: 383,
            cookedItem: 385,
            Item: 387,
            Req: 80,
            xp: 210,
            stopBurn: 94,
            name: "shark"
        };
        this.SEA_TURTLE = {
            rawItem: 395,
            cookedItem: 397,
            Item: 399,
            Req: 82,
            xp: 212,
            stopBurn: 105,
            name: "sea turtle"
        };
        this.MANTA_RAY = {
            rawItem: 389,
            cookedItem: 391,
            burntItem: 393,
            levelReq: 91,
            xp: 217,
            stopBurn: 99,
            name: "manta ray"
        };
        this.rawItem = rawItem;
        this.cookedItem = cookedItem;
        this.burntItem = burntItem;
        this.ReqReq = ReqReq;
        this.xp = xp;
        this.stopBurn = stopBurn;
        this.name = name;
    }
    //TODO IMPLEMENTAR INTERFACE E O METODO NEXT
    Cookable.initialize = function () {
        var e_1, _a;
        try {
            for (var _b = __values(Object.values(Cookable)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var c = _c.value;
                Cookable.cookables[c[0]] = c;
                Cookable.cookables[c[1]] = c;
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
    Cookable.getForItems = function (item) {
        return Cookable.cookables[item];
    };
    Cookable.getForItem = function (item) {
        return Cookable.cookables[item];
    };
    Cookable.prototype.getrawItem = function () {
        return this.rawItem;
    };
    Cookable.prototype.getcookedItem = function () {
        return this.cookedItem;
    };
    Cookable.prototype.getburntItem = function () {
        return this.burntItem;
    };
    Cookable.prototype.getReqReq = function () {
        return this.ReqReq;
    };
    Cookable.prototype.getxp = function () {
        return this.xp;
    };
    Cookable.prototype.getstopBurn = function () {
        return this.stopBurn;
    };
    Cookable.prototype.getname = function () {
        return this.name;
    };
    Cookable.cookables = {};
    return Cookable;
}());
//# sourceMappingURL=Cooking.js.map